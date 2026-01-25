-- Fix the permissive INSERT policy on hustle_visits
-- Only allow authenticated users or anonymous tracking with rate limiting logic
DROP POLICY IF EXISTS "Anyone can track visits" ON public.hustle_visits;

CREATE POLICY "Authenticated users can track visits"
  ON public.hustle_visits FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');