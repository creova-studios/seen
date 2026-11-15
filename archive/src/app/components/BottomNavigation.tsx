import { motion } from "motion/react";
import { Home, Compass, Library, User } from "lucide-react";
import { 
  TAB_VARIANTS, 
  TRANSITIONS,
  triggerHaptic,
  prefersReducedMotion 
} from "../utils/motion";

interface BottomNavigationProps {
  activeTab: "for-you" | "explore" | "library" | "profile";
  onNavigate: (tab: "for-you" | "explore" | "library" | "profile") => void;
  isCreator?: boolean;
}

const TABS = [
  { id: "for-you", label: "For You", Icon: Home },
  { id: "explore", label: "Explore", Icon: Compass },
  { id: "library", label: "Library", Icon: Library },
  { id: "profile", label: "Profile", Icon: User },
] as const;

export function BottomNavigation({ 
  activeTab, 
  onNavigate,
  isCreator = false 
}: BottomNavigationProps) {
  const reducedMotion = prefersReducedMotion();

  const handleTabPress = (tabId: typeof activeTab) => {
    if (tabId !== activeTab) {
      triggerHaptic('light');
      onNavigate(tabId);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 pointer-events-none z-50">
      <div className="max-w-[428px] mx-auto px-5 py-4 flex justify-around">
        {TABS.map(({ id, label, Icon }, index) => {
          const isActive = activeTab === id;
          
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => handleTabPress(id as typeof activeTab)}
              variants={!reducedMotion ? TAB_VARIANTS : undefined}
              initial="inactive"
              animate={isActive ? "active" : "inactive"}
              whileHover={!reducedMotion && !isActive ? "hover" : undefined}
              whileTap={!reducedMotion ? "tap" : undefined}
              transition={TRANSITIONS.interaction}
              className="flex flex-col items-center gap-1.5 pointer-events-auto relative"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Icon Container */}
              <motion.div 
                className="relative w-5 h-5 flex items-center justify-center"
                animate={{
                  scale: isActive ? 1 : 1,
                }}
                transition={TRANSITIONS.spring}
              >
                <Icon 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive 
                      ? 'stroke-[2]' 
                      : 'stroke-[1.5]'
                  }`}
                  style={{
                    filter: isActive 
                      ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' 
                      : 'none'
                  }}
                />
                
                {/* Creator Badge */}
                {isCreator && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      ...TRANSITIONS.spring,
                      delay: 0.5 + (index * 0.1)
                    }}
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white border border-black"
                  />
                )}
              </motion.div>

              {/* Label */}
              <motion.span 
                className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
                  isActive ? 'font-medium' : 'font-light'
                }`}
                animate={{
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={TRANSITIONS.fade}
              >
                {label}
              </motion.span>

              {/* Active Indicator Line */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
