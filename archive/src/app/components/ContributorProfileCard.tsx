import { motion } from "motion/react";
import { GraduationCap, MapPin, Languages, Play, ExternalLink } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";

interface ContributorStory {
  id: string;
  title: string;
  thumbnailUrl: string;
  language: string;
}

interface ContributorProfileCardProps {
  contributorId: string;
  name: string;
  role: string; // e.g., "Student, Film Studies" or "Faculty, Indigenous Studies"
  institution: string;
  location?: string;
  avatarUrl?: string;
  bio: {
    en: string;
    fr: string;
    es: string;
  };
  languages: string[]; // e.g., ["EN", "FR", "Anishinaabemowin"]
  stories: ContributorStory[];
  onStoryClick: (storyId: string) => void;
  onProfileClick?: () => void;
}

export function ContributorProfileCard({
  contributorId,
  name,
  role,
  institution,
  location,
  avatarUrl,
  bio,
  languages,
  stories,
  onStoryClick,
  onProfileClick
}: ContributorProfileCardProps) {
  const { state } = useStoryState();

  const getText = (text: { en: string; fr: string; es: string }) => {
    return text[state.language] || text.en;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
    >
      {/* Header section */}
      <div className="p-6 space-y-4">
        {/* Avatar and name */}
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/10">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <span className="text-lg text-white/70 font-medium">
                  {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base text-white mb-1 truncate">
              {name}
            </h3>
            <p className="text-sm text-white/60 leading-snug">
              {role}
            </p>
            
            {/* Institution and location */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-white/40">
              <div className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                <span>{institution}</span>
              </div>
              {location && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{location}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {onProfileClick && (
            <button
              onClick={onProfileClick}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="View full profile"
            >
              <ExternalLink className="w-4 h-4 text-white/50" />
            </button>
          )}
        </div>

        {/* Languages */}
        <div className="flex items-center gap-2">
          <Languages className="w-3 h-3 text-white/30" />
          <div className="flex gap-1.5">
            {languages.map((lang, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/60"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
          {getText(bio)}
        </p>
      </div>

      {/* Stories section */}
      {stories.length > 0 && (
        <div className="border-t border-white/5">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-wider uppercase text-white/40">
                {state.language === 'en' ? 'Contributions' : state.language === 'fr' ? 'Contributions' : 'Contribuciones'}
              </span>
              <span className="text-xs text-white/30">
                {stories.length}
              </span>
            </div>

            {/* Story thumbnails */}
            <div className="grid grid-cols-3 gap-2">
              {stories.slice(0, 3).map((story, index) => (
                <motion.button
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onStoryClick(story.id)}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    src={story.thumbnailUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  
                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-3 h-3 text-black fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* Language badge */}
                  <div className="absolute top-1 right-1">
                    <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-xs text-white/90 uppercase">
                      {story.language}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* View all link */}
            {stories.length > 3 && (
              <button
                onClick={onProfileClick}
                className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                {state.language === 'en' 
                  ? `View all ${stories.length} stories`
                  : state.language === 'fr'
                  ? `Voir les ${stories.length} histoires`
                  : `Ver todas las ${stories.length} historias`
                }
              </button>
            )}
          </div>
        </div>
      )}

      {/* Institution partnership badge */}
      <div className="px-6 py-3 bg-blue-500/5 border-t border-blue-400/10">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
            <GraduationCap className="w-3 h-3 text-blue-300" />
          </div>
          <span className="text-xs text-blue-200/70">
            {state.language === 'en' 
              ? 'Institutional Partner'
              : state.language === 'fr'
              ? 'Partenaire Institutionnel'
              : 'Socio Institucional'
            }
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Compact version for grid layouts
export function ContributorProfileCardCompact({
  name,
  role,
  avatarUrl,
  storiesCount,
  onClick
}: {
  name: string;
  role: string;
  avatarUrl?: string;
  storiesCount: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <span className="text-sm text-white/70 font-medium">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm text-white truncate mb-0.5">
            {name}
          </h4>
          <p className="text-xs text-white/50 truncate">
            {role}
          </p>
        </div>

        <div className="text-xs text-white/30">
          {storiesCount}
        </div>
      </div>
    </motion.button>
  );
}
