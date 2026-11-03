# Photo releases for the SEEN website

**Status: UNVERIFIED.** No release forms, consent records or contracts for these photographs were found (searched the `creova` repository, the owner's Desktop and Downloads on 2026-10-29). This is a gap to close, not a finding that consent is missing: CREOVA may hold releases that were never filed where we looked.

## What is published

The SEEN website (`seen.creova.one`) shows three photographs, copied from the public creova.one site and resized (`site/src/img/`). Each shows identifiable people.

| File on the SEEN site | Source in `creova-gif/creova` | Where it appears | People shown | Release on file |
|---|---|---|---|---|
| `hero-portrait.jpg` | `src/assets/photo-duo-portrait.jpg` | Closing section (arch portrait) | 2 adults, studio portrait | **Unknown** |
| `creators-laptop.jpg` | `src/assets/photo-social-laptop.jpg` | "For creators" polaroid | 1 adult in focus, 1 in background | **Unknown** |
| `viewers-chess.jpg` | `src/assets/photo-community-chess.jpg` | "For viewers" polaroid | 2 adults | **Unknown** |

Photographer, shoot date, client and venue are not recorded anywhere we could see. The images came into the `creova` repo before May 2026 (a later commit only compressed them).

## Why this matters

Appearing on CREOVA's own site as event or portfolio work is not the same use as appearing on the marketing site of a different product. Depending on the release, people may have agreed to the first and not the second. In Canada (Ontario), using a recognisable person's image in promotion without consent can raise privacy and misappropriation-of-personality claims; if anyone shown is a minor, a guardian's consent is needed. This is not legal advice: have a lawyer confirm.

## Decide, per photo (all three are independent)

1. **Find the paper.** Ask whoever shot or commissioned each image for the release, client contract or event consent notice that covers the shoot. Record who, when, and what use it allows. If it covers CREOVA's marketing broadly, including its products, that may be enough; a lawyer should confirm.
2. **Or get a new release** from each identifiable person (and a guardian for anyone under the age of majority), using the draft below.
3. **Or take the photo down.** One variable does it: build the site with `PHOTOS=off` and publish. The three portraits are replaced by the inked illustrations and the mascot, nothing else changes, and a check proves the build contains no photographs.

Until step 1 or 2 is complete for a photo, the safe default is step 3 for that photo. The live site currently shows all three, so the owner should pick one path.

## How the site uses the photos (rules already enforced)

- Alt text describes only what is pictured; nothing says the people use, created or endorse SEEN.
- Speech bubbles belong to the mascot, never to the people.
- No names, captions or testimonials.
- The credit line says the photographs come from CREOVA's community and event work.

## Release form (draft for lawyer review)

> **Photo and image release**
>
> I, ______________________ ("I"), give CREOVA (the "Studio") permission to use photographs, video and audio recordings that show me ("the Images") taken on ____________ at ____________.
>
> **Where.** The Studio may use the Images on its websites and social channels and on the websites, apps and marketing of products and projects that CREOVA makes, including SEEN and VERSE, in print and online.
>
> **How.** The Images may be cropped, resized, colour-adjusted and combined with text and graphics. They will not be altered to change what I am doing or saying, and will not be used to suggest that I endorse, use or work for a product or organisation unless I agree to that separately in writing.
>
> **No payment.** I will not be paid for this use unless we agree otherwise in writing.
>
> **Withdrawing.** I may ask the Studio to stop using the Images by writing to support@creova.one. The Studio will remove them from its own sites and channels within 30 days and will not use them in new material. I understand that copies already published or shared by others may not be recoverable.
>
> **Privacy.** My name will not be published with the Images unless I agree. The Studio will keep this form and use my contact details only for matters about this release.
>
> **Minors.** If I am under 18, my parent or guardian signs below and confirms they have authority to consent for me.
>
> Name: ______________  Signature: ______________  Date: ________
> Parent or guardian (if under 18): ______________  Signature: ______________
> Contact (email or phone): ______________

French version of the same form: to be translated and reviewed together with the English, then used wherever the shoot was in French.

## Record keeping

Keep each signed release with the original image file, named for the image, in a place the team can reach (not in this repository: it holds personal information). Add the photo's row here with date, who holds the paper, and the use it covers, then flip its status from Unknown. Review this table before any change to the photographs on the site.
