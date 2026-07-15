# Project Status

Last updated: 2026-07-15

## Live right now

| Thing | State |
|---|---|
| Site | Live at https://procleanorganizers.pages.dev |
| Homepage / all pages | Working (verified: content, images, nav) |
| `/admin` login | Working — password is in local `.env` (gitignored) and set as a Cloudflare Pages secret |
| Contact form | Renders; SMTP **not configured**, submissions only console-log |
| Content storage | Bundled seed JSON (`data/site-content.seed.json`) — **not KV yet** |
| Admin saves | Do **not persist** — reset to seed on every redeploy until KV is bound |
| Custom domain | **Not connected.** DNS for procleanorganizers.com already lives on Cloudflare (nameservers switched from Hostinger), but no domain is attached to the Pages project yet |
| GitHub repo | https://github.com/AzeemCreates/ProCleanOrganizers (`main` branch, auto-deploys to Cloudflare Pages on push) |

## What's NOT done yet (in priority order)

1. **Bind KV namespace** (`SITE_CONTENT`) so admin edits persist across redeploys.
   Handed to browser agent — steps are in `wrangler.toml` under the KV comment block.
   Not yet confirmed done as of this writing.
2. **Connect custom domain** (`procleanorganizers.com`) to the Pages project.
   Explicitly on hold — user said "not ready to connect the domain yet." DNS is
   pre-staged; MX/SPF/DKIM for Hostinger email were verified untouched.
3. **SMTP for contact form** — needs `SMTP_USER` / `SMTP_PASS` (Gmail App Password)
   added as Cloudflare Pages secrets. Owner hasn't generated one yet.
4. **Photo uploads on Cloudflare** — `/admin` photo upload currently writes to
   `public/uploads/` via `node:fs`, which works locally but is a no-op/broken on
   Cloudflare (no writable filesystem). Needs R2 bucket + code change. Not started.

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

Pick up at whichever of the "not done yet" items above is still unchecked —
check with the user which they want first if unclear. KV binding is the most
impactful (unblocks real content editing); domain connection is explicitly
deferred until the user says go.
