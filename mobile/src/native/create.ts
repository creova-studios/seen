import {
  deleteDraft,
  getOrCreateDraft,
  listDraftsForCreator,
  listStoriesForCreator,
  publishStory,
  updateDraft,
  type CreatorDraft,
} from '@seen/data/userStoriesService';
import { api } from '@seen/services';
import type { IntakeStoryRecord } from '@seen/services/contracts';
import type { Language, StoryWorld } from './data';

/** What the person types into the four steps. One flat shape, mapped onto the shared draft and publish calls. */
export interface CreateForm {
  title: string;
  description: string;
  themes: string[];
  languages: Language[];
  audience: string;
  chapters: { title: string; text: string }[];
  warnings: string[];
  visibility: 'public' | 'private';
  rights: boolean;
  guidelines: boolean;
}

/** Same lists the website's wizard offers, so a story reads the same wherever it was made. */
export const THEMES = ['Indigenous Knowledge', 'Migration & Diaspora', 'Language & Identity', 'Urban Culture', 'Heritage & Memory', 'Music & Sound', 'Visual Arts', 'Documentary & Film', 'Community Stories', 'Environmental'];
export const AUDIENCES = ['Youth', 'Educators', 'Families', 'Community members', 'Researchers', 'General public'];
export const WARNINGS = ['Violence', 'Racism or discrimination', 'Grief or loss', 'Strong language', 'Difficult historical events'];

export const blankForm = (lang: Language): CreateForm => ({
  title: '',
  description: '',
  themes: [],
  languages: [lang],
  audience: '',
  chapters: [{ title: '', text: '' }],
  warnings: [],
  visibility: 'public',
  rights: false,
  guidelines: false,
});

export const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter(x => x !== item) : [...list, item]);

const filled = (form: CreateForm) => form.chapters.filter(ch => ch.title.trim() && ch.text.trim());

/** First thing missing before publishing, or null. */
export function publishBlocker(form: CreateForm): 'needTitle' | 'needConsent' | null {
  if (!form.title.trim() || filled(form).length === 0) return 'needTitle';
  if (!form.rights || !form.guidelines) return 'needConsent';
  return null;
}

const minutesFor = (text: string) => Math.max(1, Math.round(text.trim().split(/\s+/).length / 150));

/** Saves the form as the shared draft (the website reads the same record). */
export function saveDraft(userId: string, draftId: string, form: CreateForm): CreatorDraft {
  getOrCreateDraft(userId, draftId);
  return updateDraft(draftId, {
    intent: { title: form.title, description: form.description, culturalThemes: form.themes, languages: form.languages, intendedAudience: form.audience },
    structure: { structureType: 'linear', estimatedChapters: form.chapters.length },
    media: {
      chapters: form.chapters.map((ch, i) => ({ id: String(i + 1), title: ch.title, description: '', text: ch.text, estimatedDuration: minutesFor(ch.text), completeness: 0 })),
    },
    context: { contextCards: [], hasCaptions: false, hasTranscripts: false, contentWarnings: form.warnings, languageNotes: {}, accessibilityConfirmed: false },
  });
}

/** Reads a saved draft back into the form. */
export function formFromDraft(draft: CreatorDraft, lang: Language): CreateForm {
  const base = blankForm(lang);
  const chapters = draft.media?.chapters?.map(ch => ({ title: ch.title, text: ch.text }));
  return {
    ...base,
    title: draft.intent?.title ?? '',
    description: draft.intent?.description ?? '',
    themes: draft.intent?.culturalThemes ?? [],
    languages: draft.intent?.languages?.length ? draft.intent.languages : base.languages,
    audience: draft.intent?.intendedAudience ?? '',
    chapters: chapters?.length ? chapters : base.chapters,
    warnings: draft.context?.contentWarnings ?? [],
  };
}

/** Publishes through the shared service and removes the draft. Throws if the write fails, so nothing claims success. */
export function publish(userId: string, name: string, draftId: string, form: CreateForm): StoryWorld {
  if (publishBlocker(form)) throw new Error('not ready to publish');
  const chapters = filled(form).map((ch, i) => ({ id: String(i + 1), title: ch.title.trim(), description: '', text: ch.text.trim(), estimatedDuration: minutesFor(ch.text), completeness: 100 }));
  const story = publishStory(
    userId,
    name,
    { title: form.title.trim(), description: form.description.trim(), culturalThemes: form.themes, languages: form.languages.length ? form.languages : ['en'], intendedAudience: form.audience },
    { structureType: 'linear', estimatedChapters: chapters.length },
    { chapters },
    { contextCards: [], hasCaptions: false, hasTranscripts: false, contentWarnings: form.warnings, languageNotes: {}, accessibilityConfirmed: true },
    { visibility: form.visibility, rightsConfirmed: form.rights, guidelinesAccepted: form.guidelines },
  );
  deleteDraft(draftId);
  bumpCatalog();
  return story;
}

/**
 * Submits a mobile creator's story into the Phase 3/5 editorial review queue (`api.intake`):
 * records the draft, attaches the copyright/rights attestation, transitions to `submitted`,
 * removes the local wizard draft, and notifies catalogue listeners.
 */
export async function submitStoryForReview(
  userId: string,
  name: string,
  draftId: string,
  form: CreateForm,
): Promise<IntakeStoryRecord> {
  if (publishBlocker(form)) throw new Error('not ready to submit for review');
  const rawDb = localStorage.getItem('seenos_users_db');
  const db = rawDb ? (JSON.parse(rawDb) as Record<string, unknown>) : {};
  if (!db[userId]) {
    db[userId] = { id: userId, email: `${userId}@seen.local`, name, role: 'creator' };
    localStorage.setItem('seenos_users_db', JSON.stringify(db));
  }
  if (!localStorage.getItem('seenos_auth_session')) {
    localStorage.setItem('seenos_auth_session', JSON.stringify({ userId, accessToken: `tok_mobile_${userId}` }));
  }

  const chapters = filled(form).map((ch, idx) => ({
    position: idx + 1,
    title: ch.title.trim(),
    body: ch.text.trim(),
  }));

  const saved = await api.intake.saveDraft({
    title: form.title.trim(),
    summary: form.description.trim() || form.title.trim(),
    languages: form.languages.length ? form.languages : ['en'],
    themes: form.themes,
    intendedAudience: form.audience || 'General public',
    contentWarnings: form.warnings,
    chapters,
  });

  await api.intake.recordRightsGrant({
    storyId: saved.id,
    confirmsOriginalWork: form.rights,
    grantsNonExclusiveLicense: form.rights,
    confirmsThirdPartyConsents: form.guidelines,
    allowTranslation: true,
    allowAudioNarration: false,
    attributionName: name,
  });

  const submitted = await api.intake.submitForReview(saved.id);
  deleteDraft(draftId);
  bumpCatalog();
  return submitted;
}

export const myStories = (userId: string) => listStoriesForCreator(userId);
export const myDrafts = (userId: string) => listDraftsForCreator(userId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
export const removeDraft = (id: string) => deleteDraft(id);
export const newDraftId = () => `draft_${crypto.randomUUID()}`;

// A tiny change signal so For You, Explore and the Library refresh after a story is published.
let version = 0;
const listeners = new Set<() => void>();
export const bumpCatalog = () => {
  version += 1;
  listeners.forEach(l => l());
};
export const subscribeCatalog = (l: () => void) => (listeners.add(l), () => void listeners.delete(l));
export const catalogVersion = () => version;
