import { motion } from "motion/react";
import { ArrowLeft, Globe, RotateCcw, MessageCircle, TrendingUp } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

interface StoryInsight {
  storyWorldId: string;
  storyTitle: string;
  languagesUsed: { language: string; percentage: number }[];
  mostRevisitedChapter: { title: string; signal: string };
  commonExitPoints: { chapter: string; signal: string }[];
  responseTypes: { type: string; signal: string }[];
  qualitativeSummary: {
    en: string;
    fr: string;
    es: string;
  };
}

interface CreatorInsightsScreenProps {
  onClose: () => void;
  insights: StoryInsight;
}

export function CreatorInsightsScreen({
  onClose,
  insights
}: CreatorInsightsScreenProps) {
  const { state } = useStoryState();

  const getText = (text: { en: string; fr: string; es: string }) => {
    return text[state.language] || text.en;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/5">
          <div className="flex items-center justify-between p-5 pt-8">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-base tracking-tight text-white">
              {state.language === 'en' ? 'Story Insights' : state.language === 'fr' ? 'Aperçus de l\'Histoire' : 'Perspectivas de la Historia'}
            </h2>
            <div className="w-10" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-12">
          {/* Story header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 block">
              {state.language === 'en' ? 'Your Story' : state.language === 'fr' ? 'Votre Histoire' : 'Tu Historia'}
            </span>
            <h1 className="text-2xl tracking-tight text-white mb-4">
              {insights.storyTitle}
            </h1>
            <p className="text-sm text-white/50 leading-relaxed">
              {state.language === 'en' 
                ? 'These insights reveal how audiences experience your story. No metrics—just signals.'
                : state.language === 'fr'
                ? 'Ces aperçus révèlent comment le public vit votre histoire. Pas de métriques—juste des signaux.'
                : 'Estas perspectivas revelan cómo las audiencias experimentan tu historia. Sin métricas—solo señales.'
              }
            </p>
          </motion.div>

          {/* Qualitative summary */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-300" />
              <h3 className="text-sm tracking-wider uppercase text-blue-200">
                {state.language === 'en' ? 'Overall Signal' : state.language === 'fr' ? 'Signal Global' : 'Señal General'}
              </h3>
            </div>
            <p className="text-base text-white/90 leading-relaxed">
              {getText(insights.qualitativeSummary)}
            </p>
          </motion.section>

          {/* Languages used */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-white/40" />
              <h3 className="text-sm tracking-wider uppercase text-white/40">
                {state.language === 'en' ? 'Languages Experienced' : state.language === 'fr' ? 'Langues Expérimentées' : 'Idiomas Experimentados'}
              </h3>
            </div>

            <div className="space-y-3">
              {insights.languagesUsed.map((lang, index) => (
                <motion.div
                  key={lang.language}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white uppercase tracking-wider">
                      {lang.language}
                    </span>
                    <span className="text-xs text-white/40">
                      {lang.percentage > 60 
                        ? (state.language === 'en' ? 'Most common' : state.language === 'fr' ? 'Plus courant' : 'Más común')
                        : lang.percentage > 30
                        ? (state.language === 'en' ? 'Common' : state.language === 'fr' ? 'Courant' : 'Común')
                        : (state.language === 'en' ? 'Present' : state.language === 'fr' ? 'Présent' : 'Presente')
                      }
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lang.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Most revisited chapter */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-white/40" />
              <h3 className="text-sm tracking-wider uppercase text-white/40">
                {state.language === 'en' ? 'Most Revisited' : state.language === 'fr' ? 'Plus Revisité' : 'Más Revisitado'}
              </h3>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-base text-white mb-2">
                {insights.mostRevisitedChapter.title}
              </h4>
              <p className="text-sm text-white/60 leading-relaxed">
                {insights.mostRevisitedChapter.signal}
              </p>
            </div>
          </motion.section>

          {/* Common exit points */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-sm tracking-wider uppercase text-white/40">
              {state.language === 'en' ? 'Journey Patterns' : state.language === 'fr' ? 'Modèles de Voyage' : 'Patrones de Viaje'}
            </h3>

            <div className="space-y-3">
              {insights.commonExitPoints.map((point, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-white/60">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm text-white mb-1">
                        {point.chapter}
                      </h4>
                      <p className="text-xs text-white/50">
                        {point.signal}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Response types */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-white/40" />
              <h3 className="text-sm tracking-wider uppercase text-white/40">
                {state.language === 'en' ? 'Community Voices' : state.language === 'fr' ? 'Voix de la Communauté' : 'Voces de la Comunidad'}
              </h3>
            </div>

            <div className="space-y-3">
              {insights.responseTypes.map((response, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white capitalize">
                      {response.type}
                    </span>
                  </div>
                  <p className="text-xs text-white/50">
                    {response.signal}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Ethics note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="pt-8 border-t border-white/5"
          >
            <p className="text-xs text-white/30 leading-relaxed">
              {state.language === 'en' 
                ? "These insights are qualitative and language-based. We don't track individual behavior, viewing time, or engagement scores. This preserves audience privacy while giving you meaningful creative signals."
                : state.language === 'fr'
                ? 'Ces aperçus sont qualitatifs et basés sur le langage. Nous ne suivons pas le comportement individuel, le temps de visionnage ou les scores d\'engagement. Cela préserve la confidentialité de l\'audience tout en vous donnant des signaux créatifs significatifs.'
                : 'Estas perspectivas son cualitativas y basadas en el lenguaje. No rastreamos el comportamiento individual, el tiempo de visualización ni las puntuaciones de participación. Esto preserva la privacidad de la audiencia mientras te brinda señales creativas significativas.'
              }
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
