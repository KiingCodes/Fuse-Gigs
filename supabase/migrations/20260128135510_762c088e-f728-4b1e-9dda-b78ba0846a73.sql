-- Fix overly permissive RLS policy on user_subscriptions
DROP POLICY IF EXISTS "System can manage subscriptions" ON public.user_subscriptions;

-- Allow service role to manage subscriptions (for webhooks)
CREATE POLICY "Service role can manage subscriptions" ON public.user_subscriptions 
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow users to insert their own subscription record
CREATE POLICY "Users can create their subscription" ON public.user_subscriptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own subscription
CREATE POLICY "Users can update their subscription" ON public.user_subscriptions
FOR UPDATE USING (auth.uid() = user_id);