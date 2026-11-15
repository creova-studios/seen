import { DemoModeNotice } from "./DemoModeNotice";
import { PageTitle } from "./seen/primitives";
import { useState } from "react";
import { motion } from "motion/react";
import { ConfirmDialog } from "./seen/overlays";
import { useT } from "../i18n/useT";
import { ListItem } from "./seen/display";
import { 
  Settings, 
  Info, 
  Globe, 
  Eye, 
  BarChart3, 
  Heart, 
  ChevronRight, 
  User,
  Moon,
  Volume2,
  Plus,
  Shield,
  Building2,
  MessageCircle,
  LogOut,
  Home,
  Compass,
  Library
} from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import type { Language } from "../contexts/StoryStateContext";
import { getStoryWorldById, getLocalizedText } from "../data/storyDatabase";
import { listDraftsForCreator, listStoriesForCreator } from "../data/userStoriesService";
import { Bell, BookmarkCheck, HandCoins, Users } from "lucide-react";
import { useAppNav } from "../navigation/AppNav";
import { MetricCard } from "./seen/primitives";
import { api } from "../services";
import { useResource } from "../hooks/useResource";

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onSearch?: () => void;
  onOpenSettings?: () => void;
  onOpenAbout?: () => void;
  onOpenCreatorDashboard?: () => void;
  onOpenModeration?: () => void;
  onOpenInstitutional?: () => void;
  onOpenMonetization?: () => void;
  onOpenEarnings?: () => void;
  onOpenSubscriptions?: () => void;
  onOpenAdmin?: () => void;
  onOpenStory?: (storyId: string) => void;
  userIntent?: "explore" | "create" | "contribute";
  language: "en" | "fr" | "es";
}

export function ProfileScreen({
  onNavigate,
  onSearch,
  onOpenSettings,
  onOpenAbout,
  onOpenCreatorDashboard,
  onOpenModeration,
  onOpenInstitutional,
  onOpenMonetization,
  onOpenEarnings,
  onOpenSubscriptions,
  onOpenAdmin,
  onOpenStory,
  userIntent = "explore",
  language = "en"
}: ProfileScreenProps) {
  const { state, setUserRole } = useStoryState();
  const { state: authState, signOut } = useAuth();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const t = useT();
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // User will be redirected to onboarding automatically
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // User profile data — sourced from the real authenticated account.
  // No stock photo or fabricated bio: a brand-new account genuinely has
  // neither yet, so the UI shows honest empty states for those instead.
  const user = {
    name: authState.user?.name || "Guest",
    email: authState.user?.email || "",
    bio: authState.user?.bio ?? "",
    joinDate: authState.user?.createdAt
      ? new Date(authState.user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
      : null,
    role: state.userRole // Use role from global state
  };

  // Real usage stats, derived from this device's actual reading history —
  // not fabricated. "Hours Listened" is a real (if approximate) sum of
  // tracked playback position across stories, not a placeholder number.
  const storiesCompleted = state.progressSnapshots.filter(s => s.completed).length;
  const minutesListened = Math.round(
    state.progressSnapshots.reduce((sum, s) => sum + (s.playbackPosition || 0), 0) / 60
  );
  const stats = {
    storiesCompleted,
    minutesListened,
  };

  // Recent activity, derived from real progress snapshots (most recent first).
  // No follow graph exists yet, so followers/following are not shown here
  // rather than displaying invented numbers.
  const recentActivity = [...state.progressSnapshots]
    .sort((a, b) => new Date(b.lastAccessDate).getTime() - new Date(a.lastAccessDate).getTime())
    .slice(0, 5)
    .map(snapshot => {
      const story = getStoryWorldById(snapshot.storyWorldId);
      return {
        action: snapshot.completed ? "Completed" : "Started",
        title: story ? getLocalizedText(story.title, state.language) : snapshot.storyWorldId,
        date: new Date(snapshot.lastAccessDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      };
    });

  const nav = useAppNav();
  const myStories = authState.user ? listStoriesForCreator(authState.user.id) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-dvh bg-black"
    >
      {/* Navigation */}

      {/* Main Content */}
      <main className="pt-header pb-clearance px-gutter max-w-(--seen-content-max) mx-auto">
        <DemoModeNotice />
        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar — initials placeholder; no photo-upload feature exists yet */}
            <div className="w-20 h-20 rounded-full border-2 border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl text-white/60 font-light">
                {user.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <PageTitle>{user.name}</PageTitle>
              </div>
              {user.email && <p className="text-sm text-white/60 mb-2">{user.email}</p>}
              {user.joinDate && <p className="text-xs text-white/55">Member since {user.joinDate}</p>}
            </div>
          </div>

          {/* Bio — written in Edit profile */}
          {user.bio ? (
            <p className="text-sm text-white/80 mb-4">{user.bio}</p>
          ) : (
            <p className="text-sm text-white/55 italic mb-4">No bio yet.</p>
          )}

          {/* Edit Profile Button */}
          <button
            onClick={() => nav.go("edit-profile")}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 gap-3">
            <StatCard value={stats.storiesCompleted} label="Stories finished" />
            <StatCard value={stats.minutesListened} label="Minutes listened" />
          </div>
        </motion.section>

        {/* Your activity — real follow / save / tracker data from the services layer */}
        <YourSeenSection />

        {/* Development Testing - Switch Role */}
        {process.env.NODE_ENV === 'development' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            {/* Testing mode removed - roles are now set during onboarding only */}
          </motion.section>
        )}

        {/* Role-Based Navigation */}
        {(state.userRole === 'creator' || state.userRole === 'moderator' || state.userRole === 'admin') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mb-8"
          >
            <h2 className="text-sm tracking-wider uppercase text-white/55 mb-4">
              {state.userRole === 'creator' ? 'Creator Tools' :
               state.userRole === 'moderator' ? 'Moderation Tools' :
               'Admin Tools'}
            </h2>
            <div className="space-y-2">
              {state.userRole === 'creator' && (
                <>
                  <SettingItem
                    icon={<Moon className="w-5 h-5 text-purple-400" />}
                    label="Creator Dashboard"
                    value="Build stories"
                    onClick={onOpenCreatorDashboard}
                  />
                  <SettingItem
                    icon={<BarChart3 className="w-5 h-5 text-amber-400" />}
                    label="Monetization"
                    value="Pricing & tiers"
                    onClick={onOpenMonetization}
                  />
                  <SettingItem
                    icon={<BarChart3 className="w-5 h-5 text-green-400" />}
                    label="Earnings"
                    value="Revenue & payouts"
                    onClick={onOpenEarnings}
                  />
                </>
              )}
              {(state.userRole === 'moderator' || state.userRole === 'admin') && (
                <SettingItem
                  icon={<Shield className="w-5 h-5 text-blue-400" />}
                  label="Moderation Panel"
                  value="Review submissions"
                  onClick={onOpenModeration}
                />
              )}
              {state.userRole === 'admin' && (
                <>
                  <SettingItem
                    icon={<Building2 className="w-5 h-5 text-green-400" />}
                    label="Collections"
                    value="Browse"
                    onClick={onOpenInstitutional}
                  />
                  <SettingItem
                    icon={<Shield className="w-5 h-5 text-purple-400" />}
                    label="Platform Dashboard"
                    value="Users, revenue & config"
                    onClick={onOpenAdmin}
                  />
                </>
              )}
            </div>
          </motion.section>
        )}

        {/* Creator Section (if creator) */}
        {user.role === "creator" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-semibold text-white">Creator Dashboard</h2>
              </div>
              <p className="text-sm text-white/70 mb-4">Manage your stories and view analytics</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard label="Published" value={myStories.length} />
                <MetricCard label="Drafts" value={listDraftsForCreator(authState.user?.id ?? "").length} />
              </div>
              <div className="flex gap-3 mb-3">
                <button type="button" onClick={() => nav.go("creator-stories")} className="flex-1 min-h-11 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors">Your stories</button>
                <button type="button" onClick={() => nav.go("notes")} className="flex-1 min-h-11 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors">Notes</button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onOpenCreatorDashboard}
                  className="flex-1 py-2.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Story
                </button>
                <button
                  onClick={onOpenEarnings}
                  className="flex-1 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* My Stories (if creator has published any) */}
        {user.role === "creator" && (myStories.length > 0 || listDraftsForCreator(authState.user?.id ?? "").length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm tracking-wider uppercase text-white/55">My Stories</h2>
              <button type="button" onClick={() => nav.go("creator-stories")} className="min-h-11 px-2 text-xs text-white/70 underline underline-offset-2 hover:text-white">See all</button>
            </div>
            <div className="space-y-2">
              {myStories.length === 0 && <p className="text-xs text-white/55">You have a draft in progress.</p>}
              {myStories.map(story => (
                <div
                  key={story.id}
                  onClick={() => onOpenStory?.(story.id)}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{story.title.en}</p>
                    <p className="text-xs text-white/55 capitalize">{story.visibility} · {story.chapterCount} chapter{story.chapterCount !== 1 ? "s" : ""}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/55 flex-shrink-0" />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Creator Invitation (if viewer) */}
        {user.role === "viewer" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="mb-3">
                <h2 className="text-base font-semibold text-white">Tell a story</h2>
              </div>
              <p className="text-sm text-white/70 mb-4">Got a story, a recipe, a song or a family memory worth keeping? Write or record your first piece.</p>
              <button 
                onClick={() => {
                  // This will trigger role upgrade when they publish
                  onOpenCreatorDashboard?.();
                }}
                className="w-full min-h-11 py-2.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Start Creating
              </button>
            </div>
          </motion.section>
        )}

        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <h2 className="text-sm tracking-wider uppercase text-white/55 mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <p className="text-sm text-white/55 mb-1">No activity yet</p>
              <p className="text-xs text-white/55">Start a story to see your progress here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => onNavigate("library")}
                >
                  <div>
                    <div className="text-sm text-white mb-1">
                      <span className="text-purple-400">{item.action}</span> {item.title}
                    </div>
                    <div className="text-xs text-white/55">{item.date}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/55" />
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Preferences & Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-sm tracking-wider uppercase text-white/55 mb-4">Preferences</h2>
          <div className="space-y-2">
            <SettingItem
              icon={<Globe className="w-5 h-5" />}
              label="Language"
              value={language === "en" ? "English" : language === "fr" ? "Français" : "Español"}
              onClick={onOpenSettings}
            />
            <SettingItem
              icon={<Eye className="w-5 h-5" />}
              label="Accessibility"
              value={
                state.accessibilityPreferences.captionsEnabled ||
                state.accessibilityPreferences.highContrast ||
                state.accessibilityPreferences.reducedMotion
                  ? "Customized"
                  : "Default"
              }
              onClick={onOpenSettings}
            />
            <SettingItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              onClick={onOpenSettings}
            />
            <SettingItem
              icon={<BarChart3 className="w-5 h-5" />}
              label="Subscriptions & Billing"
              onClick={onOpenSubscriptions}
            />
          </div>
        </motion.section>

        {/* Community & Support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <h2 className="text-sm tracking-wider uppercase text-white/55 mb-4">Help and guidelines</h2>
          <div className="space-y-2">
            <SettingItem
              icon={<Heart className="w-5 h-5" />}
              label="Your library"
              onClick={() => onNavigate("library")}
            />
            <SettingItem
              icon={<MessageCircle className="w-5 h-5" />}
              label="Community Guidelines"
              onClick={onOpenAbout}
            />
            <SettingItem
              icon={<Info className="w-5 h-5" />}
              label="About SEEN"
              onClick={onOpenAbout}
            />
          </div>
        </motion.section>

        {/* Account Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => setConfirmSignOut(true)}
            className="w-full min-h-11 py-3 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.section>
        <ConfirmDialog
          open={confirmSignOut}
          onOpenChange={setConfirmSignOut}
          title={t("signout.title")}
          description={t("signout.msg")}
          confirmLabel={t("signout.confirm")}
          onConfirm={handleSignOut}
        />

        {/* App Version */}
        <div className="text-center text-xs text-white/55">
          SEEN v1.0.0 • Made with ❤️ by CREOVA
        </div>
      </main>

      {/* Bottom Navigation */}
    </motion.div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
      <div className="text-xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/55">{label}</div>
    </div>
  );
}

function YourSeenSection() {
  const nav = useAppNav();
  const counts = useResource(async () => {
    const [following, saved, apps] = await Promise.all([
      api.creators.listFollowing(),
      api.collections.listSaved(),
      api.funding.listApplications(),
    ]);
    return { following: following.length, saved: saved.length, tracked: apps.filter(a => a.status !== "none").length };
  });
  const n = (v?: number) => (counts.status === "ready" && v !== undefined ? String(v) : "—");
  return (
    <section className="mb-8" aria-labelledby="your-seen">
      <h2 id="your-seen" className="text-sm tracking-wider uppercase text-white/55 mb-4">Your activity</h2>
      <div className="space-y-2">
        <SettingItem icon={<Users className="w-5 h-5" />} label="Following" value={n(counts.data?.following)} onClick={() => nav.go("explore", { tab: "creators" })} />
        <SettingItem icon={<BookmarkCheck className="w-5 h-5" />} label="Saved collections" value={n(counts.data?.saved)} onClick={() => nav.go("collections")} />
        <SettingItem icon={<HandCoins className="w-5 h-5 text-amber-300" />} label="Funding tracker" value={n(counts.data?.tracked)} onClick={() => nav.go("funding")} />
        <SettingItem icon={<Bell className="w-5 h-5" />} label="Notifications" value={nav.unreadCount ? `${nav.unreadCount} new` : undefined} onClick={nav.openNotifications} />
      </div>
    </section>
  );
}

/** Profile rows use the Figma List Item. */
function SettingItem({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value?: string; onClick?: () => void }) {
  return <ListItem icon={icon} label={label} value={value} onClick={onClick} />;
}
