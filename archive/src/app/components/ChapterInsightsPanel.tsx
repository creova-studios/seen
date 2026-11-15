import { motion } from "motion/react";
import { RotateCcw, MessageCircle, Globe, TrendingDown, Eye } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

interface ChapterInsight {
  chapterId: string;
  chapterTitle: string;
  qualitativeSummary: {
    en: string;
    fr: string;
    es: string;
  };
  revisitFrequency: {
    signal: string;
    description: {
      en: string;
      fr: string;
      es: string;
    };
  };
  responseTypes: Array<{
    type: "text" | "audio" | "image";
    signal: string;
  }>;
  languageUsage: Array<{
    language: string;
    signal: string;
  }>;
  exitSignal?: {
    en: string;
    fr: string;
    es: string;
  };
}

interface ChapterInsightsPanelProps {
  insight: ChapterInsight;
}

export function ChapterInsightsPanel({ insight }: ChapterInsightsPanelProps) {
  const { state } = useStoryState();

  const getText = (text: { en: string; fr: string; es: string }) => {
    return text[state.language] || text.en;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-white/40" />
            <span className="text-xs tracking-[0.3em] uppercase text-white/40">
              {state.language === 'en' ? 'Chapter Insights' : state.language === 'fr' ? 'Aperçus du Chapitre' : 'Perspectivas del Capítulo'}
            </span>
          </div>
          <h3 className="text-lg tracking-tight text-white">
            {insight.chapterTitle}
          </h3>
        </div>
      </div>

      {/* Overall signal */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
        <p className="text-sm text-white/80 leading-relaxed">
          {getText(insight.qualitativeSummary)}
        </p>
      </div>

      {/* Revisit frequency */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <RotateCcw className="w-4 h-4 text-white/40" />
          <h4 className="text-sm tracking-wider uppercase text-white/40">
            {state.language === 'en' ? 'Revisit Pattern' : state.language === 'fr' ? 'Modèle de Revisite' : 'Patrón de Revisita'}
          </h4>
        </div>
        <div className="mb-2">
          <span className="text-sm text-white font-medium">
            {insight.revisitFrequency.signal}
          </span>
        </div>
        <p className="text-xs text-white/50 leading-relaxed">
          {getText(insight.revisitFrequency.description)}
        </p>
      </div>

      {/* Response types */}
      {insight.responseTypes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-white/40" />
            <h4 className="text-sm tracking-wider uppercase text-white/40">
              {state.language === 'en' ? 'Community Responses' : state.language === 'fr' ? 'Réponses de la Communauté' : 'Respuestas de la Comunidad'}
            </h4>
          </div>

          <div className="space-y-2">
            {insight.responseTypes.map((response, index) => {
              const typeColors = {
                text: "green",
                audio: "purple",
                image: "blue"
              };
              const color = typeColors[response.type];

              return (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 border border-${color}-400/30 flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xs text-white/70 capitalize">
                      {response.type[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-white/60 capitalize mb-0.5">
                      {response.type}
                    </div>
                    <div className="text-xs text-white/40">
                      {response.signal}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Language usage */}
      {insight.languageUsage.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-white/40" />
            <h4 className="text-sm tracking-wider uppercase text-white/40">
              {state.language === 'en' ? 'Languages' : state.language === 'fr' ? 'Langues' : 'Idiomas'}
            </h4>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {insight.languageUsage.map((lang, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-center"
              >
                <div className="text-sm text-white uppercase tracking-wider mb-1">
                  {lang.language}
                </div>
                <div className="text-xs text-white/40">
                  {lang.signal}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exit signal */}
      {insight.exitSignal && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-amber-300" />
            <span className="text-xs tracking-wider uppercase text-amber-200">
              {state.language === 'en' ? 'Exit Pattern' : state.language === 'fr' ? 'Modèle de Sortie' : 'Patrón de Salida'}
            </span>
          </div>
          <p className="text-sm text-amber-100/70 leading-relaxed">
            {getText(insight.exitSignal)}
          </p>
        </div>
      )}

      {/* Ethics note */}
      <div className="pt-4 border-t border-white/5">
        <p className="text-xs text-white/30 leading-relaxed">
          {state.language === 'en' 
            ? 'These insights are qualitative signals, not metrics. No individual behavior is tracked.'
            : state.language === 'fr'
            ? 'Ces aperçus sont des signaux qualitatifs, pas des métriques. Aucun comportement individuel n\'est suivi.'
            : 'Estas perspectivas son señales cualitativas, no métricas. No se rastrea ningún comportamiento individual.'
          }
        </p>
      </div>
    </motion.div>
  );
}
