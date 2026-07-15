# Handoff — ProClean Organizers site

This doc is the story of how the site got to its current state, written for
whoever (human or AI assistant) picks this up next. For the current live/not-live
checklist, see `STATUS.md`. For durable working rules, see `INSTRUCTIONS.md`.

## The business

ProClean Organizers — NYC professional organizing company, owner Mujahid Ibn
Abdellah. Site slogan: "Tidy is Mighty." Non-technical owner; the whole point
of the `/admin` panel is that he edits text/prices/photos himself, no code
changes, no developer needed for routine updates.

## What this project is

A TanStack Start (React, file-based routing, SSR via server functions) site,
originally scaffolded by Lovable and then fully de-Lovable'd — no Lovable
references, no Lovable CDN dependency, standard Vite build. Brand colors
(#3b547c navy / #6dbb9c teal / #b7cf46 lime) applied throughout.

Repo: https://github.com/AzeemCreates/ProCleanOrganizers (branch `main`)
Deploys automatically to Cloudflare Pages on every push to `main`.
Live URL: https://procleanorganizers.pages.dev (custom domain not connected yet)

## Chronological summary

1. **De-Lovabled and ran locally.** Stripped all Lovable build tooling/imports,
   replaced with a standard `vite.config.ts` (`tanstackStart` + `@vitejs/plugin-react`
   + `@tailwindcss/vite` + `vite-tsconfig-paths`). Confirmed local dev + production
   build both work.

2. **Built the admin content system.** The owner needed to edit text, prices, and
   photos without touching code. Solution: a single-password-gated `/admin` route
   (`src/routes/admin.tsx`) backed by server functions in `src/lib/site-content.ts`.
   All page content — business info, mission statement, service categories, pricing
   packages, method steps, portfolio photos, images — lives in one Zod-validated
   JSON shape (`SiteContent`). `data/site-content.seed.json` is the committed
   default; originally there was also a gitignored `data/site-content.runtime.json`
   for local-dev saves (see "Cloudflare has no filesystem" below for why that
   design didn't carry over to production as-is).

3. **Wired contact form email** via nodemailer/Gmail SMTP — code is done, but
   the actual `SMTP_USER`/`SMTP_PASS` credentials were never provided by the
   owner. Contact form still works, it just doesn't send email yet (console-logs
   instead). See STATUS.md.

4. **Applied brand colors and did UI polish** — gradient hero backgrounds
   matching the "Why ProClean?" band, lime-fill CTA buttons, removed an unused
   Instagram section, fixed footer email wrapping, added a subtle "Admin" link
   in the footer, replaced the placeholder logo with a transparent-background
   version (background removed via Bloom MCP's `bloom_remove_background`).

5. **Decided on Cloudflare Pages for hosting.** Domain `procleanorganizers.com`
   was on Hostinger (2 years). User wanted Cloudflare's free tier + the KV
   store we'd already need for admin-edited content. Plan: keep Hostinger as
   registrar, move DNS management to Cloudflare (nameservers), deploy the app
   to Cloudflare Pages, eventually point the domain at it.

6. **The DNS/email safety check.** Before touching nameservers, explicitly
   verified with the user that Hostinger email (MX/SPF/DKIM/DMARC records)
   would survive the move. Confirmed: Cloudflare imports existing DNS records
   automatically when you add a zone, and email records stay untouched as long
   as they're set to "DNS only" (grey cloud) rather than "Proxied" (orange
   cloud). The user's Hostinger email is unaffected — verified via screenshot
   of the actual Cloudflare DNS record list. **This distinction (DNS-only vs
   proxied) matters — don't let anyone "helpfully" proxy MX/DKIM records.**

7. **The deploy debugging arc — this is the part worth reading closely if
   something breaks again.** Getting this app running on Cloudflare Pages took
   five rounds of fixes because TanStack Start (this version) has no built-in
   Cloudflare adapter/preset. Each fix addressed a real, distinct failure:

   - **Round 1 — wrong output directory.** `wrangler.toml` said
     `pages_build_output_dir = ".output/public"` but Vite actually outputs to
     `dist/client` + `dist/server`. Fixed by pointing config at the real path
     and adding `scripts/cf-postbuild.mjs`, which copies `dist/server/` into
     `dist/client/_server/` and writes a `_worker.js` entry point (Cloudflare
     Pages' convention for a custom SSR Worker).

   - **Round 2 — invalid KV namespace ID.** `wrangler.toml` had a placeholder
     `id = "REPLACE_WITH_YOUR_KV_NAMESPACE_ID"` before a real namespace existed.
     Cloudflare refused to publish. Fixed by commenting out the `[[kv_namespaces]]`
     block entirely until a real namespace is created — the app was already
     written to gracefully fall back when KV isn't bound.

   - **Round 3 — 500 on every page ("Cloudflare Workers have no filesystem").**
     This is the big one. `site-content.ts` originally read
     `data/site-content.seed.json` off disk with `node:fs/promises`. That works
     in local Node dev and fails hard on Cloudflare Workers, which have no
     filesystem at runtime — every request to `/` threw. **Fix: import the seed
     JSON as a static ES import** (`import seedJson from "../../data/site-content.seed.json"`)
     so it's bundled directly into the JS, not read from disk. This is the
     correct pattern for any static JSON this app needs on Cloudflare — never
     add a new `node:fs` read for build-time-known data.

   - **Round 4 — 503 on every JS/CSS asset.** The hand-written `_worker.js`
     routed 100% of requests (including static asset requests) through the SSR
     handler, which isn't built to serve raw files. A custom `_worker.js`
     disables Cloudflare Pages' automatic static-asset serving unless you
     explicitly delegate to it. Fix: `_worker.js` now tries
     `env.ASSETS.fetch(request)` first and only falls through to SSR if that
     404s.

   - **Round 5 — 405 on every POST request (admin login, content save, contact
     form).** The Round 4 fix delegated *every* request to `env.ASSETS` first,
     but Cloudflare's asset server returns `405 Method Not Allowed` (not `404`)
     for non-GET methods — so the "fall through only on 404" check never
     triggered for POST routes, and they all got a bogus 405 straight from the
     asset server. Fix: only consult `env.ASSETS` for `GET`/`HEAD` requests;
     everything else (POST/PUT/etc.) always goes straight to the SSR handler.

   - **Round 6 — admin login 500 "not configured" even with the password set
     in the Cloudflare dashboard.** `getSecret()` read `process.env.ADMIN_PASSWORD`.
     Cloudflare Pages does **not** populate `process.env` from dashboard secrets —
     those are only ever handed to the Worker's `fetch(request, env, ctx)` entry
     point. An earlier attempted fix tried reading env via `vinxi/http`'s
     `getEvent()`, but this app runs on **nitro**, not vinxi, so that import
     silently failed and fell back to the (empty) `process.env`. **Final fix:**
     `_worker.js` stashes the `env` object onto `globalThis.__CF_ENV__` at the
     very top of `fetch()`, before anything else runs. `src/lib/cloudflare-env.ts`
     reads from `globalThis.__CF_ENV__` (falling back to `process.env` for local
     Node dev). This is the pattern to reuse for any future Cloudflare
     binding/secret this app needs (SMTP creds, R2 bucket, etc.) — **do not**
     reintroduce a `vinxi/http` or raw `process.env` read for anything that
     needs to work on Cloudflare.

   Each round was smoke-tested against the live URL before moving to the next
   (curl for API routes to see exact status codes, browser automation for the
   full login → dashboard flow). Round 6 was confirmed working via both a raw
   curl POST (200 + session cookie) and a full browser login → admin dashboard
   render.

8. **Logo swap.** User provided a new logo (teal/lime "P" mark on navy circle,
   then a white-background PNG version). Used Bloom MCP
   (`bloom_open_upload_ui` → `bloom_remove_background`) to strip the white
   background, downloaded the transparent PNG, saved it as
   `public/uploads/logo-circle.png`, replacing the old file in place — no code
   changes needed since `src/components/site-header.tsx` already reads
   `images.logo` from site content, which already pointed at that path.

## Where things stand as of the last message in this conversation

See `STATUS.md` for the live checklist. Short version: site is live and admin
login works. KV binding (for persistent content edits) was just handed off to
the user's browser agent as a set of dashboard-only steps — not yet confirmed
done. Custom domain is explicitly on hold per the user's instruction.

## Tools used in this project (in case they're needed again)

- **Bloom MCP** (`mcp__2811d7bb-dfd0-43b5-9f85-118efa32ea89__bloom_*`) — used
  for the logo background removal. Brand session ID discovered via
  `bloom_list_brands`.
- **Claude Browser** (`mcp__Claude_Browser__*`) — used throughout for local dev
  preview and for live-site smoke testing (login flow, network request
  inspection, JS execution to test raw fetch calls against the deployed API).
- **Background Bash pushes** — `git push` to this repo hangs in a foreground
  shell because Git Credential Manager needs to pop up a native Windows auth
  window that a sandboxed foreground command can't surface. Fix: run the push
  with `run_in_background: true`, tell the user to watch for/approve the
  popup, then poll `git log origin/main --oneline -1` after the background
  task reports completion to confirm it actually landed.
