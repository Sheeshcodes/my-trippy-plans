/* Isolation test — cross-group leakage.
   Run: node tests/isolation.test.mjs   (exit 0 = pass)

   KNOWN LIMITATION, read before trusting this: it re-implements handle() against
   an in-memory fake rather than importing src/routes/api/public/trip.ts, because
   that module uses the "@/..." alias and a Supabase client that only resolve
   under Vite. So this proves the *shape* of the scoping is right; it cannot
   catch the route drifting away from it. Treat a pass as necessary, not
   sufficient — the real gate is adding vitest and importing the route itself. */

// --- in-memory DB mimicking the two tables + the query builder we use ---
function makeDB() {
  const groups = [];
  const responses = [];
  const tbl = (rows) => {
    let filters = [];
    const api = {
      select() { return api; },
      eq(col, val) { filters.push([col, val]); return api; },
      _match(r) { return filters.every(([c, v]) => String(r[c]) === String(v)); },
      async maybeSingle() { const r = rows.find((x) => api._match(x)) ?? null; filters = []; return { data: r }; },
      then(res) {
        if (api._pendingDelete) { for (let i = rows.length - 1; i >= 0; i--) if (api._match(rows[i])) rows.splice(i, 1); api._pendingDelete = false; filters = []; return Promise.resolve({ error: null }).then(res); }
        const out = rows.filter((x) => api._match(x)); filters = []; return Promise.resolve({ data: out, error: null }).then(res);
      },
      async insert(r) { rows.push({ ...r }); return { error: null }; },
      async update(patch) { rows.filter((x) => api._match(x)).forEach((x) => Object.assign(x, patch)); filters = []; return { error: null }; },
      async upsert(r, opts) {
        const [c1, c2] = (opts.onConflict || "").split(",");
        const i = rows.findIndex((x) => String(x[c1]) === String(r[c1]) && String(x[c2]) === String(r[c2]));
        if (i >= 0) rows[i] = { ...rows[i], ...r }; else rows.push({ ...r });
        return { error: null };
      },
      delete() { api._pendingDelete = true; return api; },
      async _run() { if (api._pendingDelete) { for (let i = rows.length - 1; i >= 0; i--) if (api._match(rows[i])) rows.splice(i, 1); api._pendingDelete = false; } filters = []; return { error: null }; },
    };
    return api;
  };
  return { from: (t) => tbl(t === "groups" ? groups : responses), _groups: groups, _responses: responses };
}

// --- the handler logic, mirrored from the route (kept in sync intentionally) ---
const FIELDS = ["name","sure","place","lat","lng","begin","end","leave","vibe","spend","plus","need","rec","recText","doodle","ts","device"];
const keyOf = (n) => String(n ?? "").trim().toLowerCase();
async function friendsMap(db, gid) {
  const { data } = await db.from("responses").select("*").eq("group_id", gid);
  const f = {}; for (const r of data) f[r.key] = { name: r.name }; return f;
}
async function handle(db, gid, p) {
  const action = p.action ?? "list";
  if (action === "save") {
    const rec = p.rec ?? {}; const key = keyOf(rec.name);
    if (!key || !gid) return { ok: false };
    const { data: existing } = await db.from("responses").select("device").eq("group_id", gid).eq("key", key).maybeSingle();
    const owner = String(existing?.device ?? "");
    if (existing && owner && owner !== String(rec.device ?? "")) return { ok: false, error: "taken" };
    const row = { group_id: gid, key }; for (const f of FIELDS) row[f] = rec[f] ?? null;
    await db.from("responses").upsert(row, { onConflict: "group_id,key" });
    return { ok: true, friends: await friendsMap(db, gid) };
  }
  if (action === "remove") {
    const key = keyOf(p.key); if (!key || !gid) return { ok: false };
    await db.from("responses").delete().eq("group_id", gid).eq("key", key);
    return { ok: true, friends: await friendsMap(db, gid) };
  }
  if (!gid) return { ok: false };
  return { ok: true, friends: await friendsMap(db, gid) };
}

// --- tests ---
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.error("FAIL:", m); } };

const db = makeDB();
db._groups.push({ id: "A", admin_key: "ka" }, { id: "B", admin_key: "kb" });

// seed: Priya in A, Rahul in B
await handle(db, "A", { action: "save", rec: { name: "Priya", device: "d1" } });
await handle(db, "B", { action: "save", rec: { name: "Rahul", device: "d2" } });

// 1) list of A shows only A
const la = await handle(db, "A", { action: "list" });
ok(Object.keys(la.friends).length === 1 && la.friends.priya, "A list should contain only Priya");

// 2) list of B shows only B
const lb = await handle(db, "B", { action: "list" });
ok(Object.keys(lb.friends).length === 1 && lb.friends.rahul, "B list should contain only Rahul");

// 3) same name in two groups does NOT collide
await handle(db, "A", { action: "save", rec: { name: "Sam", device: "dA" } });
await handle(db, "B", { action: "save", rec: { name: "Sam", device: "dB" } });
ok(db._responses.filter((r) => r.key === "sam").length === 2, "two Sams in different groups must coexist");

// 4) removing from A can't delete B's row
await handle(db, "A", { action: "remove", key: "Rahul" }); // Rahul lives in B
ok(db._responses.some((r) => r.group_id === "B" && r.key === "rahul"), "A must not be able to remove B's Rahul");

// 5) saving scoped to A never writes into B
const before = db._responses.filter((r) => r.group_id === "B").length;
await handle(db, "A", { action: "save", rec: { name: "Zoya", device: "dz" } });
const after = db._responses.filter((r) => r.group_id === "B").length;
ok(before === after, "a save scoped to A must not change B's rows");

// 6) no group id → nothing returned
const none = await handle(db, "", { action: "list" });
ok(none.ok === false, "missing group id must not return data");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
