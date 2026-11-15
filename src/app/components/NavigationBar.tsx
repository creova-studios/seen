import { motion } from "motion/react";
import { Bell, Search, User } from "lucide-react";
import { useAppNav } from "../navigation/AppNav";
import { IconButton } from "./seen/primitives";
import { Tooltip } from "./seen/overlays";

interface NavigationBarProps {
  /** Optional override; defaults to the app-level search. */
  onSearch?: () => void;
}

export function NavigationBar({ onSearch }: NavigationBarProps) {
  const nav = useAppNav();

  return (
    <motion.header
      // The header is part of every tab screen, so animating it in would replay on each tab switch.
      initial={false}
      className="fixed top-0 left-0 right-0 z-50 px-gutter pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl bg-black/60 border-b border-white/5"
    >
      <div className="max-w-(--seen-content-max) mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-lg tracking-tight text-white">SEEN</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/55">by CREOVA</span>
        </div>

        <nav aria-label="Quick actions" className="flex items-center gap-2">
          <Tooltip content="Search">
            <IconButton label="Search" onClick={onSearch ?? nav.openSearch}>
              <Search className="w-4 h-4 text-white/70" />
            </IconButton>
          </Tooltip>
          <Tooltip content={nav.unreadCount ? `Notifications · ${nav.unreadCount} new` : "Notifications"}>
            <IconButton label="Notifications" badge={nav.unreadCount} onClick={nav.openNotifications}>
              <Bell className="w-4 h-4 text-white/70" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Profile">
            <IconButton label="Profile" onClick={nav.openProfile}>
              <User className="w-4 h-4 text-white/70" />
            </IconButton>
          </Tooltip>
        </nav>
      </div>
    </motion.header>
  );
}
