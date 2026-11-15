/**
 * NAVIGATION CONTROLLER
 * SEEN by CREOVA
 * 
 * Central navigation state management for all tabs and screens
 * Preserves language, progress, and audio state across navigation
 * 
 * ZERO UI MODIFICATIONS - Wires existing navigation only
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export type TabName = 'for-you' | 'explore' | 'library' | 'profile';

export type ScreenName =
  | 'home'
  | 'story-world'
  | 'chapter'
  | 'film-player'
  | 'music-player'
  | 'collection-detail'
  | 'settings'
  | 'language-selector'
  | 'creator-dashboard'
  | 'moderation-queue'
  | 'admin-analytics';

export interface NavigationState {
  currentTab: TabName;
  currentScreen: ScreenName;
  history: ScreenName[];
  params: Record<string, any>;
}

export interface ChapterProgress {
  storyWorldId: string;
  chapterId: string;
  textPosition?: number;
  audioPosition?: number;
  completed: boolean;
  language: 'en' | 'fr' | 'es';
}

// ============================================================================
// NAVIGATION CONTEXT
// ============================================================================

interface NavigationContextValue {
  state: NavigationState;
  navigate: (screen: ScreenName, params?: Record<string, any>) => void;
  navigateToTab: (tab: TabName) => void;
  goBack: () => void;
  canGoBack: boolean;
  
  // Progress preservation
  saveProgress: (progress: ChapterProgress) => void;
  getProgress: (storyWorldId: string) => ChapterProgress | null;
  
  // Language state
  currentLanguage: 'en' | 'fr' | 'es';
  setLanguage: (lang: 'en' | 'fr' | 'es') => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

// ============================================================================
// NAVIGATION PROVIDER
// ============================================================================

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavigationState>({
    currentTab: 'for-you',
    currentScreen: 'home',
    history: [],
    params: {},
  });

  const [currentLanguage, setCurrentLanguageState] = useState<'en' | 'fr' | 'es'>(() => {
    // Load from localStorage
    const stored = localStorage.getItem('seen-language');
    return (stored as 'en' | 'fr' | 'es') || 'en';
  });

  const [progressMap, setProgressMap] = useState<Map<string, ChapterProgress>>(
    new Map(),
  );

  // ============================================================================
  // NAVIGATION FUNCTIONS
  // ============================================================================

  const navigate = useCallback(
    (screen: ScreenName, params: Record<string, any> = {}) => {
      // Log navigation for analytics (if opted in)
      console.log(`[Navigation] ${state.currentScreen} → ${screen}`, params);

      setState((prev) => ({
        ...prev,
        currentScreen: screen,
        history: [...prev.history, prev.currentScreen],
        params,
      }));
    },
    [],
  );

  const navigateToTab = useCallback((tab: TabName) => {
    setState((prev) => ({
      ...prev,
      currentTab: tab,
      currentScreen: 'home', // Reset to tab home
      history: [],
      params: {},
    }));

    console.log(`[Navigation] Tab switched to: ${tab}`);
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) {
        // At root, cannot go back
        console.warn('[Navigation] Cannot go back, already at root');
        return prev;
      }

      const previousScreen = prev.history[prev.history.length - 1];
      const newHistory = prev.history.slice(0, -1);

      return {
        ...prev,
        currentScreen: previousScreen,
        history: newHistory,
        params: {}, // Clear params on back navigation
      };
    });
  }, []);

  const canGoBack = state.history.length > 0;

  // ============================================================================
  // PROGRESS MANAGEMENT
  // ============================================================================

  const saveProgress = useCallback((progress: ChapterProgress) => {
    const key = `${progress.storyWorldId}:${progress.chapterId}`;
    
    setProgressMap((prev) => {
      const updated = new Map(prev);
      updated.set(key, progress);
      return updated;
    });

    // Also save to localStorage for persistence
    localStorage.setItem(`seen-progress-${key}`, JSON.stringify(progress));

    console.log(`[Progress] Saved for ${key}:`, progress);
  }, []);

  const getProgress = useCallback(
    (storyWorldId: string): ChapterProgress | null => {
      // Find most recent progress for this story
      for (const [key, progress] of progressMap.entries()) {
        if (progress.storyWorldId === storyWorldId) {
          return progress;
        }
      }

      // Check localStorage
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(`seen-progress-${storyWorldId}`),
      );
      if (keys.length > 0) {
        try {
          return JSON.parse(localStorage.getItem(keys[0])!);
        } catch {
          return null;
        }
      }

      return null;
    },
    [progressMap],
  );

  // ============================================================================
  // LANGUAGE MANAGEMENT
  // ============================================================================

  const setLanguage = useCallback((lang: 'en' | 'fr' | 'es') => {
    setCurrentLanguageState(lang);
    localStorage.setItem('seen-language', lang);

    // Update all visible text (handled by i18n system)
    console.log(`[Language] Switched to: ${lang.toUpperCase()}`);

    // No app reload, no progress reset
  }, []);

  // Load progress from localStorage on mount
  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith('seen-progress-'),
    );
    const map = new Map<string, ChapterProgress>();

    keys.forEach((key) => {
      try {
        const progress = JSON.parse(localStorage.getItem(key)!);
        const mapKey = `${progress.storyWorldId}:${progress.chapterId}`;
        map.set(mapKey, progress);
      } catch (err) {
        console.warn(`[Progress] Failed to load from ${key}:`, err);
      }
    });

    setProgressMap(map);
  }, []);

  const value: NavigationContextValue = {
    state,
    navigate,
    navigateToTab,
    goBack,
    canGoBack,
    saveProgress,
    getProgress,
    currentLanguage,
    setLanguage,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

// ============================================================================
// NAVIGATION GUARDS (ROLE-BASED ACCESS CONTROL)
// ============================================================================

export function useNavigationGuard(
  requiredRole?: 'viewer' | 'creator' | 'moderator' | 'admin',
) {
  const { navigate } = useNavigation();

  const checkAccess = useCallback(
    (userRole: string | undefined): boolean => {
      if (!requiredRole) return true; // No role requirement

      const roleHierarchy = ['viewer', 'creator', 'moderator', 'admin'];
      const userRoleIndex = userRole ? roleHierarchy.indexOf(userRole) : 0;
      const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

      const hasAccess = userRoleIndex >= requiredRoleIndex;

      if (!hasAccess) {
        console.warn(
          `[Access Denied] User role "${userRole}" cannot access "${requiredRole}" content`,
        );
        // Silent fail - no UI error
        return false;
      }

      return true;
    },
    [requiredRole],
  );

  return { checkAccess };
}

// ============================================================================
// NAVIGATION HELPERS
// ============================================================================

/**
 * Navigates to Story World, preserving progress
 */
export function useStoryWorldNavigation() {
  const { navigate, getProgress } = useNavigation();

  const openStoryWorld = useCallback(
    (storyWorldId: string) => {
      const progress = getProgress(storyWorldId);

      if (progress && !progress.completed) {
        // Resume from last chapter
        navigate('chapter', {
          storyWorldId,
          chapterId: progress.chapterId,
          audioPosition: progress.audioPosition,
          textPosition: progress.textPosition,
        });
      } else {
        // Start from beginning
        navigate('story-world', { storyWorldId });
      }
    },
    [navigate, getProgress],
  );

  return { openStoryWorld };
}

/**
 * Navigates to Chapter with progress tracking
 */
export function useChapterNavigation() {
  const { navigate, saveProgress, currentLanguage } = useNavigation();

  const openChapter = useCallback(
    (storyWorldId: string, chapterId: string, autoResume: boolean = false) => {
      const params: any = { storyWorldId, chapterId };

      if (autoResume) {
        // Load saved progress
        const key = `seen-progress-${storyWorldId}:${chapterId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const progress = JSON.parse(stored);
            params.audioPosition = progress.audioPosition;
            params.textPosition = progress.textPosition;
          } catch {}
        }
      }

      navigate('chapter', params);
    },
    [navigate, currentLanguage],
  );

  const nextChapter = useCallback(
    (storyWorldId: string, currentChapterId: string, totalChapters: number) => {
      const currentNum = parseInt(currentChapterId.split('-ch')[1]);
      if (currentNum < totalChapters) {
        const nextChapterId = currentChapterId.replace(
          `-ch${currentNum}`,
          `-ch${currentNum + 1}`,
        );
        openChapter(storyWorldId, nextChapterId);
      } else {
        // Last chapter - return to story world
        navigate('story-world', { storyWorldId, completed: true });
      }
    },
    [openChapter, navigate],
  );

  const previousChapter = useCallback(
    (storyWorldId: string, currentChapterId: string) => {
      const currentNum = parseInt(currentChapterId.split('-ch')[1]);
      if (currentNum > 1) {
        const prevChapterId = currentChapterId.replace(
          `-ch${currentNum}`,
          `-ch${currentNum - 1}`,
        );
        openChapter(storyWorldId, prevChapterId);
      }
    },
    [openChapter],
  );

  return { openChapter, nextChapter, previousChapter };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  NavigationProvider,
  useNavigation,
  useNavigationGuard,
  useStoryWorldNavigation,
  useChapterNavigation,
};
