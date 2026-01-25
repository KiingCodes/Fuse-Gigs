-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_hustler BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  hustle_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create hustles table (business listings)
CREATE TABLE public.hustles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  location TEXT,
  image_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create hustle_visits table (analytics)
CREATE TABLE public.hustle_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hustle_id UUID REFERENCES public.hustles(id) ON DELETE CASCADE NOT NULL,
  visitor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  visited_at TIMESTAMPTZ DEFAULT now(),
  referrer TEXT
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hustle_id UUID REFERENCES public.hustles(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (hustle_id, reviewer_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hustles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hustle_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Hustles policies
CREATE POLICY "Active hustles are viewable by everyone"
  ON public.hustles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Owners can view all their hustles"
  ON public.hustles FOR SELECT
  USING (owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Hustlers can create hustles"
  ON public.hustles FOR INSERT
  WITH CHECK (owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND is_hustler = true));

CREATE POLICY "Owners can update their hustles"
  ON public.hustles FOR UPDATE
  USING (owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can delete their hustles"
  ON public.hustles FOR DELETE
  USING (owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Hustle visits policies
CREATE POLICY "Anyone can track visits"
  ON public.hustle_visits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Hustle owners can view their visit stats"
  ON public.hustle_visits FOR SELECT
  USING (hustle_id IN (
    SELECT h.id FROM public.hustles h 
    JOIN public.profiles p ON h.owner_id = p.id 
    WHERE p.user_id = auth.uid()
  ));

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (reviewer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (reviewer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (reviewer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hustles_updated_at
  BEFORE UPDATE ON public.hustles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update category hustle count
CREATE OR REPLACE FUNCTION public.update_category_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.categories SET hustle_count = hustle_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.categories SET hustle_count = hustle_count - 1 WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id THEN
    UPDATE public.categories SET hustle_count = hustle_count - 1 WHERE id = OLD.category_id;
    UPDATE public.categories SET hustle_count = hustle_count + 1 WHERE id = NEW.category_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_category_hustle_count
  AFTER INSERT OR UPDATE OR DELETE ON public.hustles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_category_count();

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, color, display_order) VALUES
  ('Food & Dining', 'food-dining', 'UtensilsCrossed', '#f59e0b', 1),
  ('Arts & Crafts', 'arts-crafts', 'Palette', '#ec4899', 2),
  ('Services', 'services', 'Wrench', '#3b82f6', 3),
  ('Fashion', 'fashion', 'ShoppingBag', '#8b5cf6', 4),
  ('Photography', 'photography', 'Camera', '#06b6d4', 5),
  ('Music', 'music', 'Music', '#ef4444', 6),
  ('Plants & Garden', 'plants-garden', 'Leaf', '#22c55e', 7),
  ('Beauty', 'beauty', 'Scissors', '#f472b6', 8);

-- Create storage bucket for hustle images
INSERT INTO storage.buckets (id, name, public) VALUES ('hustle-images', 'hustle-images', true);

-- Storage policies
CREATE POLICY "Hustle images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hustle-images');

CREATE POLICY "Authenticated users can upload hustle images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'hustle-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own hustle images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'hustle-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own hustle images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'hustle-images' AND auth.uid()::text = (storage.foldername(name))[1]);