# SEEN — decisions required

**SEEN — a Creova product.** Only decisions that materially change positioning, money, data, privacy, architecture or deletion of work are listed. Minor reversible choices were made and recorded in the docs.

| ID | Decision | Known | Unknown | Working hypothesis | Risk if wrong | Founder input? |
|---|---|---|---|---|---|---|
| **D-01** | Which "deployed version" is the preferred direction: before 2026-10-05 (`707b179`) or now (`a35a8f1`, unified UI)? | Production changed today | Which look the founder meant | The current one (it keeps the earlier look and fixes defects) | Rework visual direction | **Yes** |
| **D-02** | Share the original handwritten feedback (photos) | 17 themes transcribed in the brief | Exact wording of FB-02, FB-04, FB-10 | Interpretations in `04_…TRACEABILITY_MATRIX.md` | Building the wrong thing for 3 items | **Yes** |
| **D-03** | Mobile app: pause, wrap the web app, or continue native | `mobile/` is a 5-screen prototype on a different stack | Store-launch timeline | Pause; ship web/PWA first | Two diverging products | **Yes** |
| **D-04** | Heading typeface: Fraunces (Figma) vs Inter (live) | Figma specifies Fraunces | Brand preference | Keep Inter until tested | Visual identity drift | **Yes** |
| **D-05** | Create entry point: "+" in top bar for creators (recommended) / Create tab / Profile only (Figma) | Feedback asks for "+ Create"; Figma says Creator Studio is never a consumer tab | — | "+" for creators only | Viewer clutter or hidden creation | **Yes** |
| **D-06** | Approve the product definition and principles (incl. no public counts, no DMs, not crowdfunding) | Drafted from evidence | — | Approve as written | Social-media drift | **Yes** |
| **D-07** | Project funding / payments (supporter contributions, subscriptions, payouts) in scope? Which provider, entity, jurisdiction? | Figma designs it; legal/financial implications | Business model, entity | Out of MVP; opportunities + tracker only | Regulatory exposure | **Yes** |
| **D-08** | Adopt the branching strategy: tag backups, fast-forward `dev` to `main`, develop on `dev` | `dev` is a strict ancestor of `main` | — | Approve | Developing on stale `dev` | **Yes** (repository change) |
| **D-09** | Backend: Supabase (ADR-003); who owns the projects and billing? | ADR written | Account owner, region (Canada for PIPEDA?) | Supabase, Canadian region | Data residency | **Yes** |
| **D-10** | Brand relationship "SEEN — a Creova product" placement (see `SEEN_CREOVA_BRAND_RELATIONSHIP.md`) | Current UI says "by CREOVA" in About | Preferred casing (CREOVA vs Creova) | Endorsed-brand model | Inconsistent identity | Yes (quick) |
| **D-11** | Legal text for Terms & Privacy | None exists | Counsel | Draft from Figma + data inventory, then counsel review | Launching without terms | **Yes** |
| **D-12** | Institution partnerships: any signed agreements? | Brock/CMF frames exist in Figma; removed from app | Agreements | None signed → keep removed | False partner claims | Yes |
