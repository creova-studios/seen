# Lint: current state and smallest useful plan

**State:** no lint tool is configured. `npm run typecheck` (strict TypeScript) is the static check. There is no Svelte in this repository (no `.svelte` files or Svelte dependency); the Wappalyzer "Svelte" and "Bits UI" hits were false positives, so a lint setup only needs to cover React and TypeScript.

**Why add it:** typecheck cannot catch hooks mistakes (missing dependencies, conditional hooks) or many accessibility mistakes (an icon-only button without a name, a click handler on a div). Those are exactly the classes of defect found in the manual audit.

**Smallest useful configuration (not applied yet):**
- `eslint` (flat config) with `typescript-eslint` recommended, `eslint-plugin-react-hooks`, and `eslint-plugin-jsx-a11y` (recommended rules).
- One `npm run lint` script; CI runs it after typecheck.
- Four dev dependencies, no formatter, no style rules.

**Why it is not applied in this change:** turning it on today would report existing violations across about 150 files (for example the old creator-flow components use clickable divs and `console.error` calls) and mix a large cleanup into a feature change. Plan: add the config as its own PR into `dev` with rules set to `warn`, fix or suppress with reasons, then switch to `error` and make `npm run lint` a required check. Until then lint is not a required check.
