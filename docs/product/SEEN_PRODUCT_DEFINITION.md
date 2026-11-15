# SEEN — product definition

**SEEN — a Creova product.** Status: **proposed** (needs founder sign-off, decision D-06). Evidence: deployed app, Figma page notes, story catalogue, stakeholder feedback themes. No user-research data exists yet, so audience statements are hypotheses to test.

## One line

SEEN is a place to **experience community stories in their creators' own voices**, and to help the people who tell them **be found, credited and supported**.

## Vision

Stories from underrepresented communities are heard, understood and sustained, with their authors credited and paid, instead of being flattened into content for an engagement feed.

## Mission

Give storytellers a home where their work is presented with context and care, and give audiences a calm way to discover, listen, read, save and support it. Bilingual and trilingual (EN/FR/ES) from day one.

## Problem

1. **Creators**: community storytellers (oral historians, musicians, collectives, documentary makers) publish on platforms that reward volume and virality. Context is stripped, attribution is weak, and funding is scattered across dozens of funder websites.
2. **Audiences**: people who want depth (stories with context, in their language, accessible as audio) get feeds designed to keep them scrolling, not to help them understand.
3. **Supporters and funders**: they struggle to find credible storytellers whose work fits their programmes.

## Target users (see `SEEN_USER_ROLES.md`)

Explorer (audience) · Creator · Supporter/partner/funder (later) · Moderator · Admin. **MVP focus: Explorer and Creator.**

## Jobs to be done

| Who | When… | I want to… | So that… |
|---|---|---|---|
| Explorer | I have 10–30 minutes | find a story worth my attention, in my language, that I can listen to or read | I learn something real about a community |
| Explorer | I started a story yesterday | pick up exactly where I left off | it fits into real life |
| Creator | I've made something meaningful | publish it with its cultural context and credit intact | it's understood the way I meant it |
| Creator | I need money to make the next piece | find funding I'm actually eligible for and track my applications | I spend time making, not searching |
| Supporter / funder | I run a programme | find credible creators aligned with it | funds reach the right people |

## Value propositions

- **For explorers:** curated, contextualised stories; listen or read; continue anywhere; no engagement bait.
- **For creators:** a profile that presents them as people, not inventory; a guided publish flow that preserves context and rights; verified funding opportunities in one place.
- **For supporters:** a credible window onto creators and their projects (later release).

## How SEEN differs from social media

SEEN answers the stakeholder question *"This is not social media — why? What do we do?"* like this:

| Social media optimises for | SEEN optimises for |
|---|---|
| Time on app, infinite scroll | Finishing a story, then stopping |
| Public popularity (likes, follower counts) | Understanding and credit (context, creator identity) |
| Opaque engagement ranking | Explained, user-controllable recommendations |
| Posting volume | Considered, reviewed publishing |
| Ad revenue from attention | Creator support and funding |

## Value chains

Audience: **Discover → Experience → Understand → Connect → Save → Support**
Creator: **Create → Tell the story → Build credibility → Be discovered → Connect → Access opportunity → Receive support → Grow**

Stories, creators, opportunities and support connect like this: **Story → Creator → Work / project → Need → Opportunity → Support**.

## Product boundaries (what SEEN intentionally does not do)

- No public like or follower counts; no infinite scroll; no autoplay chains.
- No direct messaging in the current release (moderation cost, safety).
- Not a crowdfunding platform (Figma: "SEEN is not a crowdfunding site"). Any money movement goes through a regulated payment provider, and only after decision D-07.
- No real organisations named as partners without a signed agreement.
- No engagement-only ranking.

## Primary loops

1. **Audience loop:** open → *Continue* or a recommended story → listen/read → save or follow creator → return later.
2. **Creator loop:** publish → story is discovered → audience follows → creator finds an opportunity → applies → publishes again.

## Current release (MVP) boundary

**In:** introduction + guest exploration, short onboarding, For You/Explore/Search, Story World + reader + player (device voice + transcript + speed), Library (Continue, Saved, Following), creator profiles + Edit Profile, guided publish, funding opportunities + personal tracker, notifications, report content, settings, terms/privacy, real auth (Supabase).
**Next:** recorded narration, multiple drafts + review statuses, recommendation reasons + mute topics, moderation backend + appeals, desktop layout, SEO.
**Later:** project funding / payments, institutions workspace, downloads/offline, concepts (Mood Mixer, Cultural Map, Listening Wrapped).

## Success definition (see `SEEN_MEASUREMENT_FRAMEWORK.md`)

Explorers finish stories and come back to continue them. Creators publish a second story. Creators save and apply to opportunities. Vanity metrics are not success measures.
