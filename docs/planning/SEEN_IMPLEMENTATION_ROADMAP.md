# SEEN — implementation roadmap

**SEEN — a Creova product.** Sequenced by dependency. Sizes are rough (S ≤ 1 day, M ≤ 3 days, L ≤ 2 weeks). Starts after approval of the reconciliation report.

| Phase | Work | Size | Exit criteria |
|---|---|---|---|
| **0. Safety** | Backup tags (P0-05) · `dev` fast-forward + protection (P1-17) · commit lockfile + `npm ci` (P1-16) | S | Tags on origin; CI on `dev` green |
| **1. Test gate** | Reader E2E ids · publish E2E (P1-18) | M | Both journeys automated |
| **2. Trust & legal** | Report content (P0-03) · Terms & Privacy (P0-04) · About wording "a Creova product" | M | E2E; counsel sign-off on text |
| **3. Product clarity + onboarding** | Introduction (P1-01) · guest mode (P1-02) · ≤ 4-step onboarding (P1-03) · password UX (P1-10) | L | Visitor → first story without account; onboarding metrics live |
| **4. Story consumption** | Card family (P1-05) · player speed/transcript/states (P1-06) · completion (P1-07) · Library lenses (P1-09) | L | AC met; axe clean |
| **5. Discovery** | For You composer + reasons + mute (P1-04) · search scopes (P1-08) | M | AC met |
| **6. Creator experience** | Edit profile + seeking/support (P1-11) · creator intro (P1-12) · guided publish (P1-13) · Create entry (D-05) | L | Creator E2E passes |
| **7. Accessibility hardening** | Borders 3:1, text scale, device SR pass (P1-14) | M | Manual log recorded |
| **8. Backend** | Supabase schema + RLS + Auth + adapter (P0-01/02) · legacy services behind contracts (P1-15) | L+ | Two-user RLS tests; cross-device E2E |
| **9. Hardening** | P2 items (session states, settings hub, CSP enforce, ESLint, strict, SEO, desktop design) | L | Release checklist green |
| **Later** | P3 (recorded narration, downloads, payments per D-07, institutions per D-12, concepts, mobile per D-03) | — | Founder decisions |

Phases 2–7 can run on the demo adapter while Phase 8 proceeds in parallel; Phase 8 is required before any public launch.
