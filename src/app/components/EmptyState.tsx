/**
 * EMPTY STATE COMPONENT
 * SEEN by CREOVA
 * 
 * Displays empty states across all sections
 * Never shows fallback or demo content
 */

import { motion } from 'motion/react';
import { Play, Bookmark, Check, Heart, Compass, Info, type LucideIcon as LucideIconType } from 'lucide-react';

// Explicit map instead of `import * as Icons` — the wildcard pulled the whole
// lucide library (~1,500 icons) into the main bundle.
const ICONS: Record<string, LucideIconType> = { Play, Bookmark, Check, Heart, Compass, Info };
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: string; // Lucide icon name
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  // Dynamically get the icon component
  const IconComponent = ICONS[icon] ?? Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center text-center px-8 py-16 ${className}`}
    >
      {/* Icon */}
      <div className="mb-6 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <IconComponent className="w-8 h-8 text-white/55" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-8">
        {message}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
