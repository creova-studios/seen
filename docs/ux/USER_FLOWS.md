# User flows (detail)

## Funding tracker state machine

```
none ──Save & track──▶ saved ──tick any step──▶ in-progress ──(all steps ticked) Mark as applied──▶ applied
  ▲                       │                          │
  └──────Stop tracking────┴──────────Stop tracking───┘
closed call: no tracking controls, explanatory banner
```
Rules (enforced in the adapter, not only the UI): `applied` requires every step; step indexes are de-duplicated and range-checked.

## Follow / save (optimistic)

```
tap → UI flips immediately → write
          ├─ ok   → toast confirms
          └─ fail → UI rolls back → toast explains ("Check your connection…")
```

## Notification open

```
tap → mark read (optimistic, best effort) → route by target:
  story → story preview · opportunity → detail · creator → profile · collection → detail · moderation → queue
```

## Sign-up role

```
choose Viewer/Creator → account with that role
choose Moderator      → viewer account + pending elevation request + toast "Moderator access requested"
sign in to existing   → stored role wins (role tapped during onboarding is ignored)
```
