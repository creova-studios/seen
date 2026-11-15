import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Mic, 
  Music, 
  Image as ImageIcon,
  Video,
  GripVertical,
  MoreVertical,
  Clock,
  CheckCircle2,
  Circle
} from "lucide-react";
import { TRANSITIONS, VARIANTS, prefersReducedMotion } from "../../utils/motion";

interface MediaChaptersStepProps {
  onNext: (data: MediaChaptersData) => void;
  onBack: () => void;
  onSaveDraft: (data: Partial<MediaChaptersData>) => void;
  initialData?: Partial<MediaChaptersData>;
  structureType: 'linear' | 'branching' | 'episodic';
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  text: string; // the actual narrative content readers see
  narration?: { file: string; duration: number };
  ambient?: { file: string };
  music?: { file: string };
  images?: string[];
  imageAlt?: string;
  imageDecorative?: boolean;
  video?: { file: string; duration: number };
  estimatedDuration: number; // in minutes
  completeness: number; // 0-100
}

export interface MediaChaptersData {
  chapters: Chapter[];
}

export function MediaChaptersStep({
  onNext,
  onBack,
  onSaveDraft,
  initialData,
  structureType,
}: MediaChaptersStepProps) {
  const reducedMotion = prefersReducedMotion();
  
  const [chapters, setChapters] = useState<Chapter[]>(
    initialData?.chapters || [
      {
        id: '1',
        title: '',
        description: '',
        text: '',
        estimatedDuration: 5,
        completeness: 0,
      },
    ]
  );
  const [expandedChapter, setExpandedChapter] = useState<string | null>('1');

  const handleAutoSave = () => {
    onSaveDraft({ chapters });
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: '',
      description: '',
      text: '',
      estimatedDuration: 5,
      completeness: 0,
    };
    setChapters([...chapters, newChapter]);
    setExpandedChapter(newChapter.id);
    setTimeout(handleAutoSave, 300);
  };

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    setChapters(chapters.map(ch => 
      ch.id === id ? { ...ch, ...updates } : ch
    ));
    setTimeout(handleAutoSave, 500);
  };

  const deleteChapter = (id: string) => {
    if (chapters.length > 1) {
      setChapters(chapters.filter(ch => ch.id !== id));
      setTimeout(handleAutoSave, 300);
    }
  };

  const calculateCompleteness = (chapter: Chapter): number => {
    let score = 0;
    if (chapter.title.trim()) score += 20;
    if (chapter.description.trim()) score += 15;
    if (chapter.text.trim()) score += 35;
    if (chapter.narration || chapter.music || chapter.ambient) score += 20;
    if (chapter.images?.length || chapter.video) score += 10;
    return score;
  };

  // An attached image needs a description, or an explicit "decorative" choice.
  const missingAlt = (ch: Chapter) => !!ch.images?.length && !ch.imageDecorative && !(ch.imageAlt ?? '').trim();
  const imagesDescribed = !chapters.some(missingAlt);
  const canProceed = chapters.some(ch => ch.title.trim() && ch.text.trim()) && imagesDescribed;

  const handleNext = () => {
    if (canProceed) {
      onNext({ chapters });
    }
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
          <span className="text-xs tracking-widest uppercase text-white/55">Step 3 of 5</span>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <span className="text-xs tracking-widest uppercase text-white/60">Media & Chapters</span>
        </div>
        <h1 className="text-2xl font-light tracking-wide mb-2">Build Your Story</h1>
        <p className="text-sm text-white/60 leading-relaxed">
          Create chapters and attach media. Progress is saved automatically.
        </p>
      </motion.div>

      {/* Chapters List */}
      <div className="px-5 py-6 space-y-3">
        <AnimatePresence mode="popLayout">
          {chapters.map((chapter, index) => {
            const isExpanded = expandedChapter === chapter.id;
            const completeness = calculateCompleteness(chapter);
            
            return (
              <motion.div
                key={chapter.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={TRANSITIONS.organic}
                className="border border-white/10 bg-white/5 rounded-lg overflow-hidden"
              >
                {/* Chapter Header */}
                <button
                  type="button"
                  onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                >
                  {/* Drag Handle */}
                  <GripVertical className="w-4 h-4 text-white/55 flex-shrink-0" strokeWidth={1.5} />

                  {/* Chapter Number & Status */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {completeness >= 100 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2} />
                      ) : (
                        <div className="relative w-5 h-5">
                          <Circle className="w-5 h-5 text-white/55" strokeWidth={2} />
                          <svg className="absolute inset-0 -rotate-90">
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 8}`}
                              strokeDashoffset={`${2 * Math.PI * 8 * (1 - completeness / 100)}`}
                              className="text-white/60"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {chapter.title ? (
                        <>
                          <h3 className="text-sm font-light tracking-wide truncate">
                            {chapter.title}
                          </h3>
                          <p className="text-xs text-white/55 truncate">
                            Chapter {index + 1} • {chapter.estimatedDuration} min
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-white/55">
                          Chapter {index + 1} • Untitled
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Completeness Badge */}
                  <div className="flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded ${
                      completeness >= 100 ? 'bg-green-500/10 text-green-500' :
                      completeness >= 50 ? 'bg-white/10 text-white/60' :
                      'bg-white/5 text-white/55'
                    }`}>
                      {completeness}%
                    </span>
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={TRANSITIONS.organic}
                      className="border-t border-white/10"
                    >
                      <div className="p-4 space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block mb-2">
                            <span className="text-xs tracking-wider uppercase text-white/60">Chapter Title</span>
                            <input
                              type="text"
                              value={chapter.title}
                              onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                              placeholder="Give this chapter a title"
                              className="mt-1.5 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/55 focus:border-white/30 focus:outline-none"
                            />
                          </label>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block mb-2">
                            <span className="text-xs tracking-wider uppercase text-white/60">Chapter Description</span>
                            <textarea
                              value={chapter.description}
                              onChange={(e) => updateChapter(chapter.id, { description: e.target.value })}
                              placeholder="What happens in this chapter?"
                              className="mt-1.5 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/55 focus:border-white/30 focus:outline-none resize-none"
                              rows={2}
                            />
                          </label>
                        </div>

                        {/* Chapter Text — the actual narrative content readers will see */}
                        <div>
                          <label className="block mb-2">
                            <span className="text-xs tracking-wider uppercase text-white/60">Chapter Text</span>
                            <textarea
                              value={chapter.text}
                              onChange={(e) => updateChapter(chapter.id, { text: e.target.value })}
                              placeholder="Write the story readers will actually read here..."
                              className="mt-1.5 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/55 focus:border-white/30 focus:outline-none resize-none"
                              rows={6}
                            />
                          </label>
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="block mb-2">
                            <span className="text-xs tracking-wider uppercase text-white/60">Estimated Duration (minutes)</span>
                            <input
                              type="number"
                              min="1"
                              max="60"
                              value={chapter.estimatedDuration}
                              onChange={(e) => updateChapter(chapter.id, { estimatedDuration: Number(e.target.value) })}
                              className="mt-1.5 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                            />
                          </label>
                        </div>

                        {/* Media Attachments */}
                        <div className="space-y-2">
                          <span className="text-xs tracking-wider uppercase text-white/60 block">Media</span>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {/* Narration — no file-upload backend exists yet, so this
                                accepts a hosted audio URL rather than being a dead button. */}
                            <button
                              type="button"
                              onClick={() => {
                                const url = window.prompt('Paste a hosted audio URL for narration:', chapter.narration?.file || '');
                                if (url) updateChapter(chapter.id, { narration: { file: url, duration: 0 } });
                              }}
                              className="p-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-white/20 transition-all text-left"
                            >
                              <Mic className={`w-4 h-4 mb-2 ${chapter.narration ? 'text-green-400' : 'text-white/60'}`} strokeWidth={1.5} />
                              <div className="text-xs text-white/80">Narration</div>
                              <div className="text-[10px] text-white/55">{chapter.narration ? 'Attached' : 'Add audio URL'}</div>
                            </button>

                            {/* Music */}
                            <button
                              type="button"
                              onClick={() => {
                                const url = window.prompt('Paste a hosted music/soundtrack URL:', chapter.music?.file || '');
                                if (url) updateChapter(chapter.id, { music: { file: url } });
                              }}
                              className="p-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-white/20 transition-all text-left"
                            >
                              <Music className={`w-4 h-4 mb-2 ${chapter.music ? 'text-green-400' : 'text-white/60'}`} strokeWidth={1.5} />
                              <div className="text-xs text-white/80">Music</div>
                              <div className="text-[10px] text-white/55">{chapter.music ? 'Attached' : 'Add soundtrack'}</div>
                            </button>

                            {/* Images */}
                            <button
                              type="button"
                              onClick={() => {
                                const url = window.prompt('Paste an image URL:', chapter.images?.[0] || '');
                                if (url) updateChapter(chapter.id, { images: [url] });
                              }}
                              className="p-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-white/20 transition-all text-left"
                            >
                              <ImageIcon className={`w-4 h-4 mb-2 ${chapter.images?.length ? 'text-green-400' : 'text-white/60'}`} strokeWidth={1.5} />
                              <div className="text-xs text-white/80">Images</div>
                              <div className="text-[10px] text-white/55">{chapter.images?.length ? 'Attached' : 'Add image URL'}</div>
                            </button>

                            {/* Video */}
                            <button
                              type="button"
                              onClick={() => {
                                const url = window.prompt('Paste a hosted video URL:', chapter.video?.file || '');
                                if (url) updateChapter(chapter.id, { video: { file: url, duration: 0 } });
                              }}
                              className="p-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-white/20 transition-all text-left"
                            >
                              <Video className={`w-4 h-4 mb-2 ${chapter.video ? 'text-green-400' : 'text-white/60'}`} strokeWidth={1.5} />
                              <div className="text-xs text-white/80">Video</div>
                              <div className="text-[10px] text-white/55">{chapter.video ? 'Attached' : 'Optional'}</div>
                            </button>
                          </div>
                        </div>

                        {/* Image description (alt text) */}
                        {chapter.images?.length ? (
                          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                            <label htmlFor={`alt-${chapter.id}`} className="block text-xs tracking-wider uppercase text-white/70 mb-1.5">
                              Describe this image for people who cannot see it
                            </label>
                            <textarea
                              id={`alt-${chapter.id}`}
                              value={chapter.imageAlt ?? ''}
                              disabled={!!chapter.imageDecorative}
                              onChange={(e) => updateChapter(chapter.id, { imageAlt: e.target.value })}
                              rows={2}
                              maxLength={250}
                              aria-describedby={`alt-help-${chapter.id}`}
                              aria-invalid={missingAlt(chapter)}
                              placeholder="e.g. A woman in a red coat stands on a harbour dock at dawn"
                              className="w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-sm text-white placeholder:text-white/55 focus:border-white/40 focus:outline-none disabled:opacity-50"
                            />
                            <p id={`alt-help-${chapter.id}`} className="text-xs text-white/60 mt-1.5">
                              Say what matters about the image in a sentence or two. Screen readers read this aloud.
                            </p>
                            <label className="mt-3 flex items-center gap-3 min-h-11 text-sm text-white/85 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!chapter.imageDecorative}
                                onChange={(e) => updateChapter(chapter.id, { imageDecorative: e.target.checked })}
                                className="w-5 h-5 accent-white"
                              />
                              This image is decorative (no description needed)
                            </label>
                            {missingAlt(chapter) && (
                              <p role="alert" className="text-xs text-red-300 mt-1">Add a description, or mark the image as decorative, to continue.</p>
                            )}
                          </div>
                        ) : null}

                        {/* Delete Chapter */}
                        {chapters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteChapter(chapter.id)}
                            className="w-full py-2 text-xs text-red-500/60 hover:text-red-500 transition-colors"
                          >
                            Delete Chapter
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add Chapter Button */}
        <motion.button
          type="button"
          onClick={addChapter}
          whileHover={!reducedMotion ? { scale: 1.01 } : undefined}
          whileTap={!reducedMotion ? { scale: 0.99 } : undefined}
          className="w-full p-4 border-2 border-dashed border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-white/60 hover:text-white"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm tracking-wide">Add Chapter</span>
        </motion.button>
      </div>

      {/* Helper Note */}
      <div className="px-5 py-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-xs text-white/60 leading-relaxed">
            <strong className="text-white/80">Tip:</strong> At least one chapter needs a title and chapter text to proceed.
            Media is optional and can be added later.
          </p>
        </div>
      </div>

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
            disabled={!canProceed}
            whileHover={!reducedMotion && canProceed ? { scale: 1.02 } : undefined}
            whileTap={!reducedMotion && canProceed ? { scale: 0.98 } : undefined}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm tracking-wide font-medium transition-all ${
              canProceed
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-white/10 text-white/55 cursor-not-allowed'
            }`}
          >
            <span>Next: Context</span>
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
