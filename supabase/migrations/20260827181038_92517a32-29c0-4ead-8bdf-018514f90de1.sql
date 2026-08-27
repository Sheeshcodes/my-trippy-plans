CREATE TABLE public.responses (
  key text PRIMARY KEY,
  name text,
  sure text,
  place text,
  lat float8,
  lng float8,
  begin int,
  "end" int,
  leave text,
  vibe text,
  types text,
  spend text,
  plus text,
  need text,
  rec text,
  "recText" text,
  doodle text,
  ts int8,
  device text,
  updated timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.responses TO anon;
GRANT SELECT, INSERT, UPDATE ON public.responses TO authenticated;
GRANT ALL ON public.responses TO service_role;

ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read responses" ON public.responses FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add a response" ON public.responses FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update a response" ON public.responses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);