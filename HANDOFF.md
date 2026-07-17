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

9. **Homepage visual redesign (this session).** Reworked the homepage into a
   more editorial, studio-portfolio feel while keeping all existing content and
   the brand palette. New/changed files:

   - **Parallax hero** (`src/components/hero-parallax.tsx`) replaced the flat
     gradient hero. Full-screen, three scroll-driven layers (background photo
     ~0.35x + slow zoom-out, a lime accent bar ~0.65x, foreground text ~1.15x +
     fade-out), all applied via a single rAF-batched scroll handler and skipped
     under `prefers-reduced-motion`. Works on wheel/trackpad/touch (reads
     `window.scrollY`). Background image is `public/uploads/hero-closet.webp`,
     generated with the **Higgsfield MCP** (`nano_banana_pro`, cozy timber
     walk-in closet, brand-graded toward navy shadows / sage mid-tones), then
     converted from an 8.6 MB PNG to a 184 KB WebP (2400px wide, q80) via a
     throwaway `sharp` install — the site's `package.json` has no image deps.
     Headline: "Organized Spaces. Restored Calm." with the lime accent on
     "Calm.", plus a free-consultation subhead, a lime CTA, and the phone.
     Service area is **NYC & NJ** — an earlier "Serving Mercer & surrounding
     counties" eyebrow was removed per the owner. Brand rule reinforced this
     session: **no em/en dashes in visible copy** (use commas/periods).

   - **Fixed minimal nav** (`src/components/site-header.tsx`): changed from
     `sticky` to `fixed`, pinned to an exact `h-16` (64px) height. Three zones
     via `grid-cols-[1fr_auto_1fr]`: logo + wordmark flush left, nav links
     **truly centered** (the equal `1fr` side columns are what center the nav
     regardless of the logo/phone widths — a plain `auto_1fr_auto` drifted the
     nav off-center), phone-call CTA flush right. The Español/language toggle
     was **removed from the header**.

   - **Fixed-nav offset**: `src/components/site-shell.tsx`'s `<main>` got
     `pt-16` so page content clears the fixed 64px nav; the homepage hero opts
     out with its own `-mt-16` so it stays full-bleed under the translucent nav.

   - **Footer** (`src/components/site-footer.tsx`): added the **Facebook** link
     (https://m.facebook.com/procleanorganizers2020/) and the Español/English
     language toggle (moved down from the header).

   - **Reusable scroll-reveal** (`src/components/reveal.tsx`): `<Reveal index={i}>`
     fades + rises its children into view via IntersectionObserver, staggered by
     `index` with per-index variation (drift/tilt/scale/distance/origin) so a row
     of cards feels like a varied "family" of entrances, and it **replays** when
     an element scrolls out and back (the observer is intentionally never
     disconnected; visibility follows `entry.isIntersecting`). Respects reduced
     motion. Currently applied to the "Service Collections" cards and to every
     row of the method timeline.

   - **Interactive method timeline**: the 9-card "The ProClean Method" grid was
     replaced by a single continuous vertical timeline
     (`src/components/method-timeline.tsx`) sitting on a 3D-depth navy backdrop
     (`src/components/method-backdrop.tsx`, a CSS perspective grid + layered
     navy planes, motion gated behind reduced-motion). Each of the nine steps
     reveals one-by-one via `Reveal`. Color application per the owner's brief:
     navy (#3b547c) dominant background, sage (#6dbb9c) hairline + nodes +
     subhead, lime (#b7cf46) as a sparing accent only. `methodSteps` is now
     consumed inside `method-timeline.tsx`, not `index.tsx`.

   - **Typography note**: the hero brief asked for a "bold condensed" display
     face, but this repo intentionally ships **no external fonts** (Cloudflare
     self-contained build + single brand font, Plus Jakarta Sans). The headline
     uses Plus Jakarta at extra-bold / uppercase / tight-tracking to approximate
     "condensed" without adding a font dependency. If a true condensed face is
     ever wanted, self-host it as a bundled `.woff2` — do not link a font CDN.

   - **Dev-server gotcha** (worth knowing next time): running several file edits
     concurrently — especially via parallel subagents — repeatedly poisoned
     Vite's HMR module cache, surfacing **stale** `ReferenceError`s in the
     browser console (e.g. an old `lang` reference) for code that no longer
     exists on disk. Don't trust those. The authoritative checks are
     `bun run build` (must exit 0) and a fresh dev-server restart; verify the
     real DOM with a JS probe rather than reading the stale console buffer.

   - **Parallel-subagent workflow**: most of this redesign was executed by
     dispatching several Sonnet subagents at once, each scoped to a single
     disjoint file, tied together by a shared contract (nav = `h-16`, brand
     classes, no dashes). Composition/integration into `index.tsx` was done by
     the lead. This kept file-write conflicts at zero.

10. **Copy sweep, Services methodology section, proof carousel (this session).**
    Several small requests landed in one session; noting them together since
    they touch the same files.

    - **"NYC metro" → "NYC & NJ"** swept across all route meta descriptions and
      the homepage trust-band heading (`index.tsx`, `about.tsx`, `contact.tsx`,
      `portfolio.tsx`, `services.tsx`, `__root.tsx`).
    - **Homepage trust band** gained a 5th tile, through two revisions: first
      "Mercer County, NJ", then corrected to **"Mercer & surrounding counties"**
      per the owner (the business's 609 phone number is a Mercer County, NJ area
      code, so this is accurate, not filler).
    - **Services page** (`services.tsx`) got a new standalone methodology
      section between the hero and the catalog accordion: "Why we clean before
      we organize," two phase cards (Clean First — sage card, 7 steps; Organize
      Second — navy card, 6 steps) linked by an arrow connector, a pull quote
      ("Clean first. Organize second. That's the standard."), and a 3/6/9-month
      follow-up trust card. Built in **Plus Jakarta Sans** (the site's real
      font) at heavy/uppercase weights, NOT Times New Roman — a since-corrected
      instruction asked for Times New Roman, but this repo has no serif font and
      a hard "no italics" brand rule; changing the whole site to serif would be
      a separate, larger decision that hasn't been requested.
    - **Proof carousel** (`src/components/proof-carousel.tsx`), added to
      `/portfolio` between the stat band and "Selected Transformations."
      Reuses the existing Embla primitive at `src/components/ui/carousel.tsx`
      (no new carousel library). Navy band, "Trust the **results**" headline
      (lime word) as the static first item in the track, 8 real ProClean spaces
      as 4:3 rounded photo cards with a chrome dot-bar, circular arrow button
      pinned to the right edge (verified via DOM probe to advance the track by
      one card per click), native drag/swipe. Source photos:
      `image.jpg`–`image9.jpg` in the owner's
      `C:\2026- Property MgMT Portal\ProClean Organizers Images\` folder,
      cropped to a consistent 1200×900 webp (`sharp`, `fit: cover, attention`
      auto-framing) into `public/uploads/proof/proof-01..08.webp`. One card
      (`proof-03`) is a **stock 3D-rendered closet** the owner explicitly asked
      to include (`IMG_2291.jpg`) — flagged to the owner as needing a confirmed
      license before this goes live, not yet resolved. The stat band's
      "Projects shown" value was changed from the literal count (`3`) to the
      word **"Multiple"**.
    - **Image-intake gotcha learned twice this session**: images pasted directly
      into chat are NOT files — they can't be committed. Only files the owner
      actually saves to disk (in the Images folder, or wherever) can be copied
      into the repo. Dragging an image *link* (e.g. from Discord) instead of the
      file itself creates a `.url` shortcut, not an image — these were found and
      skipped, not silently treated as real images.
    - **Stock vs. real photo judgment call**: the owner pasted a batch of images
      mid-session that included two watermarked ("The White Laurel") blog photos
      and several stock/AI-looking interiors (cleaning gloves, Scandinavian
      living rooms, generic "Keep/Donate/Trash/Relocate" boxes). These were
      flagged and NOT added as portfolio "proof," since the portfolio page's own
      copy promises "no staging, no props, just the same rooms our clients live
      in" — presenting stock photos as client proof would contradict that and
      risks copyright issues on the watermarked ones. The owner agreed to use
      stock/illustrative images "only where they're honest" (e.g. decorative,
      not labeled as real jobs) — no such usage has been built yet.
    - **`git rm` + throwaway `sharp`**: the hero PNG→WebP conversion pattern from
      item 9 was reused verbatim for the proof photos — install `sharp` in a
      scratch temp dir (never the site's `package.json`), process, copy output
      into `public/uploads/`, done.

11. **Contact form email: fixed the actual Cloudflare-compatibility bug, not
    just credentials (this session).** The pre-existing code
    (`src/lib/mailer.ts`) looked complete but had two bugs that would have
    made it silently never work in production, even with valid credentials:

    - It read `process.env.SMTP_USER` etc. directly. **Cloudflare Pages never
      populates `process.env` with dashboard secrets/bindings** — those are
      only handed to the Worker's `fetch(request, env, ctx)` entry point
      (see `src/lib/cloudflare-env.ts`'s own comment, which the file already
      explained but `mailer.ts` didn't follow). Fixed by switching to
      `getEnvVar()` from that file.
    - It used **nodemailer's SMTP transport**, which does not run on
      Cloudflare Workers — confirmed via
      https://github.com/nodemailer/nodemailer/issues/1621 (it depends on
      Node's raw `net`/`tls` sockets in a way `nodejs_compat` doesn't
      polyfill). Replaced with **`worker-mailer`**
      (https://github.com/zou-yu/worker-mailer), a small library that speaks
      SMTP directly over Cloudflare's native TCP Sockets API
      (`cloudflare:sockets`), which Cloudflare's OWN deploy-time bundler
      resolves natively — confirmed this works via `npx wrangler pages dev`
      (see below), NOT via `vite build`/`vite dev` alone, since plain Node has
      no `cloudflare:sockets` and the Vite SSR build intentionally leaves npm
      packages as external imports for Cloudflare's bundler to resolve later.
      `nodemailer` and `@types/nodemailer` were removed as dependencies;
      `worker-mailer` was added as a real dependency (not a throwaway).
    - `worker-mailer`'s real API (checked against its `.d.ts`, not just its
      README) uses `reply: { email }` for reply-to, not `replyTo` — and needs
      `secure`/`startTls` set as an either/or pair (`secure: true` for
      implicit-TLS port 465, `startTls: true` for STARTTLS port 587 — Gmail's
      default). Get this wrong and mail will either not send or the library
      will misnegotiate TLS.
    - **How this was smoke-tested** (worth repeating if it needs re-verifying):
      `bun run build`, then `npx wrangler pages dev dist/client
      --compatibility-flags nodejs_compat --compatibility-date 2024-09-23`
      (matching `wrangler.toml`) — this runs the REAL Workers runtime
      (`workerd`) locally, unlike `vite dev`. Confirmed "✨ Compiled Worker
      successfully" (proves `cloudflare:sockets` resolves), then
      `curl -X POST http://localhost:8788/api/contact` with both
      `formType: "contact"` and `formType: "booking"` payloads — both
      returned `200 {"ok":true}`, and the server log showed the EXPECTED
      graceful error `"SMTP_USER / SMTP_PASS are not set"` (not a crash,
      not an import-resolution error) — proving the whole chain works and is
      just waiting on real credentials.
    - Destination was already correct before this session: both forms send to
      `content.business.email` (currently `ProCleanOrganizers2020@gmail.com`
      in the seed data), overridable via `CONTACT_TO_EMAIL`. Nothing needed to
      change there — the owner's ask was really "make the pipes not leak,"
      not "point it at the right address."
    - **What's still needed, and can only come from the owner**: a real Gmail
      App Password (`SMTP_USER` = his Gmail address, `SMTP_PASS` = the App
      Password from https://myaccount.google.com/apppasswords, requires
      2-Step Verification enabled first) added as Cloudflare Pages secrets
      (`wrangler secret put SMTP_USER` / `SMTP_PASS`, or the dashboard). No
      DNS changes are needed for this — it's Gmail sending as itself, not a
      Cloudflare Email Service domain-verification setup (which was
      considered and rejected for this task; see next bullet).
    - **Why NOT Cloudflare Email Service** (the `cloudflare-email-service`
      skill's own recommended approach) was used here: it requires the
      **FROM domain** to be onboarded (`wrangler email sending enable
      yourdomain.com`), which means new DNS records on procleanorganizers.com
      — the same domain whose custom-domain connection is explicitly on hold,
      and whose MX/SPF/DKIM were explicitly flagged as "verified untouched."
      Adding an SPF-affecting record for a different purpose right now, for a
      domain the owner said to leave alone, was judged out of scope without
      asking first. If the owner ever wants to send FROM
      `noreply@procleanorganizers.com` instead of relaying through Gmail,
      that's the point to revisit Cloudflare Email Service — until then,
      Gmail SMTP via `worker-mailer` is the correct, lower-risk choice.

## Where things stand as of the last message in this conversation

See `STATUS.md` for the live checklist. `origin/main` is at `d12c191`
(Services methodology + NYC & NJ + Mercer tile — pushed and verified live
earlier). Since then, **several more commits exist locally, NOT pushed**,
per the owner's standing "don't push until I say so" instruction:

```
293b063  Add swipeable proof carousel to /portfolio (local review, not deployed)
10cc7cd  Portfolio stat label -> "Multiple"; document carousel session
e3db406  Simplify proof carousel static card to a single line
d9127c9  Proof carousel: remove drag/swipe, add two arrows, trim intro copy
2a0769c  Swap carousel photos 1 and 3; remove hero subhead line
0c18336  Restore hero subhead
68e6636  Fix email address wrapping/overflow on contact card and footer
```

Plus the mailer.ts email fix (item 11 above) — **not yet committed** as of
this writing; check `git status` before assuming it is. **Always run
`git log origin/main --oneline -1` vs local `HEAD` before telling the owner
anything is live** — this project has had real confusion from assuming a
local commit was deployed.

Also still pending: the licensing question on `proof-03` (stock 3D render),
and a decision on whether the proof carousel should lead with all 8 images
(mixed before/after) or trim to results-only — both flagged to the owner,
unanswered as of this writing. KV binding (for persistent content edits) was
handed off to the user's browser agent as dashboard-only steps — not yet
confirmed done. Custom domain is explicitly on hold per the user's instruction.

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
