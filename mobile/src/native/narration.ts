import type { Language } from './data';

/**
 * Recorded narration bundled with the app, by chapter and language. Pilot: chapter 1 of "Voices of Migration",
 * made with an AI voice (ElevenLabs, voice "Ash") and labelled "AI narration" in the reader. A chapter or
 * language without a recording is read by the phone's own voice instead.
 */
const CLIPS: Record<string, Partial<Record<Language, number>>> = {
  'voices-ch1': {
    en: require('../../assets/narration/voices-ch1.en.mp3'),
    fr: require('../../assets/narration/voices-ch1.fr.mp3'),
  },
};

export const narrationFor = (chapterId: string, lang: Language): number | undefined => CLIPS[chapterId]?.[lang];
