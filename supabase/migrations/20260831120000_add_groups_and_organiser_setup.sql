-- Phase 1 · multi-group tenancy + the organiser's setup fields
--
-- Adds the `groups` table (including the ORGANISER_SETUP_AND_INDIA_SPEC §7
-- columns), scopes `responses` by group_id, makes names unique per group rather
-- than globally, and closes the wide-open anon read.
--
-- Additive and reversible — see the paired _rollback file. NOTE: the rollback is
-- only safe while exactly one group exists, because it restores a primary key on
-- `key` alone, which collides once two groups share a name.

-- 1) groups -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.groups (
  id              text PRIMARY KEY,                 -- unguessable slug, e.g. trip_a7f3k9 — this is the link
  name            text NOT NULL DEFAULT 'Our trip', -- becomes the form title
  organiser_name  text,                             -- §7
  region          text NOT NULL DEFAULT 'IN',
  states          text[] NOT NULL DEFAULT '{}',     -- §7 · which states' holidays are relevant
  holiday_ids     text[] NOT NULL DEFAULT '{}',     -- §7 · the ticked set from holidays-in.json
  window_start    date,
  window_end      date,
  trip_len_min    int  DEFAULT 2,
  trip_len_max    int  DEFAULT 4,
  budget_tiers    jsonb,                            -- [{id,label,sub}] — null means app defaults
  budget_rule     text NOT NULL DEFAULT 'inclusive70'
                  CHECK (budget_rule IN ('common', 'median', 'inclusive70')),   -- §7
  currency        text NOT NULL DEFAULT 'INR',      -- §7
  allow_plus_one  boolean NOT NULL DEFAULT true,    -- §7
  allow_lurking   boolean NOT NULL DEFAULT true,    -- §7
  vote_by         date,
  admin_key       text NOT NULL,                    -- secret; only the creator holds it
  recs            jsonb,
  recs_updated_at timestamptz,
  recs_run_at     timestamptz,                      -- per-group rate limit
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Only the service role touches groups; all access goes through the server route.
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.groups FROM anon, authenticated;
GRANT ALL ON public.groups TO service_role;

-- 2) responses: add tenancy --------------------------------------------------
-- A legacy bucket so the existing single-group rows keep working untouched.
INSERT INTO public.groups (id, name, admin_key)
VALUES ('legacy', 'Batch trip', 'legacy-no-admin')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.responses
  ADD COLUMN IF NOT EXISTS group_id text NOT NULL DEFAULT 'legacy'
    REFERENCES public.groups(id) ON DELETE CASCADE;

-- Names are unique PER GROUP, not globally: swap the PK on `key` for a
-- surrogate id plus a composite unique index.
ALTER TABLE public.responses DROP CONSTRAINT IF EXISTS responses_pkey;
ALTER TABLE public.responses
  ADD COLUMN IF NOT EXISTS id bigint GENERATED ALWAYS AS IDENTITY;
ALTER TABLE public.responses ADD PRIMARY KEY (id);
CREATE UNIQUE INDEX IF NOT EXISTS responses_group_key_uidx
  ON public.responses (group_id, key);
CREATE INDEX IF NOT EXISTS responses_group_idx
  ON public.responses (group_id);

-- 3) lock down responses -----------------------------------------------------
-- The server route uses the service role, which bypasses RLS — so group_id
-- scoping in the route is the PRIMARY defence. RLS here is defence-in-depth.
DROP POLICY IF EXISTS "Anyone can read responses" ON public.responses;
REVOKE SELECT, INSERT, UPDATE ON public.responses FROM anon, authenticated;
GRANT ALL ON public.responses TO service_role;
