# Application statuses a user can truthfully set (DS6, G3)

Figma shows nine statuses. Only four are facts SEEN knows. External outcomes are labelled "tracked by you" until a funder integration exists.

| Status | Who sets it | Shown as |
|---|---|---|
| Eligibility checked | User completes the check | "Eligibility checked" |
| Draft | User starts notes in the workspace | "Draft" |
| Ready to submit | User ticks every checklist step | "Ready to submit" |
| Marked submitted by me | User confirms they submitted on the funder's site | "Submitted (marked by you)" |
| Under review, Info requested, Shortlisted, Approved, Declined | The user records what the funder told them | "{status} · tracked by you" |

"Start application" is not shown until the workspace exists. The code rule lives in `src/app/services/applicationStatus.ts` and is unit tested: no status is set without a user action, and no outcome without "marked submitted".
