# SEEN website (`site/`)

The customer-facing website for SEEN: what it is, who it is for, beta status, and a clear way into the app. It is a separate deployment from the app in the repo root, at `seen.creova.one`, and it links back to creova.one. The only link between the two sites is navigation; they share no auth, cookies or analytics.

Static, no dependencies (one same-origin script for the interactive toy). Nine pages: home, terms and privacy in EN (`/`, `/terms/`, `/privacy/`), FR (`/fr/...`) and ES (`/es/...`). Page copy is in `src/content.mjs`; terms and privacy are in `src/legal.mjs`. FR and ES are drafts until a native speaker reviews them, and **the terms and privacy text must be reviewed by a lawyer before the domain goes live**. Links are relative, so the output works on any host or sub-path.

```bash
cd site
npm run build      # writes dist/
npm run check      # node:test checks: key parity, every link resolves, a11y basics, no third-party requests
```

Node 18 or newer. Nothing to install.

## Configuration (environment variables at build time)

| Variable | Default | Purpose |
|---|---|---|
| `SITE_URL` | `https://seen.creova.one` | The website's public URL: drives canonical, hreflang, `sitemap.xml` and the `CNAME` file. Set it to an empty string for a local preview without them |
| `APP_URL` | `https://seen-sigma-eight.vercel.app` | Where "Try the demo app" goes. Change to the app's own domain when it has one |
| `CREOVA_URL` | `https://creova.one` | Where the links back to CREOVA go |
| `DEMO_ACCESS` | `invite` | `invite`: every call to action asks for an invitation (a `mailto:` link) and the demo URL is not on the page. `open`: calls to action go straight to `APP_URL`. Keep `invite` while the demo is invite-only |
| `INVITE_EMAIL` | `support@creova.one` | Where invite requests go; this mailbox is already published on creova.one. The site collects nothing itself |
| `PHOTOS` | `on` | `off` builds without the three photographs (inked panels and the mascot instead). Use it until release forms are confirmed: see `docs/product/PHOTO_RELEASES.md` |

## Hosting: GitHub Pages at seen.creova.one, DNS on Cloudflare

Same pattern as www.creova.one (GitHub Pages, DNS in Cloudflare). The SEEN source repo is private, and GitHub Pages on a private repo needs a paid plan, so the built site is published to a small **public** repo that holds only the generated files (no source, no secrets). The app keeps its own deployment.

One-time setup (owner actions; not done yet):

1. Create an empty public repo, for example `creova-gif/seen-site`.
2. Publish: `cd site && npm run check && npm run publish -- https://github.com/creova-gif/seen-site.git` (builds, copies `dist/` into the repo, commits, pushes; never force-pushes).
3. In that repo: Settings, Pages, deploy from branch `main`, folder `/`. Set the custom domain to `seen.creova.one` and tick Enforce HTTPS once it is available.
4. In Cloudflare DNS for creova.one: add `CNAME` `seen` pointing to `creova-gif.github.io`, **DNS only (grey cloud)** until GitHub has issued the certificate.
5. Security: verify `creova.one` under the GitHub account's Pages settings (domain verification), so nobody else can claim `seen.creova.one` if the record is ever left dangling.

To update the site later, run step 2 again. A workflow in the private repo can automate this with a deploy key; it is not set up.

Limits to know: GitHub Pages cannot send custom headers, so the policy in each page's `<meta>` tags (CSP, referrer) is all there is; `frame-ancestors` and `X-Frame-Options` cannot be set, which matters little for a static page with no forms or login. The app should get its own one-level subdomain next to this one (for example `seenapp.creova.one`); a name two levels deep such as `app.seen.creova.one` is not covered by Cloudflare's free certificate if it is ever proxied. Firebase Hosting (Google Cloud) remains a fallback if headers become necessary; `site/` works on any static host.

## Look and assets

**Colours and components come from the SEEN app** (`src/styles/seen-tokens.css`): pure black canvas, dark surfaces with hairline borders, white pill buttons with spaced uppercase labels, the story / creator / funding accent colours, the green glow of the entry button, and the app's own tagline (reused from `src/app/i18n/strings.ts` so the FR/ES wording matches). Creators use the app's creator purple, viewers its story amber. **Typefaces come from the CREOVA brand** (`creova-gif/creova`, `src/styles/globals.css`): display and body use the same stack as creova.one (`Quasimoda`, then `Avenir Next`, `Century Gothic`, `General Sans`), bold with tight tracking for headings, and Instrument Serif for accents. Visitors therefore see the same faces creova.one shows them. The CREOVA mark sits in the top bar.

- **Fonts**: Quasimoda is a licensed Adobe font and is not loaded, exactly as on creova.one today. General Sans is not bundled because I could not confirm that its Fontshare licence allows redistributing the files from a public repo; to match creova.one on devices without Avenir Next or Century Gothic, either confirm the licence and add the files, or accept the generic sans fallback. Instrument Serif (SIL OFL 1.1) is self-hosted in `src/fonts/` with its licence in `src/fonts/OFL.txt`. Nothing is loaded from other origins.
- **Icons** (`src/icons/`) are the app's own files from `public/icons/` (the green glowing "S.E.E.N" mark): 192 px favicon, 180 px apple-touch icon, and the 512 px icon used as the share-preview image. The site has no web-app manifest on purpose, so the marketing site is not installable as if it were the app. Refresh these files when the app's icons change.
- **Art** (`src/art.mjs`): the mascot ("Seen", a one-eyed creature that stands for being seen, with hello / wow / joy / read poses, a blink and a wave) and three inked spot illustrations (languages, creators, funding) are original SVG drawn for this site, inline, decorative (`aria-hidden`) and request-free. The manga look (white "pages" with black ink and halftone on the dark site, offset comic-print shadows, focus lines, speech bubbles, a ticker) is plain CSS.
- **App screens** (`src/img/app-*.jpg`): real screenshots of the demo app (sample stories, "Demo mode" banner visible), taken at phone size from the SEEN app. Refresh them when the app's look changes. Do not use screens that show real funder names (the Funding list) as a showpiece: it could read as a partnership. Do not use screens containing real user data.
- **Photos** (`src/img/`, resized from the public creova.one site): `hero-portrait.jpg`, `creators-laptop.jpg`, `viewers-chess.jpg`. They show real people from CREOVA's community and event work. Before relying on them for SEEN marketing, confirm CREOVA holds releases covering this use. They must not be captioned or described as SEEN users, creators or testimonials; the alt text only describes what is pictured. The speech bubbles belong to the mascot, never to the people in photos.
- **Editorial layer** (learned from VERSE, CREOVA's other imprint, `verse.creova.one`): oversized light-weight headlines with one italic accent word, mono "field note" labels, automatically numbered section labels (`01 / POINT OF VIEW`, via a CSS counter), a technical "form study" drawing of the mascot's eye (`study()` in `src/art.mjs`), an honest FAQ, and a giant outlined wordmark to close. The VERSE look itself (warm paper, oxblood, garments) is not copied: SEEN keeps the app's black, purple and amber.
- **Make a SEEN** is the one interactive piece: pick a feeling, a form and a language to get a short story seed (27 original lines in `src/seeds.mjs`, EN/FR/ES), copy it, and open the app. It runs from `src/site.js`, the only script on the site, served from the same origin. It stores nothing, sends nothing and sets no cookies, and a check enforces that. Without JavaScript the page shows one default seed and hides the controls. The seeds are deliberately universal (no real people, communities or cultural material).
- **Motion** (float, blink, wave, ticker, reveal) is CSS only. Every animation sits inside `@media (prefers-reduced-motion: no-preference)`; a check enforces it, and the ticker becomes a static, wrapped list for visitors who prefer reduced motion.

## Rules for this site

- Describe only what exists. The app runs on sample data today; say so. Planned items are labelled planned.
- Name no real organisation as a partner without a signed agreement.
- State the beta date only as the owner has confirmed it (currently: January 2027, to be confirmed). creova.one also carries a beta date, so change both together.
- The only script is `site.js` (same origin). No trackers, and no scripts, fonts or images from other origins, without updating the CSP, the privacy notice and the "no cookies, no analytics" line in the footer.
- Share the idea, not the plan: marketing copy names benefits, not mechanics or unreleased features (a check fails the build if roadmap wording such as guest mode, transcripts, credit challenges or application trackers appears in it). The published files must carry no source paths, repo names or internal comments (also checked). The demo app itself is public, so anything it shows is already visible; the website should not add the roadmap on top. Every image needs a real description in all three languages and explicit width and height.
- Keep `src/legal.mjs` true to what the site does. If you add analytics, cookies, a form or any third-party request, change the privacy notice, the footer line and the CSP first.
- The app's own terms and privacy notice (for real accounts) are separate and must be published before anyone can sign up.
