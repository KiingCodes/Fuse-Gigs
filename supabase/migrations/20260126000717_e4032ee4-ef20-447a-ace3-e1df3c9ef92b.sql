-- Fix the overly permissive notifications insert policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Create a more restrictive insert policy - only authenticated users can create notifications
CREATE POLICY "Authenticated users can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.role() = 'authenticated');