import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Language types
export type Language = 'en' | 'fr' | 'es';

// Intent types
export type UserIntent = 'explore' | 'create' | 'contribute';

// User role types
export type UserRole = 'viewer' | 'creator' | 'moderator' | 'admin';

// Accessibility preferences
export interface AccessibilityPreferences {
  captionsEnabled: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  /** Larger text across the app (scales the root font size). */
  largeText?: boolean;
}

// Personalization preferences (Experience SEEN your way)
export interface PersonalizationPreferences {
  // Stories: How narratives unfold
  immersiveNarratives: boolean; // false = brief, true = immersive/deep
  
  // Sound: Audio presence and texture
  richAudio: boolean; // false = minimal, true = rich/layered
  
  // Visuals: Motion and cinematic intensity
  dynamicMotion: boolean; // false = subtle, true = cinematic/full
}

// Audio state
export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrackId?: string;
  playbackPosition: number;
}

// Progress tracking
export interface ProgressSnapshot {
  storyWorldId: string;
  lastCompletedChapterId: string;
  lastAccessDate: string;
  playbackPosition: number;
  completed?: boolean; // Optional flag to mark if story is fully completed
}

// Choice tracking for branching stories
export interface BranchChoice {
  chapterId: string;
  choiceId: string;
  selectedOption: string;
  timestamp: string;
}

// Global story state
export interface StoryState {
  // User preferences
  language: Language;
  intent: UserIntent;
  userRole: UserRole;
  accessibilityPreferences: AccessibilityPreferences;
  personalizationPreferences: PersonalizationPreferences;
  /** Topics picked during onboarding (cultural themes). Optional. */
  interests?: string[];
  
  // Current navigation state
  currentStoryWorldId?: string;
  currentChapterId?: string;
  
  // Audio state
  audioState: AudioState;
  
  // Progress
  progressSnapshots: ProgressSnapshot[];
  
  // Branching choices
  branchChoices: BranchChoice[];
}

interface StoryStateContextType {
  state: StoryState;
  setLanguage: (lang: Language) => void;
  setIntent: (intent: UserIntent) => void;
  setUserRole: (role: UserRole) => void;
  setAccessibilityPreferences: (prefs: Partial<AccessibilityPreferences>) => void;
  setPersonalizationPreferences: (prefs: Partial<PersonalizationPreferences>) => void;
  setInterests: (interests: string[]) => void;
  enterStoryWorld: (storyWorldId: string) => void;
  navigateToChapter: (chapterId: string) => void;
  updateAudioState: (audioState: Partial<AudioState>) => void;
  saveProgress: () => void;
  getProgressForStory: (storyWorldId: string) => ProgressSnapshot | undefined;
  removeProgress: (storyWorldId: string) => void;
  exitStory: () => void;
  recordBranchChoice: (chapterId: string, choiceId: string, selectedOption: string) => void;
  getChoicesForStory: (storyWorldId: string) => BranchChoice[];
}

const defaultState: StoryState = {
  language: 'en',
  intent: 'explore',
  userRole: 'viewer',
  accessibilityPreferences: {
    captionsEnabled: false,
    highContrast: false,
    reducedMotion: false,
  },
  personalizationPreferences: {
    immersiveNarratives: false,
    richAudio: false,
    dynamicMotion: false,
  },
  audioState: {
    isPlaying: false,
    isMuted: false,
    volume: 0.7,
    playbackPosition: 0,
  },
  progressSnapshots: [],
  branchChoices: [],
};

const StoryStateContext = createContext<StoryStateContextType | undefined>(undefined);

const STORAGE_KEY = 'seenos_story_state';

export function StoryStateProvider({ children }: { children: ReactNode }) {
  // Load state from localStorage on mount
  const [state, setState] = useState<StoryState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultState, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load story state:', error);
    }
    return defaultState;
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save story state:', error);
    }
  }, [state]);

  const setLanguage = useCallback((lang: Language) => {
    setState(prev => ({ ...prev, language: lang }));
  }, []);

  const setIntent = useCallback((intent: UserIntent) => {
    setState(prev => ({ ...prev, intent }));
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    setState(prev => ({ ...prev, userRole: role }));
  }, []);

  const setAccessibilityPreferences = useCallback((prefs: Partial<AccessibilityPreferences>) => {
    setState(prev => ({
      ...prev,
      accessibilityPreferences: {
        ...prev.accessibilityPreferences,
        ...prefs,
      },
    }));
  }, []);

  const setPersonalizationPreferences = useCallback((prefs: Partial<PersonalizationPreferences>) => {
    setState(prev => ({
      ...prev,
      personalizationPreferences: {
        ...prev.personalizationPreferences,
        ...prefs,
      },
    }));
  }, []);

  const setInterests = useCallback((interests: string[]) => {
    setState(prev => ({ ...prev, interests }));
  }, []);

  const enterStoryWorld = useCallback((storyWorldId: string) => {
    setState(prev => ({
      ...prev,
      currentStoryWorldId: storyWorldId,
      currentChapterId: undefined,
    }));
  }, []);

  const navigateToChapter = useCallback((chapterId: string) => {
    setState(prev => ({
      ...prev,
      currentChapterId: chapterId,
    }));
  }, []);

  const updateAudioState = useCallback((audioState: Partial<AudioState>) => {
    setState(prev => ({
      ...prev,
      audioState: {
        ...prev.audioState,
        ...audioState,
      },
    }));
  }, []);

  const saveProgress = useCallback(() => {
    if (!state.currentStoryWorldId || !state.currentChapterId) return;

    const snapshot: ProgressSnapshot = {
      storyWorldId: state.currentStoryWorldId,
      lastCompletedChapterId: state.currentChapterId,
      lastAccessDate: new Date().toISOString(),
      playbackPosition: state.audioState.playbackPosition,
    };

    setState(prev => {
      const existingIndex = prev.progressSnapshots.findIndex(
        s => s.storyWorldId === snapshot.storyWorldId
      );

      const newSnapshots = [...prev.progressSnapshots];
      if (existingIndex >= 0) {
        newSnapshots[existingIndex] = snapshot;
      } else {
        newSnapshots.push(snapshot);
      }

      return {
        ...prev,
        progressSnapshots: newSnapshots,
      };
    });
  }, [state.currentStoryWorldId, state.currentChapterId, state.audioState.playbackPosition]);

  const getProgressForStory = useCallback((storyWorldId: string): ProgressSnapshot | undefined => {
    return state.progressSnapshots.find(s => s.storyWorldId === storyWorldId);
  }, [state.progressSnapshots]);

  const removeProgress = useCallback((storyWorldId: string) => {
    setState(prev => ({
      ...prev,
      progressSnapshots: prev.progressSnapshots.filter(s => s.storyWorldId !== storyWorldId),
    }));
  }, []);

  const exitStory = useCallback(() => {
    saveProgress();
    setState(prev => ({
      ...prev,
      currentStoryWorldId: undefined,
      currentChapterId: undefined,
      audioState: {
        ...prev.audioState,
        isPlaying: false,
        playbackPosition: 0,
      },
    }));
  }, [saveProgress]);

  const recordBranchChoice = useCallback((chapterId: string, choiceId: string, selectedOption: string) => {
    const choice: BranchChoice = {
      chapterId,
      choiceId,
      selectedOption,
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      branchChoices: [...prev.branchChoices, choice],
    }));
  }, []);

  const getChoicesForStory = useCallback((storyWorldId: string): BranchChoice[] => {
    return state.branchChoices.filter(c => c.chapterId.startsWith(storyWorldId));
  }, [state.branchChoices]);

  const value: StoryStateContextType = {
    state,
    setLanguage,
    setIntent,
    setUserRole,
    setAccessibilityPreferences,
    setPersonalizationPreferences,
    setInterests,
    enterStoryWorld,
    navigateToChapter,
    updateAudioState,
    saveProgress,
    getProgressForStory,
    removeProgress,
    exitStory,
    recordBranchChoice,
    getChoicesForStory,
  };

  return (
    <StoryStateContext.Provider value={value}>
      {children}
    </StoryStateContext.Provider>
  );
}

export function useStoryState() {
  const context = useContext(StoryStateContext);
  if (!context) {
    throw new Error('useStoryState must be used within StoryStateProvider');
  }
  return context;
}