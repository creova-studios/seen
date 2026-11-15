import { motion, AnimatePresence } from "motion/react";
import { Check, Clock, AlertCircle } from "lucide-react";
import { 
  CONFIRMATION_PULSE,
  STATUS_BADGE_VARIANTS,
  TRANSITIONS,
  prefersReducedMotion 
} from "../utils/motion";

type ConfirmationType = "saved" | "published" | "error" | "processing";

interface ConfirmationToastProps {
  type: ConfirmationType;
  message: string;
  visible: boolean;
  onDismiss?: () => void;
}

export function ConfirmationToast({ 
  type, 
  message, 
  visible,
  onDismiss 
}: ConfirmationToastProps) {
  const reducedMotion = prefersReducedMotion();

  const getIcon = () => {
    switch (type) {
      case "saved":
      case "published":
        return <Check className="w-4 h-4" strokeWidth={2} />;
      case "processing":
        return <Clock className="w-4 h-4" strokeWidth={2} />;
      case "error":
        return <AlertCircle className="w-4 h-4" strokeWidth={2} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "saved":
        return "bg-white/10 text-white border-white/20";
      case "published":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            ...(type === "saved" || type === "published" ? CONFIRMATION_PULSE : {})
          }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={TRANSITIONS.organic}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
          <motion.div
            className={`flex items-center gap-3 px-5 py-3 rounded-full border backdrop-blur-xl ${getStyles()}`}
            layoutId="confirmationToast"
          >
            {/* Icon */}
            <motion.div
              animate={type === "processing" && !reducedMotion ? {
                rotate: 360,
              } : {}}
              transition={{
                duration: 2,
                repeat: type === "processing" ? Infinity : 0,
                ease: "linear",
              }}
            >
              {getIcon()}
            </motion.div>

            {/* Message */}
            <span className="text-sm tracking-wide whitespace-nowrap">
              {message}
            </span>

            {/* Dismiss button */}
            {onDismiss && type !== "processing" && (
              <motion.button
                type="button"
                onClick={onDismiss}
                whileHover={!reducedMotion ? { scale: 1.1 } : undefined}
                whileTap={!reducedMotion ? { scale: 0.9 } : undefined}
                className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss"
              >
                <div className="w-4 h-4 flex items-center justify-center">×</div>
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface StatusBadgeProps {
  status: "draft" | "review" | "published" | "archived";
  children: string;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.span
      variants={!reducedMotion ? STATUS_BADGE_VARIANTS : undefined}
      initial={false}
      animate={status}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="px-2.5 py-1 text-[10px] tracking-widest uppercase rounded-full border inline-block"
    >
      {children}
    </motion.span>
  );
}

interface CreatorActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
}

export function CreatorActionButton({
  children,
  onClick,
  variant = "secondary",
  loading = false,
  disabled = false,
}: CreatorActionButtonProps) {
  const reducedMotion = prefersReducedMotion();

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-white text-black hover:bg-white/90";
      case "secondary":
        return "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20";
      case "danger":
        return "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20";
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!reducedMotion && !disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!reducedMotion && !disabled && !loading ? { scale: 0.98 } : undefined}
      transition={TRANSITIONS.interaction}
      className={`px-6 py-3 rounded-lg text-sm tracking-wide font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${getVariantStyles()}`}
    >
      <motion.div
        className="flex items-center justify-center gap-2"
        animate={loading && !reducedMotion ? {
          opacity: [1, 0.5, 1],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: loading ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {loading && (
          <motion.div
            animate={!reducedMotion ? { rotate: 360 } : {}}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        {children}
      </motion.div>
    </motion.button>
  );
}
