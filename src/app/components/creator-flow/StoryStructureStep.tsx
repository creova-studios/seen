import { motion } from "motion/react";
import { useState } from "react";
import { ChevronRight, ChevronLeft, GitBranch, List, Layers } from "lucide-react";
import { TRANSITIONS, VARIANTS, prefersReducedMotion } from "../../utils/motion";

interface StoryStructureStepProps {
  onNext: (data: StoryStructureData) => void;
  onBack: () => void;
  onSaveDraft: (data: Partial<StoryStructureData>) => void;
  initialData?: Partial<StoryStructureData>;
}

export interface StoryStructureData {
  structureType: 'linear' | 'branching' | 'episodic';
  estimatedChapters: number;
}

type StructureOption = {
  id: 'linear' | 'branching' | 'episodic';
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  example: string;
  visual: React.ReactNode;
};

const STRUCTURE_OPTIONS: StructureOption[] = [
  {
    id: 'linear',
    label: 'Linear',
    description: 'A single narrative path from beginning to end. Classic storytelling.',
    example: 'Documentary, oral history, musical journey',
    icon: List,
    visual: (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/60">
              {n}
            </div>
            {n < 4 && <div className="w-4 h-0.5 bg-white/20" />}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'branching',
    label: 'Soft-Branching',
    description: 'Main narrative with optional side paths for deeper context or alternate perspectives.',
    example: 'Multi-perspective stories, cultural deep-dives',
    icon: GitBranch,
    visual: (
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/60">1</div>
          <div className="w-4 h-0.5 bg-white/20" />
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/60">2</div>
          <div className="w-4 h-0.5 bg-white/20" />
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/60">3</div>
        </div>
        <div className="absolute left-[72px] top-8 flex flex-col items-center">
          <div className="w-0.5 h-4 bg-white/20" />
          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white/55">2a</div>
        </div>
      </div>
    ),
  },
  {
    id: 'episodic',
    label: 'Episodic',
    description: 'Self-contained chapters or episodes that form a larger collection.',
    example: 'Anthology, series, thematic collections',
    icon: Layers,
    visual: (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/60">
              {n}
            </div>
          ))}
        </div>
        <div className="text-[10px] text-white/55 text-center">Independent episodes</div>
      </div>
    ),
  },
];

export function StoryStructureStep({
  onNext,
  onBack,
  onSaveDraft,
  initialData,
}: StoryStructureStepProps) {
  const reducedMotion = prefersReducedMotion();
  
  const [selectedStructure, setSelectedStructure] = useState<'linear' | 'branching' | 'episodic'>(
    initialData?.structureType || 'linear'
  );
  const [estimatedChapters, setEstimatedChapters] = useState<number>(
    initialData?.estimatedChapters || 3
  );

  const handleAutoSave = () => {
    onSaveDraft({
      structureType: selectedStructure,
      estimatedChapters,
    });
  };

  const handleStructureSelect = (structure: 'linear' | 'branching' | 'episodic') => {
    setSelectedStructure(structure);
    setTimeout(handleAutoSave, 300);
  };

  const handleNext = () => {
    onNext({
      structureType: selectedStructure,
      estimatedChapters,
    });
  };

  return (
    <div className="min-h-dvh bg-black text-white pb-32">
      {/* Header */}
      <motion.div
        variants={!reducedMotion ? VARIANTS.fadeInDown : undefined}
        initial="initial"
        animate="animate"
        transition={TRANSITIONS.reveal}
        className="px-5 pt-8 pb-6 border-b border-white/10"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs tracking-widest uppercase text-white/55">Step 2 of 5</span>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <span className="text-xs tracking-widest uppercase text-white/60">Story Structure</span>
        </div>
        <h1 className="text-2xl font-light tracking-wide mb-2">Narrative Shape</h1>
        <p className="text-sm text-white/60 leading-relaxed">
          How will your story unfold? You can adjust this later.
        </p>
      </motion.div>

      {/* Structure Options */}
      <div className="px-5 py-6 space-y-4">
        {STRUCTURE_OPTIONS.map((option, index) => {
          const isSelected = selectedStructure === option.id;
          const Icon = option.icon;
          
          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleStructureSelect(option.id)}
              variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
              initial="initial"
              animate="animate"
              transition={{ ...TRANSITIONS.organic, delay: 0.1 * index }}
              whileHover={!reducedMotion ? { scale: 1.01 } : undefined}
              whileTap={!reducedMotion ? { scale: 0.99 } : undefined}
              className={`w-full text-left p-5 rounded-lg border transition-all duration-300 ${
                isSelected
                  ? 'bg-white/10 border-white/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'bg-white border-white'
                      : 'bg-white/5 border-white/20'
                  }`}>
                    <Icon 
                      className={isSelected ? 'text-black' : 'text-white/60'} 
                      strokeWidth={1.5} 
                      size={18} 
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-light tracking-wide mb-1">{option.label}</h3>
                    <p className="text-xs text-white/55">{option.example}</p>
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-white bg-white' : 'border-white/30'
                }`}>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-black"
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                {option.description}
              </p>

              {/* Visual */}
              <div className="pt-4 border-t border-white/5 flex justify-center">
                {option.visual}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Estimated Chapters */}
      <motion.div
        variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
        initial="initial"
        animate="animate"
        transition={{ ...TRANSITIONS.organic, delay: 0.4 }}
        className="px-5 py-6"
      >
        <div className="mb-4">
          <label className="text-sm tracking-wide text-white/80 mb-2 block">
            Estimated Chapters
          </label>
          <p className="text-xs text-white/55 leading-relaxed mb-4">
            A rough guide to help you plan. This can change as your story develops.
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min="1"
            max="12"
            value={estimatedChapters}
            onChange={(e) => {
              setEstimatedChapters(Number(e.target.value));
              setTimeout(handleAutoSave, 300);
            }}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer"
          />
          
          {/* Value Display */}
          <div className="flex justify-between mt-3">
            <span className="text-xs text-white/55">1 chapter</span>
            <span className="text-sm text-white font-medium">{estimatedChapters} chapters</span>
            <span className="text-xs text-white/55">12 chapters</span>
          </div>
        </div>
      </motion.div>

      {/* Helper Note */}
      <motion.div
        variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
        initial="initial"
        animate="animate"
        transition={{ ...TRANSITIONS.organic, delay: 0.5 }}
        className="px-5 py-4"
      >
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-xs text-white/60 leading-relaxed">
            <strong className="text-white/80">Note:</strong> Structure is a guide, not a constraint. 
            Your story can evolve organically as you create.
          </p>
        </div>
      </motion.div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-5">
        <div className="max-w-(--seen-content-max) mx-auto flex items-center justify-between">
          {/* Back button */}
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={!reducedMotion ? { scale: 1.02 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
            className="flex items-center gap-2 px-5 py-3 text-sm tracking-wide text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            <span>Back</span>
          </motion.button>

          {/* Next button */}
          <motion.button
            type="button"
            onClick={handleNext}
            whileHover={!reducedMotion ? { scale: 1.02 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black text-sm tracking-wide font-medium hover:bg-white/90 transition-all"
          >
            <span>Next: Chapters</span>
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
