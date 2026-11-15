import { lazy, Suspense, useState, useEffect, useCallback, useMemo, useRef, type CSSProperties } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { Toaster } from "sonner";
import { StoryStateProvider, useStoryState } from "./contexts/StoryStateContext";
import type { UserIntent, UserRole } from "./contexts/StoryStateContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { OnboardingSystem } from "./components/OnboardingSystem";
import { ForYouScreen } from "./components/ForYouScreen";
import { ExploreScreen, type ExploreTab } from "./components/ExploreScreen";
import { LibraryScreen } from "./components/LibraryScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { FeaturedStoryPreview } from "./components/FeaturedStoryPreview";
import { StoryChapterScreen } from "./components/StoryChapterScreen";
import { ChapterIndexScreen } from "./components/ChapterIndexScreen";
import { AboutScreen } from "./components/AboutScreen";
import { ProfilePreferencesScreen } from "./components/ProfilePreferencesScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { CreatorProfileScreen } from "./screens/CreatorProfileScreen";
import { CollectionDetailScreen } from "./screens/CollectionDetailScreen";
import { CollectionsScreen } from "./screens/CollectionsScreen";
import { FundingScreen } from "./screens/FundingScreen";
import { OpportunityDetailScreen } from "./screens/OpportunityDetailScreen";
import { NotificationsScreen } from "./screens/NotificationsScreen";
import { AccountPrivacyScreen } from "./screens/AccountPrivacyScreen";
import { NotesScreen } from "./screens/NotesScreen";
import { FundingReadinessScreen } from "./screens/FundingReadinessScreen";
import { CreatorStoriesScreen } from "./screens/CreatorStoriesScreen";
import { EditProfileScreen } from "./screens/EditProfileScreen";
import { ChangePasswordScreen } from "./screens/ChangePasswordScreen";
import { LegalScreen } from "./screens/LegalScreen";
import { ResetPasswordScreen } from "./screens/ResetPasswordScreen";
import { ScreenFrame } from "./screens/ScreenFrame";
import { SkeletonList, StateTemplate } from "./components/seen/primitives";
import { AppNavProvider, type AppNav, type RouteParams } from "./navigation/AppNav";
import { rememberReturn, takeReturn } from "./navigation/safeReturn";
import { type AppScreen, NOT_DEEP_LINKABLE, PUBLIC_SCREENS, TAB_SCREENS, canAccess, canGuestAccess, fromHash, isScreen, toHash } from "./navigation/routes";
import { api } from "./services";
import { NavigationBar } from "./components/NavigationBar";
import { BottomNav, type NavItemId, type TabId } from "./components/seen/BottomNav";
import { useMediaQuery } from "./native/useMediaQuery";
import { GuestLayer } from "./guest/GuestLayer";
import { enterGuestMode, hasChosenGuest, openGuestPrompt, type GuestReason } from "./guest/guestStore";
import { hasSeenCreatorIntro } from "./guest/creatorIntro";
import { CreatorIntroScreen } from "./screens/CreatorIntroScreen";
import { useT } from "./i18n/useT";
import { initializeDemoData } from "./data/demoData";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PlaybackProvider } from "./playback/PlaybackProvider";
import { MediaSessionBridge } from "./playback/MediaSessionBridge";
import { MediaPlayerBar } from "./components/seen/MediaPlayerBar";
import { TooltipProvider } from "./components/seen/overlays";
import { installGlobalHandlers, track } from "./observability";
// Role-specific / heavy screens load on demand (recharts etc. stay out of the main bundle).
const CreatorPublishFlow = lazy(() => import("./components/CreatorPublishFlow").then(m => ({ default: m.CreatorPublishFlow })));
const ModerationGovernanceSystem = lazy(() => import("./components/ModerationGovernanceSystem").then(m => ({ default: m.ModerationGovernanceSystem })));
const CreatorMonetizationScreen = lazy(() => import("./components/CreatorMonetizationScreen").then(m => ({ default: m.CreatorMonetizationScreen })));
const CreatorEarningsScreen = lazy(() => import("./components/CreatorEarningsScreen").then(m => ({ default: m.CreatorEarningsScreen })));
const SubscriptionManagementScreen = lazy(() => import("./components/SubscriptionManagementScreen").then(m => ({ default: m.SubscriptionManagementScreen })));
const AdminDashboardScreen = lazy(() => import("./components/AdminDashboardScreen").then(m => ({ default: m.AdminDashboardScreen })));

// Initialize demo data for testing (only runs once)
initializeDemoData();
installGlobalHandlers();

type HistoryEntry = { screen: AppScreen; params: RouteParams };

function AppContent() {
  const { state, setLanguage, setIntent, setUserRole, enterStoryWorld, navigateToChapter } = useStoryState();
  const { state: authState } = useAuth();
  const t = useT();

  // Sync user role from auth state when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.role) {
      setUserRole(authState.user.role);
      if (authState.user.language) setLanguage(authState.user.language);
      if (authState.user.intent) setIntent(authState.user.intent);
    }
  }, [authState.isAuthenticated, authState.user?.role, authState.user?.language, authState.user?.intent, setUserRole, setLanguage, setIntent]);

  const hasCompletedOnboarding = localStorage.getItem("onboarding_completed") === "true";
  const hasEnteredSEEN = localStorage.getItem("hasEnteredSEEN") === "true";
  const savedStep = localStorage.getItem("onboarding_step");

  const [route, setRoute] = useState<HistoryEntry>({ screen: "onboarding", params: {} });
  const [isFirstVisit, setIsFirstVisit] = useState(!hasCompletedOnboarding);
  const currentScreen = route.screen;

  // ------------------------------------------------------------ navigation
  // Every navigation is mirrored into browser history (hash URLs), so the
  // browser/Android back button, refresh and shared links all work.
  const applyRoute = useCallback(
    (entry: HistoryEntry) => {
      if (entry.screen === "story-preview" && entry.params.id) enterStoryWorld(entry.params.id);
      setRoute(entry);
      window.scrollTo?.({ top: 0, behavior: "instant" });
      // On wide screens the detail pane scrolls on its own: a new screen starts at its top.
      document.querySelector<HTMLElement>('[data-pane="detail"] [data-scroll-root]')?.scrollTo?.({ top: 0, behavior: "instant" });
    },
    [enterStoryWorld],
  );

  const go = useCallback(
    (screen: string, params: RouteParams = {}, opts: { replace?: boolean } = {}) => {
      if (!isScreen(screen)) return;
      const entry: HistoryEntry = { screen, params };
      const url = toHash(screen, params);
      if (opts.replace) window.history.replaceState(entry, "", url);
      else window.history.pushState(entry, "", url);
      applyRoute(entry);
    },
    [applyRoute],
  );

  const depth = useRef(0); // entries this session pushed onto browser history
  const back = useCallback(() => {
    // If we pushed history in this session, defer to the browser; otherwise
    // (deep link landed here) fall back to the home tab.
    if (window.history.state && window.history.length > 1 && depth.current > 0) window.history.back();
    else go("for-you", {}, { replace: true });
  }, [go]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      depth.current = Math.max(0, depth.current - 1);
      const entry = (e.state as HistoryEntry | null) ?? fromHash(window.location.hash);
      if (entry && isScreen(entry.screen) && entry.screen !== "onboarding") applyRoute(entry);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [applyRoute]);

  const trackedGo = useCallback(
    (screen: string, params?: RouteParams, opts: { replace?: boolean } = {}) => {
      if (!opts.replace) depth.current += 1;
      go(screen, params, opts);
    },
    [go],
  );

  // Guest-first: remember the deep link a signed-out visitor arrived on, so sign-in returns them there.
  useEffect(() => {
    const linked = fromHash(window.location.hash);
    if (linked && !NOT_DEEP_LINKABLE.includes(linked.screen) && !PUBLIC_SCREENS.includes(linked.screen)) rememberReturn(window.location.hash);
  }, []);

  // A reset link opens its screen even when signed out.
  useEffect(() => {
    const linked = fromHash(window.location.hash);
    if (linked && PUBLIC_SCREENS.includes(linked.screen)) go(linked.screen, linked.params, { replace: true });
  }, [go]);

  // Leave onboarding once auth has resolved for a returning user; honour a deep link if present.
  useEffect(() => {
    if (!authState.isLoading && authState.isAuthenticated && hasCompletedOnboarding && currentScreen === "onboarding") {
      const stored = takeReturn();
      const linked = fromHash(stored ?? window.location.hash);
      if (linked && !NOT_DEEP_LINKABLE.includes(linked.screen)) go(linked.screen, linked.params, { replace: true });
      else go("for-you", {}, { replace: true });
    }
  }, [authState.isLoading, authState.isAuthenticated, hasCompletedOnboarding, currentScreen, go]);

  // "Explore without an account": leave onboarding as a guest, honouring a deep link they arrived on (D2).
  const leaveOnboardingAsGuest = useCallback(() => {
    const linked = fromHash(takeReturn() ?? window.location.hash);
    if (linked && !NOT_DEEP_LINKABLE.includes(linked.screen)) go(linked.screen, linked.params, { replace: true });
    else go("for-you", {}, { replace: true });
  }, [go]);

  const handleGuest = useCallback(() => {
    enterGuestMode();
    track("guest_entered");
    leaveOnboardingAsGuest();
  }, [leaveOnboardingAsGuest]);

  // A returning guest skips onboarding too.
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated && hasChosenGuest() && currentScreen === "onboarding") leaveOnboardingAsGuest();
  }, [authState.isLoading, authState.isAuthenticated, currentScreen, leaveOnboardingAsGuest]);

  // Accessibility preferences apply app-wide via root data attributes (see seen-tokens.css).
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.contrast = state.accessibilityPreferences.highContrast ? "high" : "normal";
    root.dataset.motion = state.accessibilityPreferences.reducedMotion ? "reduced" : "full";
    root.dataset.text = state.accessibilityPreferences.largeText ? "large" : "normal";
  }, [state.accessibilityPreferences.highContrast, state.accessibilityPreferences.reducedMotion, state.accessibilityPreferences.largeText]);

  // --------------------------------------------------------- unread badge
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const refresh = () => api.notifications.unreadCount().then(setUnreadCount, () => undefined);
    refresh();
    const onStore = (e: Event) => (e as CustomEvent).detail === "notifications" && refresh();
    window.addEventListener("seen:store", onStore);
    return () => window.removeEventListener("seen:store", onStore);
  }, []);

  const openStory = useCallback(
    (id: string) => {
      track("story_opened", { storyId: id });
      trackedGo("story-preview", { id });
    },
    [trackedGo],
  );

  const nav: AppNav = useMemo(
    () => ({
      go: trackedGo,
      back,
      openStory,
      openSearch: () => trackedGo("search"),
      openNotifications: () => trackedGo("notifications"),
      openProfile: () => trackedGo("profile"),
      unreadCount,
    }),
    [trackedGo, back, openStory, unreadCount],
  );

  // ---------------------------------------------------------- handlers
  const handleOnboardingComplete = (data: { role: UserRole; intent: UserIntent }) => {
    setUserRole(data.role);
    setIntent(data.intent);
    setIsFirstVisit(false);
    track("onboarding_completed", { role: data.role, intent: data.intent });
    const back = takeReturn();
    const linked = back ? fromHash(back) : null;
    if (linked && !NOT_DEEP_LINKABLE.includes(linked.screen)) go(linked.screen, linked.params, { replace: true });
    else go("for-you", {}, { replace: true });
  };

  const handleNavigate = (screen: string) => {
    if (["for-you", "explore", "library", "profile"].includes(screen)) trackedGo(screen);
  };

  const role = state.userRole;
  const signedOut = !authState.isAuthenticated;

  // Create is an action: guests get the sheet, newcomers the one-time creator intro, everyone else the publish flow.
  const handleCreate = () => {
    if (signedOut) return openGuestPrompt({ reason: "create" });
    const needsIntro = role !== "creator" && role !== "admin" && !hasSeenCreatorIntro(authState.user?.id);
    trackedGo(needsIntro ? "creator-intro" : "creator-publish");
  };

  const handleNavItem = (id: NavItemId) => {
    if (id === "create") return handleCreate();
    if (signedOut && (id === "library" || id === "profile")) return openGuestPrompt({ reason: id });
    handleNavigate(id);
  };

  // A guest who opens a gated screen (typed URL, shared link, a button that leads there) gets the sign-in sheet,
  // never a blank or private screen. Signing in unblocks the same screen.
  const guestBlocked = signedOut && !canGuestAccess(currentScreen);
  const shown = guestBlocked ? null : currentScreen;
  const gateReason: GuestReason = currentScreen === "library" ? "library" : currentScreen === "profile" ? "profile" : currentScreen === "creator-publish" || currentScreen === "creator-intro" ? "create" : "page";
  useEffect(() => {
    if (guestBlocked) openGuestPrompt({ reason: gateReason });
  }, [guestBlocked, gateReason]);

  const allowed = canAccess(currentScreen, role);
  const isTab = TAB_SCREENS.includes(currentScreen) && allowed;
  useEffect(() => {
    if (!allowed) track("access_denied", { screen: currentScreen, role });
  }, [allowed, currentScreen, role]);

  const wide = useMediaQuery("(min-width: 840px)");
  const [lastTab, setLastTab] = useState<TabId>("for-you");
  useEffect(() => {
    if (shown && TAB_SCREENS.includes(shown) && allowed) setLastTab(shown as TabId);
  }, [shown, allowed]);
  // Wide screens (unfolded foldables, tablets): the tab stays on the left and what you open appears on the right.
  const twoPane = wide && currentScreen !== "onboarding";
  const shownIsTab = !!shown && TAB_SCREENS.includes(shown);
  const listScreen: TabId = shownIsTab ? (shown as TabId) : lastTab;
  const detailScreen: AppScreen | null = shownIsTab ? null : shown;
  const detailOpen = twoPane && !shownIsTab;

  const openChapter = (storyId: string, chapterId: string) => {
    enterStoryWorld(storyId);
    navigateToChapter(chapterId);
    trackedGo("story-chapter");
  };

  type Pane = "single" | "list" | "detail";
  // The same screen list serves the one-pane phone layout and both panes of the wide layout. The fragment's children
  // are handed to AnimatePresence as a flat list, so each screen keeps its key and exit animation.
  const renderScreens = (shown: AppScreen | null, pane: Pane) => (
    <>
          {pane !== "list" && shown === "onboarding" && (
            <OnboardingSystem
              key="onboarding"
              onComplete={handleOnboardingComplete}
              initialStep={savedStep ? parseInt(savedStep) : 0}
              hasEnteredSEEN={hasEnteredSEEN}
              onGuest={handleGuest}
            />
          )}

          {pane !== "list" && guestBlocked && (
            <ScreenFrame key="guest-gate" title={t("guest.page.title")} onBack={back}>
              <StateTemplate
                kind="denied"
                title={t("guest.page.title")}
                message={t("guest.page.body")}
                actionLabel={t("guest.cta.create")}
                onAction={() => openGuestPrompt({ reason: gateReason })}
              />
            </ScreenFrame>
          )}

          {pane !== "list" && !guestBlocked && !allowed && (
            <ScreenFrame key="denied" title="Restricted" onBack={back}>
              <StateTemplate
                kind="denied"
                title="You don't have access to this area"
                message="This section is for a different account role. If you think you should have access, request it from Settings."
                actionLabel="Go back"
                onAction={back}
              />
            </ScreenFrame>
          )}

          {allowed && shown === "story-preview" && state.currentStoryWorldId && (
            <FeaturedStoryPreview key="story-preview" onClose={back} onEnterStory={() => trackedGo("story-chapter")} />
          )}

          {allowed && shown === "story-chapter" && state.currentStoryWorldId && (
            <StoryChapterScreen
              key="story-chapter"
              onClose={() => go("for-you")}
              onShowIndex={() => trackedGo("chapter-index")}
              storyWorldId={state.currentStoryWorldId}
            />
          )}

          {allowed && shown === "chapter-index" && state.currentStoryWorldId && (
            <ChapterIndexScreen
              key="chapter-index"
              onClose={back}
              onSelectChapter={id => {
                // The reader re-mounts on return and opens state.currentChapterId.
                navigateToChapter(id);
                back();
              }}
              storyWorldId={state.currentStoryWorldId}
            />
          )}

          {shown === "for-you" && (
            <ForYouScreen
              key="for-you"
              onStoryClick={openStory}
              onNavigate={handleNavigate}
              onSearch={nav.openSearch}
              userIntent={state.intent}
              language={state.language}
              isFirstVisit={isFirstVisit}
            />
          )}

          {shown === "explore" && (
            <ExploreScreen
              key="explore"
              onStoryClick={openStory}
              onNavigate={handleNavigate}
              onSearch={nav.openSearch}
              language={state.language}
              initialTab={(route.params.tab as ExploreTab) ?? "stories"}
            />
          )}

          {shown === "library" && (
            <LibraryScreen key="library" onStoryClick={openStory} onNavigate={handleNavigate} onSearch={nav.openSearch} />
          )}

          {shown === "profile" && (
            <ProfileScreen
              key="profile"
              onNavigate={handleNavigate}
              onSearch={nav.openSearch}
              onOpenSettings={() => trackedGo("settings")}
              onOpenAbout={() => trackedGo("about")}
              onOpenCreatorDashboard={() => trackedGo("creator-publish")}
              onOpenModeration={() => trackedGo("moderation-governance")}
              onOpenInstitutional={() => trackedGo("collections")}
              onOpenMonetization={() => trackedGo("creator-monetization")}
              onOpenEarnings={() => trackedGo("creator-earnings")}
              onOpenSubscriptions={() => trackedGo("subscription-management")}
              onOpenAdmin={() => trackedGo("admin-dashboard")}
              onOpenStory={openStory}
              userIntent={state.intent}
              language={state.language}
            />
          )}

          {shown === "search" && <SearchScreen key="search" onClose={back} onSelectStory={id => go("story-preview", { id }, { replace: true })} />}
          {shown === "notifications" && <NotificationsScreen key="notifications" />}
          {shown === "creator-profile" && route.params.id && <CreatorProfileScreen key={`creator-${route.params.id}`} creatorId={route.params.id} />}
          {shown === "collections" && <CollectionsScreen key="collections" />}
          {shown === "collection-detail" && route.params.id && (
            <CollectionDetailScreen key={`collection-${route.params.id}`} collectionId={route.params.id} />
          )}
          {shown === "funding" && <FundingScreen key="funding" />}
          {shown === "opportunity" && route.params.id && <OpportunityDetailScreen key={`opp-${route.params.id}`} opportunityId={route.params.id} />}

          {allowed && shown === "creator-monetization" && <CreatorMonetizationScreen key="creator-monetization" onClose={back} />}
          {shown === "funding-readiness" && <FundingReadinessScreen key="funding-readiness" />}
          {allowed && shown === "creator-stories" && <CreatorStoriesScreen key="creator-stories" />}
          {allowed && shown === "creator-earnings" && <CreatorEarningsScreen key="creator-earnings" onClose={back} />}
          {shown === "subscription-management" && <SubscriptionManagementScreen key="subscription-management" onClose={back} />}
          {allowed && shown === "admin-dashboard" && <AdminDashboardScreen key="admin-dashboard" onClose={back} />}
          {shown === "about" && <AboutScreen key="about" onClose={back} />}
          {shown === "settings" && <ProfilePreferencesScreen key="settings" onBack={back} />}
          {shown === "account" && <AccountPrivacyScreen key="account" />}
          {allowed && shown === "notes" && <NotesScreen key="notes" />}
          {shown === "edit-profile" && <EditProfileScreen key="edit-profile" />}
          {shown === "change-password" && <ChangePasswordScreen key="change-password" />}
          {shown === "legal" && <LegalScreen key="legal" />}
          {shown === "reset-password" && route.params.id && <ResetPasswordScreen key="reset-password" token={route.params.id} />}

          {shown === "creator-intro" && <CreatorIntroScreen key="creator-intro" />}
          {shown === "creator-publish" && (
            <CreatorPublishFlow
              key="creator-publish"
              onClose={back}
              onViewStory={openStory}
              onGoToLibrary={() => trackedGo("library")}
              onViewEarnings={() => trackedGo("creator-earnings")}
            />
          )}

          {allowed && shown === "moderation-governance" && <ModerationGovernanceSystem key="moderation-governance" onBack={back} />}
    </>
  ).props.children;

  return (
    <AppNavProvider value={nav}>
      <MotionConfig reducedMotion={state.accessibilityPreferences.reducedMotion ? "always" : "user"}>
      <div className="size-full bg-black">
        {/* Bottom, above the nav + mini player, so toasts never cover header actions (Close, Back). */}
        <GuestLayer />
        <Toaster theme="dark" position="bottom-center" offset={{ bottom: 150 }} mobileOffset={{ bottom: 150 }} richColors closeButton />
        {twoPane ? (
          <>
            {/* List pane: the current tab, always on the left, with the tab chrome and mini player. */}
            <div data-pane="list" style={{ "--seen-content-max": "420px" } as CSSProperties} className="fixed inset-y-0 left-0 w-[420px] transform-gpu border-r border-white/10 bg-black">
              <NavigationBar onSearch={nav.openSearch} />
              <BottomNav
                activeTab={listScreen}
                onNavigate={handleNavItem}
                onReselect={detailOpen ? () => trackedGo(listScreen) : undefined}
                locked={signedOut ? ["create", "library", "profile"] : []}
              />
              <div data-scroll-root className="absolute inset-0 overflow-y-auto overflow-x-hidden">
                <Suspense fallback={<div className="px-gutter pt-header"><SkeletonList count={4} label="Loading" /></div>}>
                  <AnimatePresence mode="wait">{renderScreens(listScreen, "list")}</AnimatePresence>
                </Suspense>
              </div>
              {currentScreen !== "story-chapter" && <MediaPlayerBar bottomOffset onOpenChapter={openChapter} />}
            </div>
            {/* Detail pane: whatever was opened from the list. Fixed full-screen screens (story page, reader) fill this pane. */}
            <div data-pane="detail" style={{ "--seen-content-max": "760px" } as CSSProperties} className="fixed inset-y-0 left-[420px] right-0 transform-gpu bg-black">
              <div data-scroll-root className="absolute inset-0 overflow-y-auto overflow-x-hidden">
                <Suspense fallback={<div className="mx-auto max-w-(--seen-content-max) px-gutter pt-header"><SkeletonList count={4} label="Loading" /></div>}>
                  <AnimatePresence mode="wait">
                    {renderScreens(detailScreen, "detail")}
                    {!detailScreen && !guestBlocked && (
                      <div key="detail-empty" data-testid="detail-empty" className="min-h-dvh flex items-center justify-center px-8 text-center">
                        <p className="max-w-[280px] text-sm text-seen-muted leading-relaxed">{t("twopane.empty")}</p>
                      </div>
                    )}
                  </AnimatePresence>
                </Suspense>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Tab chrome lives outside the screen transition, so only the content fades on a tab switch. */}
            {isTab && <NavigationBar onSearch={nav.openSearch} />}
            {isTab && (
              <BottomNav
                activeTab={currentScreen as "for-you" | "explore" | "library" | "profile"}
                onNavigate={handleNavItem}
                locked={signedOut ? ["create", "library", "profile"] : []}
              />
            )}
            <Suspense
              fallback={
                <div className="max-w-(--seen-content-max) mx-auto px-gutter pt-header">
                  <SkeletonList count={4} label="Loading" />
                </div>
              }
            >
              <AnimatePresence mode="wait">{renderScreens(shown, "single")}</AnimatePresence>
            </Suspense>
            {currentScreen !== "onboarding" && currentScreen !== "story-chapter" && (
              <MediaPlayerBar bottomOffset={["for-you", "explore", "library", "profile"].includes(currentScreen)} onOpenChapter={openChapter} />
            )}
          </>
        )}
      </div>
      </MotionConfig>
    </AppNavProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoryStateProvider>
        <AuthProvider>
          <PlaybackProvider>
            <TooltipProvider>
              <MediaSessionBridge />
              <AppContent />
            </TooltipProvider>
          </PlaybackProvider>
        </AuthProvider>
      </StoryStateProvider>
    </ErrorBoundary>
  );
}
