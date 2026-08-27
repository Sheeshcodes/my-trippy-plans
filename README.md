# Trip Companion

This is a finished, working single-page trip planner. It builds and runs as-is. Please do not refactor it — the architecture is intentional: src/App.tsx holds the page markup, src/planner.css holds all styles, and src/planner.js is one vanilla-JS module mounted once via useEffect. Do not convert it to React state or components, and never remove or rename element ids in App.tsx — the logic binds to them.

What I want your help with is the backend. The app already has a storage layer in src/planner.js (loadFriends, saveRecord, removeRecord) that calls whatever BACKEND_URL in src/config.ts points at, using this exact JSON contract — please keep it unchanged:

GET ?action=list → { ok:true, friends:{ [key]: record } }

POST { action:'save', rec } → { ok:true, friends:{…} }

POST { action:'remove', key } → { ok:true, friends:{…} }

a record is: name, sure, place, lat, lng, begin, end, leave, vibe, types[], spend, plus, need, rec, recText, doodle, ts, device

Stand up a Supabase backend that satisfies this contract:

Table responses, primary key key (text = lower(trim(name))), columns: name text, sure text, place text, lat float8, lng float8, begin int, end int, leave text, vibe text, types text (pipe-joined), spend text, plus text, need text, rec text, recText text, doodle text, ts int8, device text, updated timestamptz default now(). Enable RLS; allow anon select, insert, update (friends-group form, no auth); block anon delete.

An Edge Function trip that implements the three routes above. For list and after every save, return the full { ok:true, friends } map with each record's types split from | into an array. save = upsert on key. remove = delete the row using the service role. On any error return { ok:false, error } with HTTP 200 so the client's fallback still works. Allow CORS from my deployed origin.

Give me the function's public URL — I'll paste it into src/config.ts as BACKEND_URL.

Don't touch planner.js, App.tsx, or the contract.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://my-trippy-plans.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c9f3f342-04c4-4f65-90d1-7a0570827a75).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
