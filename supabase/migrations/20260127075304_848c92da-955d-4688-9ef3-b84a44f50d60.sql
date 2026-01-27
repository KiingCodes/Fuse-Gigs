-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Approved testimonials are public
CREATE POLICY "Approved testimonials are viewable by everyone"
ON public.testimonials FOR SELECT
USING (is_approved = true);

-- Users can create testimonials
CREATE POLICY "Authenticated users can create testimonials"
ON public.testimonials FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can view their own testimonials
CREATE POLICY "Users can view their own testimonials"
ON public.testimonials FOR SELECT
USING (user_id = auth.uid());

-- Admins can manage testimonials
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create function to notify hustle owner on new message
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_id UUID;
  conv_record RECORD;
  sender_name TEXT;
BEGIN
  -- Get conversation details
  SELECT * INTO conv_record FROM conversations WHERE id = NEW.conversation_id;
  
  -- Determine recipient (the other participant)
  IF conv_record.participant_one = NEW.sender_id THEN
    recipient_id := conv_record.participant_two;
  ELSE
    recipient_id := conv_record.participant_one;
  END IF;
  
  -- Get sender name
  SELECT COALESCE(username, 'Someone') INTO sender_name FROM profiles WHERE user_id = NEW.sender_id;
  
  -- Create notification
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    recipient_id,
    'new_message',
    'New message from ' || sender_name,
    LEFT(NEW.content, 100),
    '/dashboard/messages'
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for new messages
CREATE TRIGGER on_new_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_new_message();

-- Create function to notify on hustle visit
CREATE OR REPLACE FUNCTION public.notify_on_hustle_visit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hustle_owner_id UUID;
  hustle_name TEXT;
  visit_count INTEGER;
BEGIN
  -- Get hustle details
  SELECT h.name, p.user_id INTO hustle_name, hustle_owner_id
  FROM hustles h
  JOIN profiles p ON h.owner_id = p.id
  WHERE h.id = NEW.hustle_id;
  
  -- Count visits today for this hustle
  SELECT COUNT(*) INTO visit_count
  FROM hustle_visits
  WHERE hustle_id = NEW.hustle_id
  AND visited_at >= CURRENT_DATE;
  
  -- Only notify every 5 visits to avoid spam
  IF visit_count % 5 = 0 THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      hustle_owner_id,
      'hustle_visit',
      hustle_name || ' is getting attention!',
      'Your hustle has received ' || visit_count || ' visits today.',
      '/dashboard/analytics'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for hustle visits
CREATE TRIGGER on_hustle_visit
AFTER INSERT ON public.hustle_visits
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_hustle_visit();

-- Create function to notify followers on new hustle
CREATE OR REPLACE FUNCTION public.notify_on_new_hustle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hustle_owner_name TEXT;
  category_name TEXT;
BEGIN
  -- Get owner name
  SELECT COALESCE(username, 'A hustler') INTO hustle_owner_name 
  FROM profiles WHERE id = NEW.owner_id;
  
  -- Get category name
  SELECT name INTO category_name FROM categories WHERE id = NEW.category_id;
  
  -- Notify all users about new hustle (for now, we'll limit this to admins or can be expanded)
  -- In production, you might want a followers/subscriptions system
  INSERT INTO notifications (user_id, type, title, message, link)
  SELECT 
    p.user_id,
    'new_hustle',
    'New hustle: ' || NEW.name,
    hustle_owner_name || ' just listed a new ' || COALESCE(category_name, 'hustle'),
    '/hustle/' || NEW.id
  FROM profiles p
  WHERE p.user_id != (SELECT user_id FROM profiles WHERE id = NEW.owner_id)
  AND p.is_hustler = true;
  
  RETURN NEW;
END;
$$;

-- Trigger for new hustles
CREATE TRIGGER on_new_hustle
AFTER INSERT ON public.hustles
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_new_hustle();

-- Enable realtime for testimonials
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;