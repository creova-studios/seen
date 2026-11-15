# Onboarding & Authentication

Guides a first-time visitor through SEEN's 6-screen onboarding sequence (Language if unset, protected Invocation screen, protected Manifesto screen, multi-select Purpose step, optional Interests step, and Account Creation / Sign-In) or into limited Guest Mode (`"Explore without an account"`) before entering the `For You` feed (`/#/for-you`). Persists registered accounts in `localStorage.seenos_users_db` (keyed by `userId` with SHA-256 salted password hashes), active sessions in `localStorage.seenos_auth_session`, role/language/intent/interests in `localStorage.seenos_story_state`, and completion flags in `hasEnteredSEEN`, `onboarding_step`, and `onboarding_completed`.

## Sub-features

- Protected first-visit Invocation screen (`"You are entering SEEN."` → `"S.E.E.N"` / `"S . E . E . N"` entry button with `FirstScreenBackdrop`) and protected Manifesto screen (`"This is not social media"` → `"Continue"`).
- Multi-select Purpose step (`"What brings you to SEEN?"`: `Discover stories`, `Learn`, `Share my story`, `Find readers and listeners`, `Back the creators you love`), which maps choices to `role` (`creator` if `share`/`audience`, else `viewer`) and `intent`, or allows `"Explore without an account"` (Guest Mode).
- Optional Interests step (`"What do you like to read, hear and watch?"`) seeded from real catalogue themes (`Next: create your account` / `Skip: create your account`).
- Account creation (`Name`, `Email`, `Password`) or sign-in (including pre-seeded demo accounts `viewer@seen.demo`, `creator@seen.demo`, `moderator@seen.demo`, `admin@seen.demo` with password `SeenDemo2026!`) handing off directly into `For You`.
- Session persistence across full browser reloads (`onboarding_completed === "true"` and `seenos_auth_session` keep the user on `For You`).

## How to get to it (user POV)

1. Open SEEN in a fresh browser profile (or after signing out / clearing site storage).
2. Tap `S . E . E . N` on the Invocation screen, then tap `Continue` on `"This is not social media"`.
3. On `"What brings you to SEEN?"`, tap one or more purpose cards (e.g., `Share my story` for a creator account, or `Discover stories` for a viewer) and tap `Next: your interests` (or tap `Explore without an account` to enter Guest Mode immediately).
4. On `"What do you like to read, hear and watch?"`, optionally select interest chips and tap `Next: create your account` (or `Skip: create your account`).
5. Fill `Name`, `Email`, and `Password` (or switch to sign-in), then submit to arrive directly on `For You` (`/#/for-you`).

## Driving it with control-seen

```bash
CS=".agents/skills/verify-seen/bin/control-seen"
PROOF="/tmp/seen-proof-$RUN_ID"

# 1. Start from a guaranteed clean first-visit slate (never use seed-session here)
"$CS" reset --run-id "$RUN_ID"
"$CS" browse --run-id "$RUN_ID" wait 2200
"$CS" browse --run-id "$RUN_ID" screenshot "$PROOF/onboarding-01-invocation.png"
"$CS" browse --run-id "$RUN_ID" snapshot -i > "$PROOF/onboarding-01-invocation.txt"

# 2. Screen 1 (Invocation) -> Screen 2 (Manifesto: "This is not social media")
"$CS" browse --run-id "$RUN_ID" click "button:has-text('S')"
"$CS" browse --run-id "$RUN_ID" wait 800
"$CS" browse --run-id "$RUN_ID" click "button:has-text('Continue')"
"$CS" browse --run-id "$RUN_ID" wait 600

# 3. Screen 3 (Purpose) -> Screen 4 (Interests)
"$CS" browse --run-id "$RUN_ID" click "button:has-text('Share my story')"
"$CS" browse --run-id "$RUN_ID" click "button:has-text('Next: your interests')"
"$CS" browse --run-id "$RUN_ID" wait 500
"$CS" browse --run-id "$RUN_ID" click "button:has-text('Skip: create your account')"
"$CS" browse --run-id "$RUN_ID" wait 500

# 4. Screen 5 (Account Creation — note 400ms simulated auth latency + password complexity)
"$CS" browse --run-id "$RUN_ID" fill 'input[autocomplete="name"], input[placeholder="Name"]' "Maya Lin"
"$CS" browse --run-id "$RUN_ID" fill 'input[type="email"], input[placeholder="Email"]' "maya.lin@seen.local"
"$CS" browse --run-id "$RUN_ID" fill 'input[type="password"], input[placeholder="Password"]' "SeenPass123"
"$CS" browse --run-id "$RUN_ID" screenshot "$PROOF/onboarding-02-account-form.png"
"$CS" browse --run-id "$RUN_ID" click "button:has-text('Create Account'), button[type='submit']"
"$CS" browse --run-id "$RUN_ID" wait 1200

# 5. Capture For You arrival, accessibility snapshot, localStorage state, and reload persistence
"$CS" browse --run-id "$RUN_ID" screenshot "$PROOF/onboarding-03-for-you.png"
"$CS" browse --run-id "$RUN_ID" snapshot -i > "$PROOF/onboarding-03-for-you.txt"
"$CS" state --run-id "$RUN_ID" > "$PROOF/onboarding-04-state.json"

"$CS" browse --run-id "$RUN_ID" reload
"$CS" browse --run-id "$RUN_ID" wait 1000
"$CS" browse --run-id "$RUN_ID" snapshot -i > "$PROOF/onboarding-05-after-reload.txt"
```

## Gotchas

- **Protected entry screens:** Both the glowing `S.E.E.N` Invocation screen (`InvocationLayer` in `OnboardingSystem.tsx`) and the `"This is not social media"` Manifesto screen (`OnboardingPurpose.tsx`) are protected by product rules and E2E tests — never skip or merge them.
- **Language screen is skipped when default `'en'` is set:** `StoryStateContext` initializes `defaultState.language` to `'en'`, so fresh visits start at `Invocation` unless `language` is empty.
- **Password complexity + `400ms` auth delay:** Passwords require ≥8 characters with uppercase, lowercase, and a digit (e.g., `SeenPass123` or `SeenDemo2026!`). `AuthContext` simulates a `400ms` delay on sign-up and sign-in.
- **Self-assignable roles:** Choosing `Moderator` is a request rather than an immediate self-grant (`SELF_ASSIGNABLE_ROLES` allows `viewer` and `creator` at sign-up; use `moderator@seen.demo` / `admin@seen.demo` with password `SeenDemo2026!` to test moderator/admin surfaces).
