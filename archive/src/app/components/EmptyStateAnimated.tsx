import { motion } from "motion/react";
import { Heart, Compass, Play, Check, Bookmark, LucideIcon } from "lucide-react";
import { 
  EMPTY_STATE_VARIANTS,
  TRANSITIONS,
  prefersReducedMotion 
} from "../utils/motion";

interface EmptyStateAnimatedProps {
  icon?: "Heart" | "Compass" | "Play" | "Check" | "Bookmark";
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const ICONS: Record<string, LucideIcon> = {
  Heart,
  Compass,
  Play,
  Check,
  Bookmark,
};

export function EmptyStateAnimated({
  icon = "Heart",
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateAnimatedProps) {
  const reducedMotion = prefersReducedMotion();
  const Icon = ICONS[icon];

  return (
    <motion.div
      variants={!reducedMotion ? EMPTY_STATE_VARIANTS : undefined}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center px-8 py-16 text-center"
    >
      {/* Icon Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          ...TRANSITIONS.organic,
          delay: 0.2,
        }}
        className="mb-6 relative"
      >
        {/* Glow Effect */}
        <motion.div
          animate={!reducedMotion ? {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-white/10 rounded-full blur-xl"
        />

        {/* Icon Circle */}
        <div className="relative w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-white/40" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...TRANSITIONS.organic,
          delay: 0.3,
        }}
        className="text-xl font-light tracking-wide text-white mb-3"
      >
        {title}
      </motion.h3>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...TRANSITIONS.organic,
          delay: 0.4,
        }}
        className="text-sm text-white/60 leading-relaxed max-w-sm mb-8"
      >
        {message}
      </motion.p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <motion.button
          type="button"
          onClick={onAction}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
          whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
          transition={{
            ...TRANSITIONS.organic,
            delay: 0.5,
          }}
          className="px-8 py-3 bg-white/10 border border-white/20 rounded-lg text-sm tracking-wide text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300"
        >
          {actionLabel}
        </motion.button>
      )}

      {/* Floating Particles (decorative) */}
      {!reducedMotion && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{ 
                x: 0, 
                y: 0,
                opacity: 0,
              }}
              animate={{
                x: [0, Math.random() * 40 - 20, 0],
                y: [0, Math.random() * 40 - 20, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.7,
              }}
              style={{
                left: `${50 + (i - 1) * 20}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
