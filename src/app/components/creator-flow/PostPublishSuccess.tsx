import { motion } from "motion/react";
import { Check, Eye, Share2, BarChart3, Home } from "lucide-react";
import { TRANSITIONS, VARIANTS, prefersReducedMotion, CONFIRMATION_PULSE } from "../../utils/motion";

interface PostPublishSuccessProps {
  storyTitle: string;
  visibility: 'public' | 'institutional' | 'private';
  onViewStory: () => void;
  onGoToLibrary: () => void;
  onShareStory?: () => void;
  onViewAnalytics?: () => void;
}

export function PostPublishSuccess({
  storyTitle,
  visibility,
  onViewStory,
  onGoToLibrary,
  onShareStory,
  onViewAnalytics,
}: PostPublishSuccessProps) {
  const reducedMotion = prefersReducedMotion();

  const getMessage = () => {
    switch (visibility) {
      case 'public':
        return 'Your story is now live and visible to all SEEN audiences.';
      case 'institutional':
        return 'Your story has been shared with selected institutional partners.';
      case 'private':
        return 'Your story is saved privately in your library.';
    }
  };

  return (
    <div className="min-h-dvh bg-black text-white flex items-center justify-center px-5">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            ...CONFIRMATION_PULSE,
          }}
          transition={TRANSITIONS.spring}
          className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-8"
        >
          <Check className="w-12 h-12 text-green-500" strokeWidth={2.5} />
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.reveal, delay: 0.3 }}
          className="text-2xl font-light tracking-wide text-center mb-3"
        >
          Story Published
        </motion.h1>

        {/* Story Title */}
        <motion.p
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.reveal, delay: 0.4 }}
          className="text-lg text-white/80 text-center mb-2"
        >
          "{storyTitle}"
        </motion.p>

        {/* Message */}
        <motion.p
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.reveal, delay: 0.5 }}
          className="text-sm text-white/60 text-center leading-relaxed mb-8"
        >
          {getMessage()}
        </motion.p>

        {/* Actions */}
        <motion.div
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.reveal, delay: 0.6 }}
          className="space-y-3 mb-8"
        >
          {/* View Story */}
          <motion.button
            type="button"
            onClick={onViewStory}
            whileHover={!reducedMotion ? { scale: 1.02 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-all"
          >
            <Eye className="w-5 h-5" strokeWidth={2} />
            <span>View Your Story</span>
          </motion.button>

          {/* Share (if public) */}
          {visibility === 'public' && onShareStory && (
            <motion.button
              type="button"
              onClick={onShareStory}
              whileHover={!reducedMotion ? { scale: 1.02 } : undefined}
              whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 border border-white/20 text-white rounded-lg text-sm hover:bg-white/15 transition-all"
            >
              <Share2 className="w-5 h-5" strokeWidth={1.5} />
              <span>Share Story</span>
            </motion.button>
          )}

          {/* View Analytics (if public or institutional) */}
          {(visibility === 'public' || visibility === 'institutional') && onViewAnalytics && (
            <motion.button
              type="button"
              onClick={onViewAnalytics}
              whileHover={!reducedMotion ? { scale: 1.02 } : undefined}
              whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 border border-white/20 text-white rounded-lg text-sm hover:bg-white/15 transition-all"
            >
              <BarChart3 className="w-5 h-5" strokeWidth={1.5} />
              <span>View Analytics</span>
            </motion.button>
          )}
        </motion.div>

        {/* Secondary Actions */}
        <motion.div
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.reveal, delay: 0.7 }}
          className="space-y-2"
        >
          <button
            type="button"
            onClick={onGoToLibrary}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm text-white/60 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" strokeWidth={1.5} />
            <span>Go to Library</span>
          </button>
        </motion.div>

        {/* What's Next */}
        <motion.div
          variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITIONS.reveal, delay: 0.8 }}
          className="mt-12 p-5 bg-white/5 border border-white/10 rounded-lg"
        >
          <h3 className="text-sm font-light tracking-wide mb-3">What happens next?</h3>
          <ul className="space-y-2 text-xs text-white/60 leading-relaxed">
            {visibility === 'public' && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-white/55">•</span>
                  <span>Your story is live now and visible to readers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/55">•</span>
                  <span>Community responses are reviewed by moderators before appearing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/55">•</span>
                  <span>Check Earnings for revenue once you set pricing</span>
                </li>
              </>
            )}
            {visibility === 'institutional' && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-white/55">•</span>
                  <span>Your story is saved to the Institutional Collection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/55">•</span>
                  <span>You can change its visibility anytime</span>
                </li>
              </>
            )}
            {visibility === 'private' && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-white/55">•</span>
                  <span>Your story remains in your private library</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/55">•</span>
                  <span>You can change visibility settings anytime</span>
                </li>
              </>
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
