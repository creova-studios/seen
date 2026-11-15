import { motion } from "motion/react";
import { NavigationBar } from "./NavigationBar";
import { 
  Settings, 
  Info, 
  Globe, 
  Eye, 
  Shield,
  Building2,
  MessageCircle,
  LogOut,
  Plus,
  Award,
  Clock,
  Heart,
  ChevronRight,
  BarChart3,
  FileText,
  Palette
} from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import type { Language } from "../contexts/StoryStateContext";

interface ProfileScreenCreatorProps {
  onNavigate: (screen: "for-you" | "explore" | "library" | "profile") => void;
}

export function ProfileScreenCreator({ onNavigate }: ProfileScreenCreatorProps) {
  const { state: { language }, setLanguage } = useStoryState();
  const { state: authState, signOut } = useAuth();

  const userStats = {
    hoursCreated: 47,
    culturalContributions: 12,
    communityImpact: 2845,
    averageCompletion: 78,
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <NavigationBar 
        title="Profile"
        showBack={false}
        onBack={() => {}}
        action={{
          label: "Settings",
          icon: Settings,
          onClick: () => console.log("Open settings")
        }}
      />

      {/* Scrollable Content */}
      <div className="pb-24 pt-6">
        {/* Creator Identity */}
        <div className="px-5 mb-8">
          <div className="flex items-start justify-between mb-6">
            {/* Avatar & Info */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center relative">
                <span className="text-2xl font-light">
                  {authState.user?.name?.charAt(0).toUpperCase() || 'C'}
                </span>
                {/* Creator Badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-black border-2 border-white flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-light tracking-wide mb-1">
                  {authState.user?.name || 'Creator'}
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-[10px] tracking-widest uppercase bg-white/10 text-white/80 rounded border border-white/20">
                    Creator
                  </span>
                  <span className="text-xs text-white/40">
                    {authState.user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Create New Button */}
          <button
            type="button"
            onClick={() => console.log("Create new content")}
            className="w-full py-4 bg-white text-black rounded-lg flex items-center justify-center gap-2 text-sm tracking-wide font-medium hover:bg-white/90 transition-all duration-300"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span>Create New</span>
          </button>
        </div>

        {/* Creator Stats */}
        <div className="px-5 mb-8">
          <div className="border border-white/10 bg-white/[0.02] rounded-lg p-5">
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-4">Impact & Contribution</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Hours Created */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Hours Created</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{userStats.hoursCreated}</div>
              </div>

              {/* Cultural Contributions */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Palette className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Contributions</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{userStats.culturalContributions}</div>
              </div>

              {/* Community Impact */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Heart className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Community Impact</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{userStats.communityImpact.toLocaleString()}</div>
              </div>

              {/* Avg Completion */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <BarChart3 className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Avg Completion</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{userStats.averageCompletion}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Tools */}
        <div className="px-5 mb-8">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3 px-1">Creator Tools</h3>
          
          <div className="space-y-2">
            {/* Creator Dashboard */}
            <button
              type="button"
              onClick={() => console.log("Open creator dashboard")}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Creator Dashboard</div>
                  <div className="text-xs text-white/40">Analytics & insights</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Rights & Licensing */}
            <button
              type="button"
              onClick={() => console.log("Open rights & licensing")}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Rights & Licensing</div>
                  <div className="text-xs text-white/40">Manage IP & attribution</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Content Guidelines */}
            <button
              type="button"
              onClick={() => console.log("Open content guidelines")}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Content Guidelines</div>
                  <div className="text-xs text-white/40">Standards & best practices</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="px-5 mb-8">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3 px-1">Settings</h3>
          
          <div className="space-y-2">
            {/* Language */}
            <button
              type="button"
              onClick={() => console.log("Change language")}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Language</div>
                  <div className="text-xs text-white/40">
                    {language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'Español'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Accessibility */}
            <button
              type="button"
              onClick={() => console.log("Open accessibility")}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Accessibility</div>
                  <div className="text-xs text-white/40">Motion, audio, captions</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Privacy */}
            <button
              type="button"
              onClick={() => console.log("Open privacy")}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">Privacy</div>
                  <div className="text-xs text-white/40">Data & permissions</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Support & Info */}
        <div className="px-5 mb-8">
          <h3 className="text-xs tracking-widest uppercase text-white/40 mb-3 px-1">Support & Information</h3>
          
          <div className="space-y-2">
            {/* Grant Resources */}
            <button
              type="button"
              onClick={() => console.log("Open grant resources")}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <span className="text-sm tracking-wide">CMF Grant Resources</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* Feedback */}
            <button
              type="button"
              onClick={() => console.log("Send feedback")}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <span className="text-sm tracking-wide">Send Feedback</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>

            {/* About */}
            <button
              type="button"
              onClick={() => console.log("Open about")}
              className="w-full flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Info className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <span className="text-sm tracking-wide">About SEEN</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="px-5">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-500 transition-all duration-300 text-white/60"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm tracking-wide">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 pointer-events-none">
        <div className="max-w-[428px] mx-auto px-5 py-4 flex justify-around">
          <button
            type="button"
            onClick={() => onNavigate("for-you")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <div className="relative">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-sm border-2 border-white/40 group-hover:border-white/60 transition-colors duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/40 border border-black" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">For You</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white/40 group-hover:border-white/60 transition-colors duration-300" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">Explore</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate("library")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="space-y-0.5">
                <div className="w-4 h-0.5 bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
                <div className="w-4 h-0.5 bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
                <div className="w-4 h-0.5 bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
              </div>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">Library</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
