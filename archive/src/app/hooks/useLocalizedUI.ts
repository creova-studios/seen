/**
 * LOCALIZATION HOOK
 * Provides translated UI strings for all supported languages
 */

import { getSpanishTranslation } from '../data/spanishTranslations';
import type { Language } from '../data/storyDatabase';

// English translations (source of truth)
const enTranslations: Record<string, string> = {
  // Navigation
  'Search Stories': 'Search Stories',
  'Search by title, author, or theme...': 'Search by title, author, or theme...',
  'No stories found': 'No stories found',
  'Start typing to search...': 'Start typing to search...',
  'result': 'result',
  'results': 'results',

  // Screens
  'For You': 'For You',
  'Explore': 'Explore',
  'Library': 'Library',
  'Profile': 'Profile',

  // Common UI
  'Close': 'Close',
  'Back': 'Back',
  'Next': 'Next',
  'Previous': 'Previous',
  'Loading...': 'Loading...',
  'Error': 'Error',
  'Save': 'Save',
  'Cancel': 'Cancel',
};

// French translations
const frTranslations: Record<string, string> = {
  'Search Stories': 'Rechercher des Histoires',
  'Search by title, author, or theme...': 'Rechercher par titre, auteur ou thème...',
  'No stories found': 'Aucune histoire trouvée',
  'Start typing to search...': 'Commencez à taper pour rechercher...',
  'result': 'résultat',
  'results': 'résultats',

  'For You': 'Pour vous',
  'Explore': 'Explorer',
  'Library': 'Ma Bibliothèque',
  'Profile': 'Profil',

  'Close': 'Fermer',
  'Back': 'Retour',
  'Next': 'Suivant',
  'Previous': 'Précédent',
  'Loading...': 'Chargement...',
  'Error': 'Erreur',
  'Save': 'Enregistrer',
  'Cancel': 'Annuler',
};

/**
 * Translate a UI string for the given language
 */
export function translateUI(key: string, language: Language): string {
  switch (language) {
    case 'es':
      return getSpanishTranslation(key);
    case 'fr':
      return frTranslations[key] || enTranslations[key] || key;
    case 'en':
    default:
      return enTranslations[key] || key;
  }
}

/**
 * Hook for using localized UI strings in components
 */
export function useLocalizedUI(language: Language) {
  return (key: string): string => {
    return translateUI(key, language);
  };
}

/**
 * Common pluralization helper
 */
export function pluralize(count: number, singular: string, plural: string, language: Language): string {
  const word = count === 1 ? singular : plural;
  return translateUI(word, language);
}
