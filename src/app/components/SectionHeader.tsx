import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { TRANSITIONS } from "../utils/motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  /** When omitted, no "See all" affordance is rendered (no dead buttons). */
  onViewAll?: () => void;
}

export function SectionHeader({ title, subtitle, icon, onViewAll }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={TRANSITIONS.default}
      className="flex items-center justify-between mb-4"
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-white/70">{icon}</span>}
        <div>
          <h2 className="text-xl font-semibold leading-[1.3] text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs leading-[1.4] tracking-[0.02em] text-seen-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          aria-label={`See all ${title}`}
          className="flex items-center gap-1 min-h-11 px-1 text-xs tracking-wider uppercase text-white/55 hover:text-white/80 transition-colors"
        >
          See All
          <ChevronRight className="w-3 h-3" aria-hidden />
        </button>
      )}
    </motion.div>
  );
}
