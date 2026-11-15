import { Compass, Home, Library, Lock, PlusCircle, User } from "lucide-react";
import { useT } from "../../i18n/useT";
import type { StringKey } from "../../i18n/strings";
import { haptic } from "../../native/native";

/**
 * The single bottom navigation (Figma 248:163): For You, Explore, Create, Library, Profile.
 * Labels are sentence case at 11 px so "Bibliothèque" fits five tabs at 320 px. Create is an action, not a screen:
 * it opens the publish flow (or the one-time creator intro, or the guest sheet), so it is never the active tab.
 * Tapping the active tab scrolls its screen to the top (PR-3).
 */
export type TabId = "for-you" | "explore" | "library" | "profile";
export type NavItemId = TabId | "create";

const TABS: { id: NavItemId; label: StringKey; Icon: typeof Home }[] = [
  { id: "for-you", label: "nav.forYou", Icon: Home },
  { id: "explore", label: "nav.explore", Icon: Compass },
  { id: "create", label: "nav.create", Icon: PlusCircle },
  { id: "library", label: "nav.library", Icon: Library },
  { id: "profile", label: "nav.profile", Icon: User },
];

/** Re-tapping the current tab returns to the top of its screen; instant when the person asked for less motion. */
function scrollToTop() {
  const reduced = document.documentElement.dataset.motion === "reduced" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  // On wide screens the list pane scrolls on its own; otherwise the page does.
  const pane = document.querySelector<HTMLElement>('[data-pane="list"] [data-scroll-root]');
  (pane ?? window).scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
}

export function BottomNav({
  activeTab,
  onNavigate,
  locked = [],
  onReselect,
}: {
  activeTab: TabId;
  onNavigate: (tab: NavItemId) => void;
  /** Items that need an account (guests). They stay real buttons and open the sign-in sheet. */
  locked?: NavItemId[];
  /** What tapping the current tab does. Default: scroll to the top. */
  onReselect?: () => void;
}) {
  const t = useT();
  return (
    <nav aria-label="Main" className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-seen-surface/95 border-t border-seen-border pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-(--seen-content-max) mx-auto flex">
        {TABS.map(({ id, label, Icon }) => {
          const active = id === activeTab;
          const isLocked = locked.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                haptic("select");
                if (active) (onReselect ?? scrollToTop)();
                else onNavigate(id);
              }}
              aria-current={active ? "page" : undefined}
              aria-label={isLocked ? t("nav.locked", { tab: t(label) }) : undefined}
              className={`flex-1 min-w-0 h-[calc(var(--seen-nav-height)-1px)] flex flex-col items-center justify-center gap-1 transition-colors duration-[var(--seen-duration-fast)] group ${
                active ? "text-white" : "text-white/55 hover:text-white/80"
              }`}
            >
              <span className="relative">
                <Icon aria-hidden className="w-5 h-5" strokeWidth={active ? 2 : 1.5} />
                {isLocked && <Lock aria-hidden className="absolute -right-1.5 -bottom-1 w-2.5 h-2.5 text-white/80" strokeWidth={2.5} />}
              </span>
              <span className="max-w-full px-0.5 text-[11px] max-[359px]:text-[10px] leading-[1.2] font-medium whitespace-nowrap">{t(label)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
