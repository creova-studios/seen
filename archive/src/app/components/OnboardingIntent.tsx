import { motion } from "motion/react";
import { Eye, Pen, Archive } from "lucide-react";
import { useState } from "react";

interface OnboardingIntentProps {
  onNext: () => void;
}

const intentions = [
  {
    id: "explore",
    icon: Eye,
    title: "Explore Stories",
    description: "Immerse yourself in curated cultural narratives",
    gradient: "from-blue-600/20 to-purple-600/20"
  },
  {
    id: "create",
    icon: Pen,
    title: "Create Stories",
    description: "Shape your voice through sound and vision",
    gradient: "from-purple-600/20 to-pink-600/20"
  },
  {
    id: "contribute",
    icon: Archive,
    title: "Contribute to Archive",
    description: "Preserve moments that matter to our collective",
    gradient: "from-pink-600/20 to-orange-600/20"
  }
];

export function OnboardingIntent({ onNext }: OnboardingIntentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    // Auto-advance after selection
    setTimeout(() => {
      onNext();
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black overflow-auto"
    >
      <div className="min-h-full flex flex-col p-8 pt-16 pb-12 max-w-[428px] mx-auto">
        {/* Top: Progress */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/40">
              SEEN
            </p>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-1 bg-white/80 rounded-full" />
            <div className="w-8 h-1 bg-white/80 rounded-full" />
            <div className="w-8 h-1 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-3xl leading-tight tracking-tight text-white mb-3">
            What brings you
            <br />
            to SEEN?
          </h1>
          <p className="text-sm text-white/50">
            Choose your path—you can change this anytime
          </p>
        </motion.div>

        {/* Intention Cards */}
        <div className="space-y-4 flex-1">
          {intentions.map((intention, index) => {
            const Icon = intention.icon;
            const isSelected = selected === intention.id;

            return (
              <motion.button
                key={intention.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(intention.id)}
                className={`
                  w-full p-6 rounded-2xl text-left transition-all duration-500
                  border backdrop-blur-sm
                  ${isSelected 
                    ? 'border-white/40 bg-white/10' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    bg-gradient-to-br ${intention.gradient}
                    border border-white/10
                  `}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base text-white mb-1">
                      {intention.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {intention.description}
                    </p>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-2 h-2 rounded-full bg-black"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Skip option */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onNext}
          className="w-full py-4 mt-6 text-sm tracking-wider uppercase text-white/40 hover:text-white/70 transition-colors"
        >
          Skip for now
        </motion.button>
      </div>
    </motion.div>
  );
}