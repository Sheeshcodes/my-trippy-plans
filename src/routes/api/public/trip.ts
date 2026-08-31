import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

const json = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json", ...CORS },
  });

const FIELDS = [
  "name", "sure", "place", "lat", "lng", "begin", "end", "leave", "vibe",
  "spend", "plus", "need", "rec", "recText", "doodle", "ts", "device",
] as const;

const NUMERIC = new Set(["lat", "lng", "begin", "end", "ts"]);

type Row = Record<string, unknown>;

function toRecord(row: Row) {
  const out: Row = {};
  for (const f of FIELDS) out[f] = row[f] ?? (NUMERIC.has(f) ? null : "");
  out["types"] = typeof row["types"] === "string" && row["types"] ? (row["types"] as string).split("|") : [];
  return out;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const keyOf = (n: unknown) => String(n ?? "").trim().toLowerCase();

// The group id is a capability. It arrives ONLY as the `g` query param — never
// from the request body — so a client cannot swap it to read another group.
function normId(v: unknown) {
  const s = String(v ?? "").trim();
  return /^[a-z0-9_-]{6,40}$/i.test(s) ? s : "";
}
function slug() {
  const a = "abcdefghjkmnpqrstuvwxyz23456789";      // no look-alikes
  let s = "";
  for (let i = 0; i < 10; i++) s += a[Math.floor(Math.random() * a.length)];
  return "trip_" + s;
}
function adminKey() {
  const a = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 24; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

const BUDGET_RULES = new Set(["common", "median", "inclusive70"]);
const str = (v: unknown, max: number) => String(v ?? "").slice(0, max);
const strArr = (v: unknown, max: number) =>
  Array.isArray(v) ? v.map((x) => String(x).slice(0, 40)).filter(Boolean).slice(0, max) : [];
const bool = (v: unknown, dflt: boolean) => (typeof v === "boolean" ? v : dflt);
const int = (v: unknown, dflt: number, lo: number, hi: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : dflt;
};
const date = (v: unknown) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v ?? "")) ? String(v) : null);

// Fields the organiser may set. Anything not listed here can never be written.
const SETTABLE = [
  "name", "organiser_name", "region", "states", "holiday_ids", "window_start", "window_end",
  "trip_len_min", "trip_len_max", "budget_tiers", "budget_rule", "currency",
  "allow_plus_one", "allow_lurking", "vote_by",
] as const;

function cleanSettings(p: Row, base: Row = {}): Row {
  const out: Row = {};
  const has = (f: string) => f in p;
  if (has("name")) out["name"] = str(p["name"], 60) || "Our trip";
  if (has("organiser_name")) out["organiser_name"] = str(p["organiser_name"], 40);
  if (has("region")) out["region"] = str(p["region"], 8) || "IN";
  if (has("states")) out["states"] = strArr(p["states"], 40);
  if (has("holiday_ids")) out["holiday_ids"] = strArr(p["holiday_ids"], 200);
  if (has("window_start")) out["window_start"] = date(p["window_start"]);
  if (has("window_end")) out["window_end"] = date(p["window_end"]);
  if (has("trip_len_min")) out["trip_len_min"] = int(p["trip_len_min"], 2, 1, 30);
  if (has("trip_len_max")) out["trip_len_max"] = int(p["trip_len_max"], 4, 1, 30);
  if (has("budget_tiers")) out["budget_tiers"] = Array.isArray(p["budget_tiers"]) ? p["budget_tiers"] : null;
  if (has("budget_rule")) out["budget_rule"] = BUDGET_RULES.has(String(p["budget_rule"])) ? p["budget_rule"] : "inclusive70";
  if (has("currency")) out["currency"] = str(p["currency"], 8) || "INR";
  if (has("allow_plus_one")) out["allow_plus_one"] = bool(p["allow_plus_one"], true);
  if (has("allow_lurking")) out["allow_lurking"] = bool(p["allow_lurking"], true);
  if (has("vote_by")) out["vote_by"] = date(p["vote_by"]);
  // keep min <= max whichever side was supplied
  const lo = Number(out["trip_len_min"] ?? base["trip_len_min"] ?? 2);
  const hi = Number(out["trip_len_max"] ?? base["trip_len_max"] ?? 4);
  if (lo > hi) { if ("trip_len_max" in out) out["trip_len_max"] = lo; else out["trip_len_min"] = hi; }
  return out;
}

async function friendsMap(gid: string) {
  const db = await admin();
  const { data, error } = await db.from("responses").select("*").eq("group_id", gid);
  if (error) throw new Error(error.message);
  const friends: Record<string, unknown> = {};
  for (const row of (data ?? []) as Row[]) friends[String(row["key"])] = toRecord(row);
  return friends;
}

async function getGroup(gid: string) {
  const db = await admin();
  const { data } = await db.from("groups").select("*").eq("id", gid).maybeSingle();
  return (data as Row | null) ?? null;
}

// admin_key is NEVER included — it goes back exactly once, at creation.
function publicGroup(g: Row | null) {
  if (!g) return null;
  const out: Row = {};
  for (const f of SETTABLE) out[f] = g[f] ?? null;
  out["id"] = g["id"];
  out["recs"] = g["recs"] ?? null;
  out["recs_updated_at"] = g["recs_updated_at"] ?? null;
  return out;
}

async function handle(gid: string, payload: Row) {
  const action = String(payload["action"] ?? "list");
  const db = await admin();

  if (action === "create_group") {
    const id = slug();
    const key = adminKey();
    const g: Row = { id, admin_key: key, ...cleanSettings(payload) };
    if (!g["name"]) g["name"] = "Our trip";
    const { error } = await db.from("groups").insert(g as never);
    if (error) throw new Error(error.message);
    return { ok: true, group: publicGroup(g), admin_key: key };
  }

  if (!gid) return { ok: false, error: "missing or invalid group" };
  const group = await getGroup(gid);
  if (!group) return { ok: false, error: "group not found" };

  const isOrganiser = () =>
    String(payload["admin_key"] ?? "") !== "" &&
    String(payload["admin_key"]) === String(group["admin_key"] ?? "");

  if (action === "update_group") {
    if (!isOrganiser()) return { ok: false, error: "not the organiser" };
    const patch = cleanSettings(payload, group);
    if (!Object.keys(patch).length) return { ok: true, group: publicGroup(group) };
    const { error } = await db.from("groups").update(patch as never).eq("id", gid);
    if (error) throw new Error(error.message);
    return { ok: true, group: publicGroup({ ...group, ...patch }) };
  }

  if (action === "run_recs") {
    if (!isOrganiser()) return { ok: false, error: "not the organiser" };
    const last = group["recs_run_at"] ? Date.parse(String(group["recs_run_at"])) : 0;
    if (Date.now() - last < 30000)
      return { ok: false, error: "just ran — give it a moment before refreshing" };
    const now = new Date().toISOString();
    const recs = payload["recs"] ?? null;
    const { error } = await db.from("groups")
      .update({ recs, recs_updated_at: now, recs_run_at: now } as never)
      .eq("id", gid);
    if (error) throw new Error(error.message);
    return { ok: true, recs, friends: await friendsMap(gid) };
  }

  if (action === "save") {
    const rec = (payload["rec"] ?? {}) as Row;
    const key = keyOf(rec["name"]);
    if (!key) return { ok: false, error: "missing name" };
    const row: Row = { group_id: gid, key, updated: new Date().toISOString() };
    for (const f of FIELDS) row[f] = rec[f] ?? null;
    row["types"] = Array.isArray(rec["types"]) ? (rec["types"] as unknown[]).join("|") : String(rec["types"] ?? "");
    const { data: existing } = await db
      .from("responses").select("device").eq("group_id", gid).eq("key", key).maybeSingle();
    const owner = String((existing as Row | null)?.["device"] ?? "");
    if (existing && owner && owner !== String(rec["device"] ?? "")) {
      return { ok: false, error: "this name is already taken by someone else" };
    }
    const { error } = await db.from("responses").upsert(row as never, { onConflict: "group_id,key" });
    if (error) throw new Error(error.message);
    return { ok: true, friends: await friendsMap(gid) };
  }

  if (action === "remove") {
    const key = keyOf(payload["key"]);
    if (!key) return { ok: false, error: "missing key" };
    const { error } = await db.from("responses").delete().eq("group_id", gid).eq("key", key);
    if (error) throw new Error(error.message);
    return { ok: true, friends: await friendsMap(gid) };
  }

  return { ok: true, group: publicGroup(group), friends: await friendsMap(gid) };
}

export const Route = createFileRoute("/api/public/trip")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const action = url.searchParams.get("action") ?? "list";
          const gid = normId(url.searchParams.get("g"));
          return json(await handle(gid, { action }));
        } catch (e) {
          return json({ ok: false, error: (e as Error).message });
        }
      },
      POST: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const gid = normId(url.searchParams.get("g"));
          const text = await request.text();
          let payload: Row = {};
          try { payload = JSON.parse(text || "{}"); }
          catch { payload = Object.fromEntries(new URLSearchParams(text)); }
          delete payload["g"];          // the body can never name a group
          delete payload["group_id"];
          return json(await handle(gid, payload));
        } catch (e) {
          return json({ ok: false, error: (e as Error).message });
        }
      },
    },
  },
});
