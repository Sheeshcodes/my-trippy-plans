-- Rollback for 20260831120000_add_groups_and_organiser_setup.sql. Apply by hand.
--
-- WARNING: only safe while exactly ONE group's rows exist. Restoring a primary
-- key on `key` alone fails the moment two groups contain the same name — check
--   SELECT key FROM public.responses GROUP BY key HAVING count(*) > 1;
-- returns nothing before running this.
DROP INDEX IF EXISTS public.responses_group_key_uidx;
DROP INDEX IF EXISTS public.responses_group_idx;
ALTER TABLE public.responses DROP CONSTRAINT IF EXISTS responses_pkey;
ALTER TABLE public.responses DROP COLUMN IF EXISTS id;
ALTER TABLE public.responses DROP COLUMN IF EXISTS group_id;
ALTER TABLE public.responses ADD PRIMARY KEY (key);
CREATE POLICY "Anyone can read responses" ON public.responses
  FOR SELECT TO anon, authenticated USING (true);
DROP TABLE IF EXISTS public.groups;
