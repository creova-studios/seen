# Public Website (`seen.verse.one`)

Covers the dependency-free static public website in `site/` deployed at `https://seen.verse.one` (launched via `control-seen start --run-id "$RUN_ID" --surface website`).

## Sub-features

- **Trilingual Public Pages (`/`, `/fr/`, `/es/`)** — Editorial overview of SEEN (`SEEN: You're seen in the app`), What is SEEN, For creators, For viewers, Beta status, and About CREOVA (`https://creova.one`).
- **Language Navigation** — Header language links (`English` `/`, `Français` `/fr/`, `Español` `/es/`) with `aria-current="page"` on the active locale and `rel="alternate" hreflang` links in `<head>`.
- **"Make a SEEN" Interactive Toy (`site/src/assets/site.js`)** — Client-side interactive card builder with mood radios (`Quiet`, `Bold`, `Tender`), format radios (`Story`, `Song`, `Film`), language radios (`English`, `Français`, `Español`), and a `Copy my SEEN` button.
- **Demo Access CTA (`DEMO_ACCESS=invite` vs `DEMO_ACCESS=open`)** — Default build (`DEMO_ACCESS=invite`) renders `Ask for an invite` (`mailto:hello@creova.one`) links; open-demo build (`DEMO_ACCESS=open`) points directly to `https://seen-sigma-eight.vercel.app`.
- **Legal Pages (`/terms/`, `/privacy/`, `/fr/terms/`, `/fr/privacy/`, `/es/terms/`, `/es/privacy/`)** — Standalone terms and privacy pages in all three languages.

## How to get to it (user POV)

1. Start the website surface: `.agents/skills/verify-seen/bin/control-seen start --run-id "$RUN_ID" --surface website`.
2. Open `/` for English, or click `Français` (`/fr/`) / `Español` (`/es/`) in the header language switcher.
3. Scroll to the `Make a SEEN` section, select a mood (`Quiet` / `Bold` / `Tender`), format (`Story` / `Song` / `Film`), and language (`English` / `Français` / `Español`), and click `Copy my SEEN`.
4. Scroll to the footer and click `Terms` (`/terms/`) or `Privacy` (`/privacy/`).

## Driving it with control-seen

```bash
HARNESS=".agents/skills/verify-seen/bin/control-seen"

# 1. Start the website surface (builds site/dist and serves it)
$HARNESS start --run-id "$RUN_ID" --surface website
$HARNESS doctor --run-id "$RUN_ID"
URL=$($HARNESS url --run-id "$RUN_ID")

# 2. Verify English home page & interactive "Make a SEEN" toy
$HARNESS browse --run-id "$RUN_ID" goto "$URL/"
$HARNESS browse --run-id "$RUN_ID" wait 400
$HARNESS screenshot --run-id "$RUN_ID" 01-website-en
$HARNESS snapshot --run-id "$RUN_ID" 01-website-en

$HARNESS browse --run-id "$RUN_ID" click "label:has-text('Bold')"
$HARNESS browse --run-id "$RUN_ID" click "label:has-text('Film')"
$HARNESS browse --run-id "$RUN_ID" click "button:has-text('Copy my SEEN')"
$HARNESS browse --run-id "$RUN_ID" wait 300
$HARNESS screenshot --run-id "$RUN_ID" 02-website-make-a-seen

# 3. Switch to French (/fr/) and Spanish (/es/)
$HARNESS browse --run-id "$RUN_ID" goto "$URL/fr/"
$HARNESS browse --run-id "$RUN_ID" wait 300
$HARNESS screenshot --run-id "$RUN_ID" 03-website-fr
$HARNESS snapshot --run-id "$RUN_ID" 03-website-fr

$HARNESS browse --run-id "$RUN_ID" goto "$URL/es/"
$HARNESS browse --run-id "$RUN_ID" wait 300
$HARNESS screenshot --run-id "$RUN_ID" 04-website-es
```

## Gotchas

- **Use `--surface website` when starting `control-seen`:** The default `--surface app` starts the Vite React app (`src/`). To verify `seen.verse.one` (`site/`), pass `--surface website` to `control-seen start`.
- **Static HTML routes (not hash routes):** Unlike the React app (`/#/for-you`), the public website uses clean static paths (`/`, `/fr/`, `/es/`, `/terms/`, `/privacy/`).
- **`seed-user` and `clear-state` are for the React app:** `site/` is stateless and does not use `seen_*` `localStorage` keys.
