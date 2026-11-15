# SEEN — definition of done

**SEEN — a Creova product.** A change is done when every relevant line is true. A reviewer can reject a PR for any unchecked line.

- [ ] **Requirement:** acceptance criteria in `SEEN_ACCEPTANCE_CRITERIA.md` met and demonstrated.
- [ ] **Design reconciled:** matches the Figma frame or the documented deviation (with reason) in `docs/audit/03_…`.
- [ ] **Built from `components/seen`:** no new one-off buttons, cards or colours; missing components are added there with their Figma node id.
- [ ] **Responsive:** no overflow at 320–1280 px; mobile intentionally laid out.
- [ ] **Keyboard + screen reader:** reachable, visible focus, named controls, logical headings.
- [ ] **Accessible:** axe clean; contrast AA (text) and 3:1 (non-text); targets ≥ 44 px; reduced motion respected.
- [ ] **States:** loading, empty, error + retry, offline (and unauthorised/forbidden where relevant) via `useResource` + `ResourceView`.
- [ ] **Mutations:** optimistic with rollback and a toast; no success shown before the write succeeds.
- [ ] **Honest:** no fake data, partners, money or "sent" messages; demo data labelled.
- [ ] **Analytics considered:** allow-listed `track()` events only; no names, emails or free text.
- [ ] **Tests:** unit/component for logic; E2E for any change to a critical journey; a regression test for every bug fix.
- [ ] **Checks pass:** `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e` (and lint once added).
- [ ] **Docs updated:** feature inventory, backlog status, CLAUDE.md if a rule changed.
- [ ] **Product principles respected:** `SEEN_PRODUCT_PRINCIPLES.md`.
