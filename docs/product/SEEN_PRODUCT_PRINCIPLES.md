# SEEN — product principles

**SEEN — a Creova product.** These turn the stakeholder question *"This is not social media — why? What do we do?"* (FB-09) into rules that design and code reviews can check. Each has an observable test.

| # | Principle | What it means in the product | Review test |
|---|---|---|---|
| 1 | **Story before vanity** | No public like, play or follower counts. Private stats are for the creator only | No count of other people's reactions is rendered on any public surface |
| 2 | **Discovery before popularity** | Feeds mix interests, new voices and freshness; nothing ranks on raw engagement alone | Every feed module has a non-engagement reason (`reason` label) |
| 3 | **Creators are people, not content inventory** | Creator name and profile link on every story surface; profiles say what they seek and how to support | Story card/header without creator = bug |
| 4 | **Meaningful connection over reach** | Follow is private and for updates, not status. No DMs until moderation exists | No follower leaderboards; follow lists are private by default |
| 5 | **Finish, then stop** | Stories end with a completion moment, not an autoplay chain; no infinite scroll | Lists paginate or end; next story requires a tap |
| 6 | **Explain, and let people steer** | "Because you…" on recommendations; mute topics; recommendations can be reset | Each module answers "why am I seeing this?" |
| 7 | **Accessibility by default** | WCAG 2.2 AA, audio + text for every story, captions/transcripts, reduced motion, high contrast | axe passes; manual SR check per release |
| 8 | **Reduce cognitive load; progressive disclosure** | Ask only what's needed now; defer preferences until they help | Onboarding ≤ 4 steps before value |
| 9 | **Context and credit travel with the work** | Cultural context has a source and a "verified by"; rights shown | Story without context shows no context card, never invented text |
| 10 | **Honesty over polish** | Never show success before it happens; never fake data, partners or money | Demo data labelled; no unverified partner names |
| 11 | **Safety is designed in** | Report from any story; reasons-first moderation; appeals | Report entry on every story and profile |
| 12 | **Build only what tests the hypothesis** | Concepts stay in Figma until the core loops work | New feature cites a loop in `SEEN_PRODUCT_DEFINITION.md` |

## Recommendation philosophy (answers FB-14)

Ranking signal = **relevance** (story themes vs. the person's stated interests and listening) + **diversity** (no more than two rails of the same kind in a row, new voices guaranteed a slot) + **freshness** + **creator intent** (a creator's chosen audience) + **quality** (editorial review status) + **explicit controls** (mute topic, "less like this", reset).

Engagement is not a ranking signal by itself.

- **Cold start:** editorial picks + language + optional interests.
- **Transparency:** each module shows its reason.
- **Safety:** removed or under-review content is excluded.

## Social mechanics: kept, changed or removed

| Mechanic | Decision | Why |
|---|---|---|
| Follow creator | **Keep (private)** | Gets updates; supports the creator loop |
| Public follower count | Remove | Vanity (principle 1) |
| Likes / hearts | Don't add | Vanity; use Save instead (useful to the person) |
| Comments | Replace with moderated **Community responses** | Considered contributions, not reply threads |
| Share | Keep | Brings new audiences to creators |
| Infinite feed | Remove | Principle 5 |
| Trending | Rename to "New voices" / "Editor's picks" | Popularity ≠ value |
