# Project Status

Last updated: 2026-07-15

**⚠️ Before trusting anything in this file as "live," run
`git log origin/main --oneline -1` and compare to the local `HEAD` — there is
currently at least one commit (the proof carousel) sitting local-only, not
pushed, per an explicit owner instruction. See "Local but NOT deployed" below.**

## Live right now (pushed to `main`, deployed to Cloudflare Pages)

| Thing | State |
|---|---|
| Site | Live at https://procleanorganizers.pages.dev |
| Homepage | Parallax hero, fixed minimal nav, scroll-reveal cards, interactive nine-step method timeline on a 3D navy backdrop, trust band reads "Trusted across NYC & NJ" with 5 tiles including "Mercer & surrounding counties" (see HANDOFF items 9-10) |
| Services page | New standalone methodology section (Clean First / Organize Second phase cards, pull quote, 3/6/9-month follow-up card) — see HANDOFF item 10 |
| Copy | "NYC metro" swept to "NYC & NJ" sitewide |
| Other pages (about/pricing/contact) | Working (verified: content, images, nav) |
| `/admin` login | Working — password is in local `.env` (gitignored) and set as a Cloudflare Pages secret |
| Contact form | Renders; SMTP **not configured**, submissions only console-log |
| Content storage | Bundled seed JSON (`data/site-content.seed.json`) — **not KV yet** |
| Admin saves | Do **not persist** — reset to seed on every redeploy until KV is bound |
| Custom domain | **Not connected.** DNS for procleanorganizers.com already lives on Cloudflare (nameservers switched from Hostinger), but no domain is attached to the Pages project yet |
| GitHub repo | https://github.com/AzeemCreates/ProCleanOrganizers (`main` branch, auto-deploys to Cloudflare Pages on push) |

## Local but NOT deployed — do not assume these are live

- **Portfolio proof carousel** (`src/components/proof-carousel.tsx`), added
  between the portfolio stat band and "Selected Transformations": navy band,
  "Trust the results" headline, 8 real ProClean spaces as swipeable 4:3 cards
  with a circular next-arrow. Committed locally (`293b063`) but **the owner
  said not to push until told** — see HANDOFF item 10 for full detail.
- Portfolio stat band label changed from the literal project count to the
  word **"Multiple"** — same local, unpushed commit.
- Two open decisions blocking a push of the above: (1) whether `proof-03`
  (a stock 3D-rendered closet, `IMG_2291.jpg`) has a confirmed license to
  publish, and (2) whether the carousel should mix before/after spaces or
  trim to results-only.

## What's NOT done yet (in priority order)

1. **Get the go-ahead to push the proof carousel** (see above), or resolve the
   two open decisions first.
2. **Bind KV namespace** (`SITE_CONTENT`) so admin edits persist across redeploys.
   Handed to browser agent — steps are in `wrangler.toml` under the KV comment block.
   Not yet confirmed done as of this writing.
3. **Connect custom domain** (`procleanorganizers.com`) to the Pages project.
   Explicitly on hold — user said "not ready to connect the domain yet." DNS is
   pre-staged; MX/SPF/DKIM for Hostinger email were verified untouched.
4. **SMTP for contact form** — needs `SMTP_USER` / `SMTP_PASS` (Gmail App Password)
   added as Cloudflare Pages secrets. Owner hasn't generated one yet.
5. **Photo uploads on Cloudflare** — `/admin` photo upload currently writes to
   `public/uploads/` via `node:fs`, which works locally but is a no-op/broken on
   Cloudflare (no writable filesystem). Needs R2 bucket + code change. Not started.
   This blocks the owner's request for admin-manageable photos per service (up
   to 3) and per portfolio tab (up to 4) — that's a storage/backend build, not
   just a UI change.

## Known-good verification (last confirmed 2026-07-12)

- `POST /api/admin/login` with correct password → `200 {"ok":true}` + session cookie
- `POST /api/admin/login` with wrong password → `401 Incorrect password`
- `GET /` → 200, full homepage content, logo renders
- All static assets (`/assets/*.js`, `/assets/*.css`, `/uploads/*`) → 200
- `/admin` dashboard reachable with valid session, all 8 tabs render

## Credentials in use

- Admin password: stored in local `.env` (gitignored, never committed) and as a
  Cloudflare Pages **secret** on the dashboard. Ask the site owner directly if
  you need the value — do not put it in any file that gets committed.
- No SMTP credentials configured anywhere yet

## Next session should probably

First confirm with the owner whether the local proof-carousel commit should be
pushed (and resolve the `proof-03` licensing + before/after-mix questions
above) — it's sitting ready but deliberately held back. After that, KV binding
is the most impactful remaining item (unblocks real content editing, and
unblocks the owner's requested per-service/per-portfolio-tab photo uploads,
which also need R2). Domain connection is explicitly deferred until the user
says go.
