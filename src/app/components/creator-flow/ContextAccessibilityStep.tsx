import { motion } from "motion/react";
import { useState } from "react";
import { 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  FileText, 
  Subtitles,
  Volume2,
  Eye,
  Globe,
  Plus,
  X
} from "lucide-react";
import { TRANSITIONS, VARIANTS, prefersReducedMotion } from "../../utils/motion";

interface ContextAccessibilityStepProps {
  onNext: (data: ContextAccessibilityData) => void;
  onBack: () => void;
  onSaveDraft: (data: Partial<ContextAccessibilityData>) => void;
  initialData?: Partial<ContextAccessibilityData>;
  storyLanguages: Array<'en' | 'fr' | 'es'>;
}

export interface ContextCard {
  id: string;
  type: 'cultural' | 'historical' | 'institutional';
  title: string;
  content: string;
}

export interface ContextAccessibilityData {
  contextCards: ContextCard[];
  hasCaptions: boolean;
  hasTranscripts: boolean;
  /** Optional content notes shown to listeners before the story starts. */
  contentWarnings?: string[];
  languageNotes: Record<string, string>; // language code -> notes
  accessibilityConfirmed: boolean;
}

export const CONTENT_WARNING_OPTIONS = [
  'Violence',
  'Racism or discrimination',
  'Grief or loss',
  'Strong language',
  'Difficult historical events',
];

const CONTEXT_TYPES = [
  { 
    value: 'cultural', 
    label: 'Cultural Context', 
    description: 'Explain cultural significance, traditions, or protocols',
    icon: Globe 
  },
  { 
    value: 'historical', 
    label: 'Historical Context', 
    description: 'Provide historical background or timeline',
    icon: BookOpen 
  },
  { 
    value: 'institutional', 
    label: 'Institutional Context', 
    description: 'Cite sources, archives, or institutional partnerships',
    icon: FileText 
  },
] as const;

export function ContextAccessibilityStep({
  onNext,
  onBack,
  onSaveDraft,
  initialData,
  storyLanguages,
}: ContextAccessibilityStepProps) {
  const reducedMotion = prefersReducedMotion();
  
  const [contextCards, setContextCards] = useState<ContextCard[]>(initialData?.contextCards || []);
  const [hasCaptions, setHasCaptions] = useState(initialData?.hasCaptions || false);
  const [hasTranscripts, setHasTranscripts] = useState(initialData?.hasTranscripts || false);
  const [contentWarnings, setContentWarnings] = useState<string[]>(initialData?.contentWarnings || []);
  const [customWarning, setCustomWarning] = useState('');
  const [languageNotes, setLanguageNotes] = useState<Record<string, string>>(
    initialData?.languageNotes || {}
  );
  const [accessibilityConfirmed, setAccessibilityConfirmed] = useState(
    initialData?.accessibilityConfirmed || false
  );
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardType, setNewCardType] = useState<'cultural' | 'historical' | 'institutional'>('cultural');

  const handleAutoSave = () => {
    onSaveDraft({
      contextCards,
      hasCaptions,
      hasTranscripts,
      contentWarnings,
      languageNotes,
      accessibilityConfirmed,
    });
  };

  const toggleWarning = (w: string) => {
    setContentWarnings(prev => (prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]));
    setTimeout(handleAutoSave, 300);
  };
  const addCustomWarning = () => {
    const w = customWarning.trim();
    if (w && !contentWarnings.includes(w)) setContentWarnings(prev => [...prev, w]);
    setCustomWarning('');
    setTimeout(handleAutoSave, 300);
  };

  const addContextCard = () => {
    const newCard: ContextCard = {
      id: Date.now().toString(),
      type: newCardType,
      title: '',
      content: '',
    };
    setContextCards([...contextCards, newCard]);
    setShowAddCard(false);
    setTimeout(handleAutoSave, 300);
  };

  const updateContextCard = (id: string, updates: Partial<ContextCard>) => {
    setContextCards(contextCards.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
    setTimeout(handleAutoSave, 500);
  };

  const deleteContextCard = (id: string) => {
    setContextCards(contextCards.filter(card => card.id !== id));
    setTimeout(handleAutoSave, 300);
  };

  const updateLanguageNote = (lang: string, note: string) => {
    setLanguageNotes({ ...languageNotes, [lang]: note });
    setTimeout(handleAutoSave, 500);
  };

  const canProceed = accessibilityConfirmed;

  const handleNext = () => {
    if (canProceed) {
      onNext({
        contextCards,
        hasCaptions,
        hasTranscripts,
        contentWarnings,
        languageNotes,
        accessibilityConfirmed,
      });
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
          <span className="text-xs tracking-widest uppercase text-white/55">Step 4 of 5</span>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <span className="text-xs tracking-widest uppercase text-white/60">Context & Accessibility</span>
        </div>
        <h1 className="text-2xl font-light tracking-wide mb-2">Protect Meaning & Access</h1>
        <p className="text-sm text-white/60 leading-relaxed">
          Add context to preserve cultural integrity and ensure your story is accessible.
        </p>
      </motion.div>

      {/* Context Cards Section */}
      <div className="px-5 py-6">
        <div className="mb-4">
          <h2 className="text-base font-light tracking-wide mb-2">Context Cards</h2>
          <p className="text-xs text-white/55 leading-relaxed">
            Optional cards that provide deeper understanding. These appear alongside your story.
          </p>
        </div>

        {/* Existing Context Cards */}
        <div className="space-y-3 mb-3">
          {contextCards.map((card, index) => {
            const cardType = CONTEXT_TYPES.find(t => t.value === card.type);
            const Icon = cardType?.icon || FileText;
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...TRANSITIONS.organic, delay: index * 0.05 }}
                className="p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs tracking-wider uppercase text-white/55">
                      {cardType?.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteContextCard(card.id)}
                    className="text-white/55 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>

                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => updateContextCard(card.id, { title: e.target.value })}
                  placeholder="Card title"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/55 focus:border-white/30 focus:outline-none mb-2"
                />

                <textarea
                  value={card.content}
                  onChange={(e) => updateContextCard(card.id, { content: e.target.value })}
                  placeholder="Explain the context..."
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/55 focus:border-white/30 focus:outline-none resize-none"
                  rows={3}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Add Context Card */}
        {!showAddCard ? (
          <button
            type="button"
            onClick={() => setShowAddCard(true)}
            className="w-full p-3 border-2 border-dashed border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-white/60 hover:text-white"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm tracking-wide">Add Context Card</span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-white/5 border border-white/10 rounded-lg"
          >
            <div className="mb-3">
              <span className="text-xs tracking-wider uppercase text-white/60 block mb-2">
                Choose Context Type
              </span>
              <div className="space-y-2">
                {CONTEXT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = newCardType === type.value;
                  
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNewCardType(type.value)}
                      className={`w-full p-3 rounded border transition-all text-left ${
                        isSelected
                          ? 'bg-white/10 border-white/30'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                          <div className="text-sm text-white mb-0.5">{type.label}</div>
                          <div className="text-xs text-white/55">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddCard(false)}
                className="flex-1 px-4 py-2 border border-white/10 rounded text-xs text-white/60 hover:text-white hover:border-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addContextCard}
                className="flex-1 px-4 py-2 bg-white text-black rounded text-xs font-medium hover:bg-white/90 transition-all"
              >
                Create Card
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Content notes (optional) */}
      <div className="px-5 py-6 border-t border-white/10">
        <h2 className="text-base font-light tracking-wide mb-2">Content notes <span className="text-xs uppercase tracking-wider text-white/60 ml-1">Optional</span></h2>
        <p id="cw-help" className="text-xs text-white/60 leading-relaxed mb-3">
          If your story deals with difficult material, tell listeners before it starts. They see this note on the story page before they press Start reading. Skip it if it does not apply.
        </p>
        <div role="group" aria-labelledby="cw-help" className="flex flex-wrap gap-2">
          {[...CONTENT_WARNING_OPTIONS, ...contentWarnings.filter(w => !CONTENT_WARNING_OPTIONS.includes(w))].map(w => {
            const on = contentWarnings.includes(w);
            return (
              <button
                key={w}
                type="button"
                aria-pressed={on}
                onClick={() => toggleWarning(w)}
                className={`px-3 min-h-11 text-xs rounded-lg border transition-colors ${on ? 'bg-white text-black border-white' : 'bg-white/5 text-white/80 border-white/15 hover:border-white/30'}`}
              >
                {w}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <label className="flex-1">
            <span className="sr-only">Add your own content note</span>
            <input
              type="text"
              value={customWarning}
              maxLength={60}
              onChange={e => setCustomWarning(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomWarning(); } }}
              placeholder="Add your own"
              className="w-full min-h-11 bg-white/5 border border-white/15 rounded-lg px-3 text-sm text-white placeholder:text-white/55 focus:border-white/40 focus:outline-none"
            />
          </label>
          <button type="button" onClick={addCustomWarning} disabled={!customWarning.trim()} className="min-h-11 px-4 rounded-lg border border-white/20 text-sm text-white disabled:opacity-40">Add</button>
        </div>
      </div>

      {/* Accessibility Checklist */}
      <div className="px-5 py-6 border-t border-white/10">
        <div className="mb-4">
          <h2 className="text-base font-light tracking-wide mb-2">Accessibility</h2>
          <p className="text-xs text-white/55 leading-relaxed">
            Ensure your story can be experienced by all audiences.
          </p>
        </div>

        <div className="space-y-3">
          {/* Captions */}
          <motion.button
            type="button"
            onClick={() => {
              setHasCaptions(!hasCaptions);
              setTimeout(handleAutoSave, 300);
            }}
            whileHover={!reducedMotion ? { x: 4 } : undefined}
            className={`w-full p-4 rounded-lg border transition-all text-left ${
              hasCaptions
                ? 'bg-white/10 border-white/30'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                hasCaptions ? 'border-white bg-white' : 'border-white/30'
              }`}>
                {hasCaptions && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-sm bg-black"
                  />
                )}
              </div>
              <Subtitles className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              <div className="flex-1">
                <div className="text-sm text-white">Captions & Subtitles</div>
                <div className="text-xs text-white/55">For video and audio content</div>
              </div>
            </div>
          </motion.button>

          {/* Transcripts */}
          <motion.button
            type="button"
            onClick={() => {
              setHasTranscripts(!hasTranscripts);
              setTimeout(handleAutoSave, 300);
            }}
            whileHover={!reducedMotion ? { x: 4 } : undefined}
            className={`w-full p-4 rounded-lg border transition-all text-left ${
              hasTranscripts
                ? 'bg-white/10 border-white/30'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                hasTranscripts ? 'border-white bg-white' : 'border-white/30'
              }`}>
                {hasTranscripts && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-sm bg-black"
                  />
                )}
              </div>
              <FileText className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              <div className="flex-1">
                <div className="text-sm text-white">Full Transcripts</div>
                <div className="text-xs text-white/55">Text version of all audio</div>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Language-Specific Notes */}
      {storyLanguages.length > 1 && (
        <div className="px-5 py-6 border-t border-white/10">
          <div className="mb-4">
            <h2 className="text-base font-light tracking-wide mb-2">Language Notes</h2>
            <p className="text-xs text-white/55 leading-relaxed">
              Add any language-specific context or translation notes.
            </p>
          </div>

          <div className="space-y-3">
            {storyLanguages.map((lang) => (
              <div key={lang}>
                <label className="block">
                  <span className="text-xs tracking-wider uppercase text-white/60 mb-2 block">
                    {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'Español'}
                  </span>
                  <textarea
                    value={languageNotes[lang] || ''}
                    onChange={(e) => updateLanguageNote(lang, e.target.value)}
                    placeholder="Optional translation notes or language context..."
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/55 focus:border-white/30 focus:outline-none resize-none"
                    rows={2}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation */}
      <div className="px-5 py-6 border-t border-white/10">
        <motion.button
          type="button"
          onClick={() => {
            setAccessibilityConfirmed(!accessibilityConfirmed);
            setTimeout(handleAutoSave, 300);
          }}
          whileHover={!reducedMotion ? { x: 4 } : undefined}
          className={`w-full p-4 rounded-lg border transition-all text-left ${
            accessibilityConfirmed
              ? 'bg-white/10 border-white/30'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
              accessibilityConfirmed ? 'border-white bg-white' : 'border-white/30'
            }`}>
              {accessibilityConfirmed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-sm bg-black"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm text-white mb-1">I confirm this story includes accessibility features</div>
              <div className="text-xs text-white/55 leading-relaxed">
                Your story should be accessible to audiences with different needs. 
                We'll help you add missing features before publishing.
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-5">
        <div className="max-w-(--seen-content-max) mx-auto flex items-center justify-between">
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
            <span>Next: Preview</span>
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
