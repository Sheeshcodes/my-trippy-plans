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
  "name",
  "sure",
  "place",
  "lat",
  "lng",
  "begin",
  "end",
  "leave",
  "vibe",
  "spend",
  "plus",
  "need",
  "rec",
  "recText",
  "doodle",
  "ts",
  "device",
] as const;

type Row = Record<string, unknown>;

function toRecord(row: Row) {
  const out: Row = {};
  for (const f of FIELDS) out[f] = row[f] ?? (f === "lat" || f === "lng" || f === "begin" || f === "end" || f === "ts" ? null : "");
  out["types"] = typeof row["types"] === "string" && row["types"] ? (row["types"] as string).split("|") : [];
  return out;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function friendsMap() {
  const db = await admin();
  const { data, error } = await db.from("responses").select("*");
  if (error) throw new Error(error.message);
  const friends: Record<string, unknown> = {};
  for (const row of (data ?? []) as Row[]) friends[String(row["key"])] = toRecord(row);
  return friends;
}

const keyOf = (n: unknown) => String(n ?? "").trim().toLowerCase();

async function handle(payload: Row) {
  const action = String(payload["action"] ?? "list");

  if (action === "save") {
    const rec = (payload["rec"] ?? {}) as Row;
    const key = keyOf(rec["name"]);
    if (!key) return { ok: false, error: "missing name" };
    const row: Row = { key, updated: new Date().toISOString() };
    for (const f of FIELDS) row[f] = rec[f] ?? null;
    row["types"] = Array.isArray(rec["types"]) ? (rec["types"] as unknown[]).join("|") : String(rec["types"] ?? "");
    const db = await admin();
    const { error } = await db
      .from("responses")
      .upsert(row as never, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true, friends: await friendsMap() };
  }

  if (action === "remove") {
    const key = keyOf(payload["key"]);
    if (!key) return { ok: false, error: "missing key" };
    const db = await admin();
    const { error } = await db.from("responses").delete().eq("key", key);
    if (error) throw new Error(error.message);
    return { ok: true, friends: await friendsMap() };
  }

  return { ok: true, friends: await friendsMap() };
}

export const Route = createFileRoute("/api/public/trip")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        try {
          const action = new URL(request.url).searchParams.get("action") ?? "list";
          return json(await handle({ action }));
        } catch (e) {
          return json({ ok: false, error: (e as Error).message });
        }
      },
      POST: async ({ request }) => {
        try {
          const text = await request.text();
          let payload: Row = {};
          try {
            payload = JSON.parse(text || "{}");
          } catch {
            payload = Object.fromEntries(new URLSearchParams(text));
          }
          return json(await handle(payload));
        } catch (e) {
          return json({ ok: false, error: (e as Error).message });
        }
      },
    },
  },
});
