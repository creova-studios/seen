import { createContext, useContext } from "react";

/**
 * App-level navigation surface.
 *
 * App.tsx owns the screen state; this context exposes it so deeply nested
 * components (the shared NavigationBar, feature screens) can navigate without
 * prop-drilling. Before this existed the header's Search/Profile buttons were
 * wired to a disconnected controller and did nothing on For You / Explore.
 */
export type RouteParams = { id?: string; tab?: string };

export interface AppNav {
  /** `replace` swaps the current history entry instead of adding one (e.g. switching tabs). */
  go: (screen: string, params?: RouteParams, opts?: { replace?: boolean }) => void;
  back: () => void;
  openStory: (storyId: string) => void;
  openSearch: () => void;
  openNotifications: () => void;
  openProfile: () => void;
  unreadCount: number;
}

const noop = () => {};
const AppNavContext = createContext<AppNav>({
  go: noop,
  back: noop,
  openStory: noop,
  openSearch: noop,
  openNotifications: noop,
  openProfile: noop,
  unreadCount: 0,
});

export const AppNavProvider = AppNavContext.Provider;
export const useAppNav = () => useContext(AppNavContext);
