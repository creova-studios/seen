import { motion } from "motion/react";
import { ArrowLeft, Heart, Globe, Users, Shield } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAppNav } from "../navigation/AppNav";

interface AboutScreenProps {
  onClose: () => void;
}

export function AboutScreen({ onClose }: AboutScreenProps) {
  const { state } = useStoryState();
  const nav = useAppNav();

  const getText = (key: string, type: 'title' | 'body') => {
    const content: Record<string, Record<string, { title: string; body: string }>> = {
      manifesto: {
        en: {
          title: "What is SEEN?",
          body: "SEEN is a cultural operating system for interactive storytelling. We blend music, film, fashion, and community voices into immersive experiences that center emotion over metrics, consent over extraction, and narrative depth over viral loops."
        },
        fr: {
          title: "Qu'est-ce que SEEN ?",
          body: "SEEN est un système d'exploitation culturel pour la narration interactive. Nous mélangeons musique, film, mode et voix communautaires dans des expériences immersives qui privilégient l'émotion plutôt que les métriques, le consentement plutôt que l'extraction, et la profondeur narrative plutôt que les boucles virales."
        },
        es: {
          title: "¿Qué es SEEN?",
          body: "SEEN es un sistema operativo cultural para la narración interactiva. Mezclamos música, cine, moda y voces comunitarias en experiencias inmersivas que priorizan la emoción sobre las métrics, el consentimiento sobre la extracción y la profundidad narrativa sobre los bucles virales."
        }
      },
      principles: {
        en: {
          title: "Our Principles",
          body: "We believe in privacy-first design, multilingual accessibility, and shared governance. Stories are not content. Audiences are not users. Engagement is not a number."
        },
        fr: {
          title: "Nos Principes",
          body: "Nous croyons en la conception axée sur la confidentialité, l'accessibilité multilingue et la gouvernance partagée. Les histoires ne sont pas du contenu. Les publics ne sont pas des utilisateurs. L'engagement n'est pas un chiffre."
        },
        es: {
          title: "Nuestros Principios",
          body: "Creemos en el diseño centrado en la privacidad, la accesibilidad multilingüe y la gobernanza compartida. Las historias no son contenido. Las audiencias no son usuarios. El compromiso no es un número."
        }
      },
      creova: {
        en: {
          title: "CREOVA",
          body: "CREOVA is the studio behind SEEN. We build tools for cultural workers who refuse to compromise narrative integrity for algorithmic favor. Founded on the belief that technology should serve storytellers, not platforms."
        },
        fr: {
          title: "CREOVA",
          body: "CREOVA est le studio derrière SEEN. Nous créons des outils pour les travailleurs culturels qui refusent de compromettre l'intégrité narrative en faveur de l'algorithme. Fondé sur la conviction que la technologie doit servir les conteurs, pas les plateformes."
        },
        es: {
          title: "CREOVA",
          body: "CREOVA es el estudio detrás de SEEN. Construimos herramientas para trabajadores culturales que se niegan a comprometer la integridad narrativa por el favor algorítmico. Fundado en la creencia de que la tecnología debe servir a los narradores, no a las plataformas."
        }
      },
      funding: {
        en: {
          title: "Our Commitment",
          body: "We never sell user data, never surveil behavior, and never optimize for addiction. Our business model centers creator sustainability, not extraction."
        },
        fr: {
          title: "Notre Engagement",
          body: "Nous ne vendons jamais de données d'utilisateurs, ne surveillons jamais le comportement et n'optimisons jamais pour la dépendance. Notre modèle économique se concentre sur la durabilité des créateurs, pas sur l'extraction."
        },
        es: {
          title: "Nuestro Compromiso",
          body: "Nunca vendemos datos de usuarios, nunca vigilamos el comportamiento y nunca optimizamos para la adicción. Nuestro modelo de negocio se centra en la sostenibilidad del creador, no en la extracción."
        }
      }
    };
    return content[key]?.[state.language]?.[type] || content[key]?.en?.[type] || '';
  };

  const principles = [
    {
      icon: Heart,
      label: state.language === 'en' ? 'Emotion Over Metrics' : state.language === 'fr' ? 'Émotion Sur les Métriques' : 'Emoción Sobre Métricas',
      color: 'red'
    },
    {
      icon: Globe,
      label: state.language === 'en' ? 'Multilingual First' : state.language === 'fr' ? 'Multilingue d\'Abord' : 'Multilingüe Primero',
      color: 'blue'
    },
    {
      icon: Users,
      label: state.language === 'en' ? 'Community Co-Creation' : state.language === 'fr' ? 'Co-Création Communautaire' : 'Co-Creación Comunitaria',
      color: 'purple'
    },
    {
      icon: Shield,
      label: state.language === 'en' ? 'Privacy First' : state.language === 'fr' ? 'Confidentialité d\'Abord' : 'Privacidad Primero',
      color: 'green'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-auto"
    >
      <div className="min-h-full max-w-(--seen-content-max) mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/5">
          <div className="flex items-center justify-between p-5 pt-8">
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="text-center">
              <h2 className="text-base tracking-tight text-white">
                {state.language === 'en' ? 'About' : state.language === 'fr' ? 'À Propos' : 'Acerca de'}
              </h2>
            </div>
            <div className="w-10" />
          </div>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 px-6 py-16 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white/80" />
            </div>
            <h1 className="text-3xl tracking-tight text-white mb-4 leading-tight">
              SEEN
            </h1>
            <p className="text-sm tracking-[0.3em] uppercase text-white/55">
              by CREOVA
            </p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-12">
          {/* Manifesto */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg tracking-tight text-white">
              {getText('manifesto', 'title')}
            </h3>
            <p className="text-base text-white/70 leading-relaxed">
              {getText('manifesto', 'body')}
            </p>
          </motion.section>

          {/* Principles grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg tracking-tight text-white">
              {getText('principles', 'title')}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              {getText('principles', 'body')}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {principles.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-5 rounded-xl bg-white/5 border border-white/10 text-center"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-${principle.color}-500/20 border border-${principle.color}-400/30 flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`w-6 h-6 text-${principle.color}-300`} />
                    </div>
                    <p className="text-xs text-white/70 leading-snug">
                      {principle.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* CREOVA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <h3 className="text-lg tracking-tight text-white">
              {getText('creova', 'title')}
            </h3>
            <p className="text-base text-white/70 leading-relaxed">
              {getText('creova', 'body')}
            </p>
          </motion.section>

          {/* Our Commitment (ethics & privacy) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <h3 className="text-lg tracking-tight text-white">
              {getText('funding', 'title')}
            </h3>
            <p className="text-base text-white/70 leading-relaxed">
              {getText('funding', 'body')}
            </p>
          </motion.section>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="py-8"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10">
              <p className="text-base text-white/90 leading-relaxed italic text-center">
                {state.language === 'en' 
                  ? '"Stories are not content. Audiences are not users. Engagement is not a number."'
                  : state.language === 'fr'
                  ? '"Les histoires ne sont pas du contenu. Les publics ne sont pas des utilisateurs. L\'engagement n\'est pas un chiffre."'
                  : '"Las historias no son contenido. Las audiencias no son usuarios. El compromiso no es un número."'
                }
              </p>
            </div>
          </motion.div>


          {/* Version footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="pt-12 pb-8 text-center"
          >
            <p className="text-xs text-white/55 mb-2">SEEN v1.0.0</p>
            <button type="button" onClick={() => nav.go("legal")} className="min-h-11 px-3 text-xs text-white/70 underline underline-offset-2 hover:text-white">Terms &amp; privacy (draft)</button>
            <p className="text-xs text-white/55 leading-relaxed max-w-[300px] mx-auto">
              {state.language === 'en' 
                ? 'Made with care for cultural workers, storytellers, and communities who believe in narrative as resistance.'
                : state.language === 'fr'
                ? 'Fait avec soin pour les travailleurs culturels, les conteurs et les communautés qui croient en la narration comme résistance.'
                : 'Hecho con cuidado para trabajadores culturales, narradores y comunidades que creen en la narrativa como resistencia.'
              }
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}