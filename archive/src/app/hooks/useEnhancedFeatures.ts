/**
 * FRONTEND INTEGRATION HOOKS
 * SEEN by CREOVA
 * 
 * React hooks for consuming enhanced features
 * Uses existing components, no UI modifications
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  EnhancedContextCard,
  UserReadingPreferences,
  ChapterConsumptionState,
  InstitutionalCollection,
  CreatorNote,
  CommunityReflection,
  OfflineCulturalPack,
  ChapterNarrationTrack,
  SeasonalEditorialFraming,
  UserFeaturePreferences,
  ConsumptionMode,
} from '../types/enhancedFeatures';

// Backend API base URL
const API_BASE = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-2bdc05e6`;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ============================================================================
// FEATURE A: ENHANCED CONTEXT CARDS
// ============================================================================

/**
 * Hook to fetch context card with progressive depth
 * 
 * @param cardId - Context card ID
 * @param level - Depth level (1, 2, or 3)
 * @returns Context card data and loading state
 */
export function useContextCard(cardId: string, level: 1 | 2 | 3 = 1) {
  const [card, setCard] = useState<EnhancedContextCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCard() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/context-card/${cardId}?level=${level}`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        
        if (!response.ok) throw new Error('Failed to fetch context card');
        
        const data = await response.json();
        setCard(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    if (cardId) fetchCard();
  }, [cardId, level]);

  return { card, loading, error };
}

/**
 * Hook to fetch all context cards for a story
 */
export function useStoryContextCards(storyId: string) {
  const [cards, setCards] = useState<EnhancedContextCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/context-cards/story/${storyId}`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        
        const data = await response.json();
        setCards(data);
      } catch (err) {
        console.error('Failed to fetch story context cards:', err);
      } finally {
        setLoading(false);
      }
    }

    if (storyId) fetchCards();
  }, [storyId]);

  return { cards, loading };
}

// ============================================================================
// FEATURE B: GUIDED READING/LISTENING MODES
// ============================================================================

/**
 * Hook to manage user reading preferences
 */
export function useReadingPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<UserReadingPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        setLoading(true);
        
        if (!userId) {
          // Anonymous user: use localStorage
          const stored = localStorage.getItem('seen-reading-preferences');
          if (stored) {
            setPreferences(JSON.parse(stored));
          } else {
            // Default preferences
            setPreferences({
              consumptionMode: 'read-and-listen',
              autoPlayNext: false,
              audioSpeed: 1.0,
              preferredLanguage: 'en',
              ambientAudioEnabled: true,
              narrationVolume: 100,
              ambientVolume: 40,
              lastUpdated: new Date().toISOString(),
            });
          }
        } else {
          // Authenticated user: fetch from server
          const response = await fetch(`${API_BASE}/reading-preferences/${userId}`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
          });
          const data = await response.json();
          setPreferences(data);
        }
      } catch (err) {
        console.error('Failed to fetch reading preferences:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, [userId]);

  const updatePreferences = useCallback(async (updates: Partial<UserReadingPreferences>) => {
    if (!preferences) return;

    const updated = { ...preferences, ...updates, lastUpdated: new Date().toISOString() };

    if (!userId) {
      // Anonymous: save to localStorage
      localStorage.setItem('seen-reading-preferences', JSON.stringify(updated));
      setPreferences(updated);
    } else {
      // Authenticated: save to server
      try {
        const response = await fetch(`${API_BASE}/reading-preferences/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(updates),
        });
        const data = await response.json();
        setPreferences(data);
      } catch (err) {
        console.error('Failed to update reading preferences:', err);
      }
    }
  }, [userId, preferences]);

  return { preferences, loading, updatePreferences };
}

/**
 * Hook to manage chapter consumption state (resume position)
 */
export function useChapterConsumption(userId: string | undefined, chapterId: string) {
  const [state, setState] = useState<ChapterConsumptionState | null>(null);

  useEffect(() => {
    async function fetchState() {
      if (!userId) {
        // Anonymous: use localStorage
        const key = `seen-chapter-${chapterId}`;
        const stored = localStorage.getItem(key);
        if (stored) setState(JSON.parse(stored));
        return;
      }

      // Authenticated: fetch from server
      try {
        const response = await fetch(`${API_BASE}/consumption-state/${userId}/${chapterId}`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        setState(data);
      } catch (err) {
        console.error('Failed to fetch consumption state:', err);
      }
    }

    if (chapterId) fetchState();
  }, [userId, chapterId]);

  const saveState = useCallback(async (updates: Partial<ChapterConsumptionState>) => {
    const newState: ChapterConsumptionState = {
      chapterId,
      mode: updates.mode || state?.mode || 'read-and-listen',
      textPosition: updates.textPosition,
      audioPosition: updates.audioPosition,
      completed: updates.completed || false,
      lastAccessed: new Date().toISOString(),
    };

    if (!userId) {
      // Anonymous: localStorage
      const key = `seen-chapter-${chapterId}`;
      localStorage.setItem(key, JSON.stringify(newState));
      setState(newState);
    } else {
      // Authenticated: server
      try {
        await fetch(`${API_BASE}/consumption-state/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(newState),
        });
        setState(newState);
      } catch (err) {
        console.error('Failed to save consumption state:', err);
      }
    }
  }, [userId, chapterId, state]);

  return { state, saveState };
}

// ============================================================================
// FEATURE C: INSTITUTIONAL COLLECTIONS
// ============================================================================

/**
 * Hook to fetch institutional collection
 */
export function useCollection(collectionId: string) {
  const [collection, setCollection] = useState<InstitutionalCollection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollection() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/collections/${collectionId}`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        setCollection(data);
      } catch (err) {
        console.error('Failed to fetch collection:', err);
      } finally {
        setLoading(false);
      }
    }

    if (collectionId) fetchCollection();
  }, [collectionId]);

  return { collection, loading };
}

/**
 * Hook to list all public collections
 */
export function usePublicCollections() {
  const [collections, setCollections] = useState<InstitutionalCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/collections/public`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        setCollections(data);
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  return { collections, loading };
}

// ============================================================================
// FEATURE D: CULTURAL IMPACT ANALYTICS
// ============================================================================

/**
 * Hook to record story engagement (analytics opt-in required)
 */
export function useStoryAnalytics(storyWorldId: string, optIn: boolean = false) {
  const recordStart = useCallback(async () => {
    if (!optIn) return; // Respect user opt-out
    
    try {
      await fetch(`${API_BASE}/analytics/story-start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ storyWorldId }),
      });
    } catch (err) {
      console.error('Failed to record story start:', err);
    }
  }, [storyWorldId, optIn]);

  const recordCompletion = useCallback(async () => {
    if (!optIn) return;
    
    try {
      await fetch(`${API_BASE}/analytics/story-completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ storyWorldId }),
      });
    } catch (err) {
      console.error('Failed to record story completion:', err);
    }
  }, [storyWorldId, optIn]);

  const recordAudioListening = useCallback(async (durationMinutes: number) => {
    if (!optIn) return;
    
    try {
      await fetch(`${API_BASE}/analytics/audio-listening`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ storyWorldId, durationMinutes }),
      });
    } catch (err) {
      console.error('Failed to record audio listening:', err);
    }
  }, [storyWorldId, optIn]);

  return { recordStart, recordCompletion, recordAudioListening };
}

// ============================================================================
// FEATURE E: CREATOR NOTES
// ============================================================================

/**
 * Hook to fetch creator note (shown after story completion)
 */
export function useCreatorNote(storyWorldId: string, showAfterCompletion: boolean = true) {
  const [note, setNote] = useState<CreatorNote | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      if (!showAfterCompletion) return; // Don't fetch unless story completed

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/creator-note/${storyWorldId}`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        setNote(data);
      } catch (err) {
        console.error('Failed to fetch creator note:', err);
      } finally {
        setLoading(false);
      }
    }

    if (storyWorldId && showAfterCompletion) fetchNote();
  }, [storyWorldId, showAfterCompletion]);

  return { note, loading };
}

// ============================================================================
// FEATURE F: COMMUNITY REFLECTIONS
// ============================================================================

/**
 * Hook to fetch approved reflections for a chapter
 */
export function useChapterReflections(chapterId: string, enabled: boolean = true) {
  const [reflections, setReflections] = useState<CommunityReflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReflections() {
      if (!enabled) {
        setReflections([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/reflections/chapter/${chapterId}`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        setReflections(data);
      } catch (err) {
        console.error('Failed to fetch reflections:', err);
      } finally {
        setLoading(false);
      }
    }

    if (chapterId) fetchReflections();
  }, [chapterId, enabled]);

  const submitReflection = useCallback(async (
    reflectionText: string,
    format: 'text' | 'audio' = 'text',
  ) => {
    try {
      const response = await fetch(`${API_BASE}/reflections/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          chapterId,
          format,
          reflectionText,
          // Anonymous submission (submitterHash generated server-side)
        }),
      });
      
      if (response.ok) {
        return { success: true, message: 'Reflection submitted for moderation' };
      } else {
        return { success: false, message: 'Failed to submit reflection' };
      }
    } catch (err) {
      console.error('Failed to submit reflection:', err);
      return { success: false, message: 'Error submitting reflection' };
    }
  }, [chapterId]);

  return { reflections, loading, submitReflection };
}

// ============================================================================
// FEATURE G: OFFLINE CULTURAL PACKS
// ============================================================================

/**
 * Hook to list available offline packs
 */
export function useOfflinePacks(isInstitutionUser: boolean = false) {
  const [packs, setPacks] = useState<OfflineCulturalPack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPacks() {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/offline-packs?institution=${isInstitutionUser}`,
          { headers: { Authorization: `Bearer ${API_KEY}` } },
        );
        const data = await response.json();
        setPacks(data);
      } catch (err) {
        console.error('Failed to fetch offline packs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPacks();
  }, [isInstitutionUser]);

  return { packs, loading };
}

// ============================================================================
// FEATURE H: MULTI-NARRATOR SUPPORT
// ============================================================================

/**
 * Hook to fetch narration tracks for a chapter
 */
export function useNarrationTracks(chapterId: string, language: 'en' | 'fr' | 'es') {
  const [tracks, setTracks] = useState<ChapterNarrationTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTracks() {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/narration-tracks/${chapterId}/${language}`,
          { headers: { Authorization: `Bearer ${API_KEY}` } },
        );
        const data = await response.json();
        setTracks(data);
      } catch (err) {
        console.error('Failed to fetch narration tracks:', err);
      } finally {
        setLoading(false);
      }
    }

    if (chapterId && language) fetchTracks();
  }, [chapterId, language]);

  const defaultTrack = tracks.find(t => t.isDefault) || tracks[0];

  return { tracks, defaultTrack, loading };
}

// ============================================================================
// FEATURE K: SEASONAL EDITORIAL FRAMING
// ============================================================================

/**
 * Hook to fetch seasonal editorial framing
 */
export function useSeasonalFraming(season: number, enabled: boolean = true) {
  const [framing, setFraming] = useState<SeasonalEditorialFraming | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    async function fetchFraming() {
      try {
        setLoading(true);
        
        // Check if user has dismissed this framing
        const dismissKey = `seen-framing-dismissed-season-${season}`;
        const wasDismissed = localStorage.getItem(dismissKey);
        
        if (wasDismissed) {
          setDismissed(true);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/seasonal-framing/${season}`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        setFraming(data);
      } catch (err) {
        console.error('Failed to fetch seasonal framing:', err);
      } finally {
        setLoading(false);
      }
    }

    if (season) fetchFraming();
  }, [season, enabled]);

  const dismiss = useCallback(() => {
    const dismissKey = `seen-framing-dismissed-season-${season}`;
    localStorage.setItem(dismissKey, 'true');
    setDismissed(true);
  }, [season]);

  return { framing, loading, dismissed, dismiss };
}

// ============================================================================
// USER FEATURE PREFERENCES (CONSOLIDATED)
// ============================================================================

/**
 * Hook to manage all user feature preferences
 */
export function useFeaturePreferences(userId?: string) {
  const [preferences, setPreferences] = useState<UserFeaturePreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        setLoading(true);

        if (!userId) {
          // Anonymous: localStorage
          const stored = localStorage.getItem('seen-feature-preferences');
          if (stored) {
            setPreferences(JSON.parse(stored));
          } else {
            // Defaults: all features OFF
            setPreferences({
              enhancedContextCardsEnabled: false,
              creatorNotesEnabled: false,
              communityReflectionsVisible: false,
              offlinePacksEnabled: false,
              multiNarratorSelectionEnabled: false,
              seasonalEditorialFramingEnabled: false,
              readingPreferences: {
                consumptionMode: 'read-and-listen',
                autoPlayNext: false,
                audioSpeed: 1.0,
                preferredLanguage: 'en',
                ambientAudioEnabled: true,
                narrationVolume: 100,
                ambientVolume: 40,
                lastUpdated: new Date().toISOString(),
              },
              analyticsOptIn: false,
              lastUpdated: new Date().toISOString(),
            });
          }
        } else {
          // Authenticated: server
          const response = await fetch(`${API_BASE}/feature-preferences/${userId}`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
          });
          const data = await response.json();
          setPreferences(data);
        }
      } catch (err) {
        console.error('Failed to fetch feature preferences:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, [userId]);

  const updatePreferences = useCallback(async (updates: Partial<UserFeaturePreferences>) => {
    if (!preferences) return;

    const updated = { ...preferences, ...updates, lastUpdated: new Date().toISOString() };

    if (!userId) {
      // Anonymous: localStorage
      localStorage.setItem('seen-feature-preferences', JSON.stringify(updated));
      setPreferences(updated);
    } else {
      // Authenticated: server
      try {
        const response = await fetch(`${API_BASE}/feature-preferences/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(updates),
        });
        const data = await response.json();
        setPreferences(data);
      } catch (err) {
        console.error('Failed to update feature preferences:', err);
      }
    }
  }, [userId, preferences]);

  return { preferences, loading, updatePreferences };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Context Cards
  useContextCard,
  useStoryContextCards,

  // Reading/Listening
  useReadingPreferences,
  useChapterConsumption,

  // Collections
  useCollection,
  usePublicCollections,

  // Analytics
  useStoryAnalytics,

  // Creator Notes
  useCreatorNote,

  // Reflections
  useChapterReflections,

  // Offline Packs
  useOfflinePacks,

  // Multi-Narrator
  useNarrationTracks,

  // Seasonal Framing
  useSeasonalFraming,

  // Preferences
  useFeaturePreferences,
};
