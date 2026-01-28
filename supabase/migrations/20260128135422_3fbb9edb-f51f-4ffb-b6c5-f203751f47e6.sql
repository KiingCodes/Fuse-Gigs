-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('hustler', 'employer')),
  price_zar INTEGER NOT NULL,
  stripe_price_id TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL,
  applications_count INTEGER NOT NULL DEFAULT 0,
  posts_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Create boosts table
CREATE TABLE public.boosts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hustle_id UUID REFERENCES public.hustles(id) ON DELETE CASCADE,
  boost_type TEXT NOT NULL CHECK (boost_type IN ('gig_24h', 'featured_7d', 'profile', 'urgent', 'category_spotlight')),
  stripe_payment_id TEXT,
  price_zar INTEGER NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boosts ENABLE ROW LEVEL SECURITY;

-- Subscription plans policies (public read, admin write)
CREATE POLICY "Plans are viewable by everyone" ON public.subscription_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON public.subscription_plans FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- User subscriptions policies
CREATE POLICY "Users can view their subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage subscriptions" ON public.user_subscriptions FOR ALL USING (true);

-- Usage tracking policies
CREATE POLICY "Users can view their usage" ON public.usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their usage" ON public.usage_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can modify their usage" ON public.usage_tracking FOR UPDATE USING (auth.uid() = user_id);

-- Boosts policies
CREATE POLICY "Users can view their boosts" ON public.boosts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create boosts" ON public.boosts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can see active boosts" ON public.boosts FOR SELECT USING (is_active = true AND ends_at > now());

-- Insert default plans with ZAR pricing
INSERT INTO public.subscription_plans (name, slug, type, price_zar, features) VALUES
('Hustler Pro', 'hustler-pro', 'hustler', 4900, '["Unlimited gig applications", "Priority ranking in search", "Pro Hustler badge", "See who viewed profile", "Direct message employers first", "Application status insights", "24h early access to gigs", "Advanced filters", "Instant gig alerts", "Downloadable CV link"]'),
('Employer Pro', 'employer-pro', 'employer', 9900, '["Unlimited gig posts", "Pinned gigs at top", "Boosted visibility", "Verified Business badge", "View full applicant list", "Advanced talent filters", "Gig performance analytics", "Bulk messaging", "Priority support", "AI recommended hustlers"]');

-- Add trigger for updated_at
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_usage_tracking_updated_at BEFORE UPDATE ON public.usage_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();