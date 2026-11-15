# Funding listings — sources and upkeep

Source file: `src/app/services/data/fundingListings.ts` (12 programmes, researched 2026-09-24).

## Rules

1. **Only published facts.** A `deadline` is stored only when the funder published that date; otherwise `availability` is `rolling`, `upcoming` or `tba` and `deadline` is `null` (a unit test enforces this). Amounts not published as a figure stay `null` with an `amountNote`.
2. **Traceable.** Every listing has `applyUrl` (funder's page) and `sourceUrls`; the detail screen shows them with the `verifiedAt` date.
3. **Honest status.** `opportunityStatus()` decides Open now / Coming up; "Mark as applied" is refused unless the intake is open.
4. Dates render in the funder's own time zone (`deadlineTimeZone`).

## Listings (as of 2026-09-24)

| Funder | Programme | Status on 2026-09-24 | Key fact |
|---|---|---|---|
| Canada Media Fund | Digital Creators Pilot Program 2026–27 | Open, closes Oct 1, 2026 11:59 p.m. ET | Up to $40,000, max 75% of budget; podcasters now eligible |
| Canada Council for the Arts | Creating, Knowing and Sharing | Open, next deadline Nov 25, 2026 | First Nations, Inuit, Métis applicants |
| Canada Council for the Arts | Explore and Create — Research and Creation | Rolling | Apply before project start |
| Indigenous Screen Office | Marketing, Promotion and Distribution | Open until Mar 1, 2027 or funds run out | $25k / $50k |
| Indigenous Screen Office + partners | Shared Ground International Co-Production Initiative | Coming up (mid-Oct 2026) | Labs from early 2027 |
| Hot Docs | Hot Docs-Slaight Family Fund | Coming up (details late Oct–early Nov 2026) | $15k–$60k, music docs |
| Hot Docs | Hot Docs Forum 2027 / Canadian Pitch Prize | Coming up (Oct 2026) | $10k prize |
| Rogers Group of Funds | Rogers Documentary Fund | Closed (Aug 19, 2026); 2027 dates TBA | Up to $100k non-recoupable |
| Indigenous Screen Office | Podcasting Program (with YouTube) | Closed (Oct 20, 2025); next TBA | $15k dev / $30k prod |
| Telefilm Canada | Talent to Watch | Closed (Apr 28, 2026); next TBA | First features |
| Bell Fund | Short-Form Digital Series | Dates not confirmed — check funder | Online series |
| Ontario Arts Council | Media Artists Creation Projects | 2026–27 dates being updated by OAC | Ontario artists |

## How the research was done — and its limit

Direct page fetches to funder sites were blocked by the research environment's
network policy, so facts were gathered with web searches restricted to each
funder's own domain and cross-checked where two sources existed. Where a date
or amount could not be confirmed that way it was **left out**, not estimated.

## Upkeep (owner needed)

- Monthly: re-check each `applyUrl`, update dates/status, bump `verifiedAt`.
- Remove programmes that end; add new ones only with a funder source.
- After Oct 1, 2026 the CMF listing moves to Closed automatically; update it when 2027–28 guidelines publish.
