# TRANSLATION FRAMEWORK — SEASON 2
**SEEN by CREOVA — French & Spanish Translation Guide**

**Status:** Framework ready, professional translation required  
**Target Languages:** French (FR), Spanish (ES)  
**Source Language:** English (EN) — master copy

---

## TRANSLATION REQUIREMENTS

### Quality Standards

**Cultural Fluency (NOT Literal Translation)**
- Preserve emotional tone and pacing
- Respect Canadian historical context
- Avoid Anglicized phrasing
- Maintain narrative rhythm for spoken-word delivery

**Canadian French (FR-CA)**
- Use Canadian French vocabulary (not European French)
- Preserve Quebec cultural references where applicable
- Maintain Black Canadian historical accuracy
- Example: "Africville" remains "Africville" (place name, not translated)

**Latin American Spanish (ES-LA)**
- Use neutral Latin American Spanish (accessible across regions)
- Preserve Canadian context (don't make it sound American)
- Example: "porter" → "mozo de tren" or "maletero" (not Anglicized)

---

## TRANSLATION SCOPE

### Total Volume

**6 Story Worlds**
- 35 chapters
- ~15,000 words (EN source)
- ~15,000 words (FR target)
- ~16,000 words (ES target, typically 5-10% longer)

**Total Translation:** ~31,000 words across FR + ES

### Cost Estimate

**Professional Translation Rates:**
- $0.10-$0.25 per word (standard literary translation)
- $0.25-$0.40 per word (specialized cultural content)

**Budget Range:**
- Low: $3,100 (at $0.10/word)
- Mid: $7,750 (at $0.25/word)
- High: $12,400 (at $0.40/word)

**Recommended:** $8,000-$10,000 for quality cultural translation

---

## TRANSLATION WORKFLOW

### Phase 1: Translator Selection (Week 1-2)

**Translator Requirements:**
- Native FR-CA speaker (for French)
- Native ES speaker with Latin American background (for Spanish)
- Experience with cultural/historical content
- Familiarity with Black diaspora terminology
- Portfolio review required

**Where to Find:**
- Canadian Translators, Terminologists and Interpreters Council (CTTIC)
- Literary Translators' Association of Canada (LTAC)
- ProZ.com (filter: literary, cultural, FR-CA/ES-LA)
- Direct outreach to Black francophone/hispanophone communities

### Phase 2: Translation Brief (Week 1)

**Provide to Translators:**
1. This framework document
2. All 35 EN chapters (source files)
3. Glossary of key terms (see below)
4. Cultural context notes
5. Audio narration scripts (for rhythm reference)
6. Tone guide: calm, reflective, not academic

**Key Terms Glossary:**

| English | French (FR-CA) | Spanish (ES-LA) | Notes |
|---------|----------------|-----------------|-------|
| Sleeping Car Porter | Porteur de wagons-lits | Mozo de coche cama | Historical profession |
| Africville | Africville | Africville | Place name, not translated |
| Brotherhood | Fraternité / Syndicat | Hermandad / Sindicato | Context-dependent |
| Black Canadian | Noir(e) canadien(ne) | Negro/Negra canadiense | Respect cultural preference |
| Underground Railroad | Chemin de fer clandestin | Ferrocarril Subterráneo | Historical term |
| Residential School | Pensionnat autochtone | Escuela residencial | Canadian-specific |
| The Provincial Freeman | The Provincial Freeman | The Provincial Freeman | Newspaper name, italicized |
| Little Burgundy | Petite-Bourgogne | Little Burgundy | Montreal neighborhood |

### Phase 3: Translation Execution (Week 2-6)

**Timeline:**
- Week 2-3: Stories 1-2 (12 chapters)
- Week 4-5: Stories 3-4 (12 chapters)
- Week 6: Stories 5-6 (11 chapters)

**Delivery Format:**
- JSON or TypeScript files matching EN structure
- Each chapter: `{ en: "...", fr: "...", es: "..." }`
- Preserve paragraph breaks
- Flag any untranslatable terms for review

### Phase 4: Cultural Review (Week 7-8)

**Community Review:**
- Black francophone community member (for FR)
- Black hispanophone community member (for ES)
- Focus: cultural accuracy, not grammar
- 2-3 reviewers per language

**Review Checklist:**
- [ ] Historical terms accurate?
- [ ] Tone appropriate for subject matter?
- [ ] Pacing works for narration?
- [ ] No cultural appropriation or flattening?
- [ ] Canadian context preserved?

### Phase 5: Revision & Finalization (Week 8-10)

**Translator revises based on community feedback**
- Address flagged terms
- Adjust phrasing for cultural fluency
- Final proofreading
- Delivery of completed translations

---

## FILE STRUCTURE

### Current Structure (EN Only)

```typescript
// Example: /src/app/data/season2ExpandedChapters.ts
export const STORY_BLACK_CANADIAN_RENAISSANCE: ExpandedStoryWorld = {
  storyWorldId: 's2-black-canadian-renaissance',
  title: {
    en: 'Black Canadian Renaissance: Art, Sound, Refusal',
    fr: '[Translation pending]',
    es: '[Translation pending]',
  },
  chapters: [
    {
      chapterId: 's2-renaissance-ch1',
      title: {
        en: 'The Basement Press',
        fr: '[Translation pending]',
        es: '[Translation pending]',
      },
      bodyText: {
        en: `Montreal, 1968. The city is changing...`,
        fr: '[Translation pending]',
        es: '[Translation pending]',
      },
    },
  ],
};
```

### Target Structure (Multilingual)

```typescript
export const STORY_BLACK_CANADIAN_RENAISSANCE: ExpandedStoryWorld = {
  storyWorldId: 's2-black-canadian-renaissance',
  title: {
    en: 'Black Canadian Renaissance: Art, Sound, Refusal',
    fr: 'Renaissance noire canadienne: Art, son, refus',
    es: 'Renacimiento Negro Canadiense: Arte, sonido, rechazo',
  },
  chapters: [
    {
      chapterId: 's2-renaissance-ch1',
      title: {
        en: 'The Basement Press',
        fr: 'La presse du sous-sol',
        es: 'La prensa del sótano',
      },
      bodyText: {
        en: `Montreal, 1968. The city is changing...`,
        fr: `Montréal, 1968. La ville change...`,
        es: `Montreal, 1968. La ciudad está cambiando...`,
      },
    },
  ],
};
```

---

## TRANSLATION PRIORITIES

### High Priority (For CMF Demo)
1. **Story Titles** (all 6 stories)
2. **Chapter Titles** (all 35 chapters)
3. **Story Descriptions** (short summaries)

**Why:** These are visible in UI navigation and Explore sections

**Volume:** ~500 words total  
**Timeline:** 1-2 days  
**Cost:** $50-$200

### Medium Priority (For Audio Production)
4. **Story 1: Black Canadian Renaissance** (6 chapters)
5. **Story 3: Black Women's Archive** (6 chapters)

**Why:** Most likely to be narrated first (representative stories)

**Volume:** ~5,200 words  
**Timeline:** 1 week  
**Cost:** $520-$2,080

### Standard Priority (For Full Launch)
6. **Stories 2, 4, 5, 6** (remaining 23 chapters)

**Volume:** ~9,800 words  
**Timeline:** 3-4 weeks  
**Cost:** $980-$3,920

---

## QUALITY ASSURANCE

### Translation QA Checklist

**Content Accuracy:**
- [ ] All 35 chapters translated (FR)
- [ ] All 35 chapters translated (ES)
- [ ] No missing paragraphs
- [ ] No English text remaining in FR/ES versions

**Cultural Fluency:**
- [ ] Canadian context preserved
- [ ] Historical terms accurate
- [ ] No Anglicisms in FR
- [ ] No US-centric phrasing in ES

**Technical Format:**
- [ ] JSON/TypeScript structure matches EN
- [ ] Special characters properly encoded (é, à, ñ, ¿, etc.)
- [ ] Line breaks preserved
- [ ] Em dashes and punctuation appropriate per language

**Narration Readiness:**
- [ ] Sentence length appropriate for spoken delivery
- [ ] Natural pauses indicated by punctuation
- [ ] Pronunciation-challenging words flagged

---

## TRANSLATION DELIVERABLES

### From Translator (Per Story)

1. **Translated Text Files**
   - Format: TypeScript or JSON
   - Structure: Matches EN source exactly
   - Encoding: UTF-8

2. **Translation Notes**
   - Difficult terms and chosen translations
   - Cultural adaptation decisions
   - Questions/clarifications needed

3. **Glossary Updates**
   - New terms encountered
   - Recommended translations
   - Context notes

### From CREOVA (To Translator)

1. **Payment** (50% upfront, 50% on delivery)
2. **Credit** (translator name in About section)
3. **Reference** (testimonial for translator portfolio)

---

## INTEGRATION WORKFLOW

### Step 1: Receive Translations

Translator delivers:
- `season2Story1_FR.ts`
- `season2Story1_ES.ts`
- `season2Story2_FR.ts`
- etc.

### Step 2: Integration

Developer updates existing story files:
- Replace `[Translation pending]` with actual translations
- Verify structure matches
- Test language switching in app

### Step 3: Validation

Run through app:
- [ ] Switch language to FR → all text updates
- [ ] Switch language to ES → all text updates
- [ ] Switch back to EN → all text updates
- [ ] No layout breaking
- [ ] No encoding issues (é, ñ, etc. display correctly)

### Step 4: Community Review

Share with community:
- Black francophone beta testers (3-5 people)
- Black hispanophone beta testers (3-5 people)
- Collect feedback
- Minor adjustments if needed

---

## NEXT STEPS

### Immediate (Week 1)
1. [ ] Post translator job listings (CTTIC, LTAC, ProZ)
2. [ ] Review translator portfolios
3. [ ] Select FR translator
4. [ ] Select ES translator
5. [ ] Send translation brief + source files

### Short-Term (Week 2-6)
6. [ ] Receive and review translations (batch by batch)
7. [ ] Conduct community cultural review
8. [ ] Approve final translations

### Integration (Week 7-8)
9. [ ] Developer integrates translations into codebase
10. [ ] QA testing (language switching, encoding, layout)
11. [ ] Beta testing with community

### Launch (Week 9-10)
12. [ ] Multilingual platform goes live
13. [ ] CMF demo with language switching demonstrated

---

## BUDGET SUMMARY

| Item | Volume | Rate | Subtotal |
|------|--------|------|----------|
| FR Translation | 15,000 words | $0.25/word | $3,750 |
| ES Translation | 15,000 words | $0.25/word | $3,750 |
| Community Review (FR) | 3 reviewers × $200 | — | $600 |
| Community Review (ES) | 3 reviewers × $200 | — | $600 |
| Revisions | 10% of translation | — | $750 |
| **TOTAL** | — | — | **$9,450** |

**Recommended Budget:** $10,000 (includes buffer)

---

## CONTACT INFORMATION

**Translation Coordinator:** [To be assigned]  
**Community Liaisons:**
- FR Community: [To be assigned]
- ES Community: [To be assigned]

**Timeline:** 10 weeks from translator selection to multilingual launch

---

**END TRANSLATION FRAMEWORK**

**Status:** Framework complete, awaiting translator selection  
**Next Action:** Post job listings, select translators
