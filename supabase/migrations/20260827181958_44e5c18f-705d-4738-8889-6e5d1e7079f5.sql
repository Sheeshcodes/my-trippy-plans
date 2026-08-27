DROP POLICY IF EXISTS "Anyone can update a response" ON public.responses;
DROP POLICY IF EXISTS "Anyone can add a response" ON public.responses;
REVOKE INSERT, UPDATE ON public.responses FROM anon, authenticated;
GRANT ALL ON public.responses TO service_role;