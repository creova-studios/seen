/**
 * FOR YOU SCREEN
 * SEEN by CREOVA
 * 
 * Personalized feed based on user language, intent, and activity
 * NO hardcoded content - all data from queries
 */

import { storiesForInterests } from "../data/interests";
import { DemoModeNotice } from "./DemoModeNotice";
import { GuestBanner } from "../guest/GuestBanner";
import { InterestChips } from "./InterestChips";
import { PageTitle } from "./seen/primitives";
import { motion } from "motion/react";
import { useAppNav } from "../navigation/AppNav";
import { api } from "../services";
import { useResource } from "../hooks/useResource";
import { ContentCard } from "./ContentCard";
import { StoryCard } from "./StoryCard";
import { SectionHeader } from "./SectionHeader";
import { FeaturedHero, Rail, RailCard, VoicesToDiscover } from "./ForYouSections";
import { useStoryState } from "../contexts/StoryStateContext";
import { getLibraryStories } from "../data/storyService";
import { EmptyState } from "./EmptyState";
import { Play, TrendingUp, Music, Film, BookOpen, Archive, Folder, Users, Home, Compass, Library, User } from "lucide-react";
import type { ContentLanguage, UserIntent } from "../data/types";
import { getForYouFeed } from "../data/storyService";
import type { Language } from "../data/storyDatabase";

interface ForYouScreenProps {
  onStoryClick: (contentId: string) => void;
  onNavigate: (screen: string) => void;
  onSearch?: () => void;
  userIntent: UserIntent;
  language: ContentLanguage;
  isFirstVisit?: boolean;
}

/**
 * FOR YOU SECTION - PERSONALIZED FEED
 * 
 * Data Flow:
 * 1. Query personalized feed from storyService
 * 2. Display stories with multilingual support
 * 3. Show empty state if no content
 */
export function ForYouScreen({
  onStoryClick,
  onNavigate,
  onSearch,
  userIntent,
  language,
  isFirstVisit
}: ForYouScreenProps) {
  const { state: storyState, setInterests } = useStoryState();
  const interests = storyState.interests ?? [];
  const interestItems = interests.length > 0 ? storiesForInterests(interests, language as Language).slice(0, 8) : [];
  const continueItems = getLibraryStories(storyState.progressSnapshots, language as Language).inProgress.slice(0, 6);

  // Get personalized feed from story service
  const feedItems = getForYouFeed({
    language: language as Language,
    intent: userIntent,
    limit: 20,
  });
  

  // Separate content types
  const featuredAll = feedItems.filter(item => item.featured);
  const heroItem = featuredAll[0] ?? null;
  const featuredContent = featuredAll.slice(1, 3);
  const trendingContent = feedItems.filter(item => item.trending && !item.featured).slice(0, 3);
  const newContent = feedItems.filter(item => item.new && !item.featured && !item.trending).slice(0, 3);
  const allStories = feedItems.slice(0, 8);

  // Helper to get icon for content type
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'music':
        return <Music className="w-3 h-3" />;
      case 'story':
        return <BookOpen className="w-3 h-3" />;
      case 'film':
        return <Film className="w-3 h-3" />;
      case 'collection':
        return <Folder className="w-3 h-3" />;
      case 'archive':
        return <Archive className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Show empty state if no content
  if (feedItems.length === 0) {
    const emptyStateText = {
      en: { title: 'No Stories Available', message: 'Check back soon for new content.' },
      fr: { title: 'Aucune Histoire Disponible', message: 'Revenez bientôt pour du nouveau contenu.' },
      es: { title: 'No Hay Historias Disponibles', message: 'Vuelva pronto para contenido nuevo.' },
    };
    const text = emptyStateText[language as Language] || emptyStateText.en;
    
    return (
      <div className="min-h-dvh bg-black">
        <div className="pt-header pb-clearance px-gutter"><DemoModeNotice /><GuestBanner />
          <EmptyState
            icon="Compass"
            title={text.title}
            message={text.message}
            actionLabel="Explore"
            onAction={() => onNavigate('explore')}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-dvh bg-black"
    >

      {/* Main Content */}
      <main className={`${heroItem ? "pt-0" : "pt-header"} pb-clearance px-gutter max-w-(--seen-content-max) mx-auto`}>
        {/* Editorial hero (Figma 316:2), full-bleed under the translucent header */}
        {heroItem && <FeaturedHero item={heroItem} onExperience={onStoryClick} />}
        {heroItem && <div aria-hidden className="h-6" />}
        <DemoModeNotice /><GuestBanner />
        {/* Welcome Message for First Visit */}
        {isFirstVisit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8 py-6 border-b border-white/10"
          >
            <p className="text-base text-white/70 leading-relaxed">
              You are now SEEN.
            </p>
            <p className="text-sm text-white/70 mt-2">Start with the featured story, or find your theme in Explore.</p>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-8"
        >
          {/* Editorial Hero Block */}
          <div className="mb-8">
            <PageTitle className="mb-3">For You</PageTitle>
          </div>

          {/* Presence indicators — real counts, each one a shortcut into Explore */}
          <PresenceIndicators storyCount={feedItems.length} />
        </motion.div>

        {/* One interest filter (PR-5): chips on top, and the matching stories right under them when any are chosen. */}
        <section className="mb-10">
          <InterestChips selected={interests} onChange={setInterests} language={language as Language} />
          {interestItems.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-6" role="region" aria-label="Based on your interests">
              <SectionHeader title="Based on your interests" subtitle={interests.slice(0, 3).join(" · ")} />
              <Rail>
                {interestItems.map(item => (
                  <RailCard key={item.id} w={150} h={200} onSelect={onStoryClick} item={{ id: item.id, title: item.title, eyebrow: item.type, imageUrl: item.mediaSource }} />
                ))}
              </Rail>
            </motion.div>
          )}
        </section>

        {/* Continue experiencing — only when there is real progress */}
        {continueItems.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mb-12" aria-label="Keep reading">
            <SectionHeader title="Keep reading" subtitle="Pick up where you left off" />
            <Rail>
              {continueItems.map(({ content, progress }) => (
                <RailCard
                  key={content.id}
                  w={240}
                  h={140}
                  onSelect={onStoryClick}
                  item={{ id: content.id, title: content.title, eyebrow: `${progress.progressPercentage}% read`, subtitle: content.creator, imageUrl: content.mediaSource }}
                />
              ))}
            </Rail>
          </motion.section>
        )}

        {/* Featured Content */}
        {featuredContent.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mb-12"
          >
            <SectionHeader
              title="Featured"
              subtitle="Picked by the SEEN team"
              onViewAll={() => onNavigate('explore')}
            />
            <div className="space-y-4">
              {featuredContent.map((item, i) => (
                <ContentCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  creator={item.creator}
                  subtitle={item.description}
                  duration={item.duration}
                  imageUrl={item.mediaSource}
                  typeLabel={<>{getContentTypeIcon(item.type)}{item.type}</>}
                  index={i}
                  onSelect={onStoryClick}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Trending */}
        {trendingContent.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="mb-12"
          >
            <SectionHeader 
              title="Worth your time"
              subtitle="Our current favourites"
              onViewAll={() => onNavigate('explore')}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-gutter px-gutter">
              {trendingContent.map(item => (
                <StoryCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  author={item.creator}
                  readTime={item.duration}
                  imageUrl={item.mediaSource}
                  typeLabel={<>{getContentTypeIcon(item.type)}{item.type}</>}
                  onSelect={() => onStoryClick(item.id)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* New Releases */}
        {newContent.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="mb-12"
          >
            <SectionHeader 
              title="New"
              subtitle="Just added"
              onViewAll={() => onNavigate('explore')}
              icon={<Music className="w-5 h-5" />}
            />
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-gutter px-gutter">
              {newContent.map(item => (
                <StoryCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  author={item.creator}
                  readTime={item.duration}
                  imageUrl={item.mediaSource}
                  typeLabel={<>{getContentTypeIcon(item.type)}{item.type}</>}
                  onSelect={() => onStoryClick(item.id)}
                />
              ))}
            </div>
          </motion.section>
        )}

        <VoicesToDiscover />

      </main>

      {/* Bottom Navigation */}
    </motion.div>
  );
}

function PresenceIndicators({ storyCount }: { storyCount: number }) {
  const nav = useAppNav();
  const counts = useResource(async () => {
    const [creators, collections] = await Promise.all([api.creators.list(), api.collections.list()]);
    return { creators: creators.length, collections: collections.length };
  });
  const rows = [
    { icon: <BookOpen className="w-5 h-5 text-amber-200/70" aria-hidden />, n: storyCount, label: storyCount === 1 ? "Story" : "Stories", tab: "stories" },
    { icon: <Users className="w-5 h-5 text-violet-200/70" aria-hidden />, n: counts.data?.creators, label: "Creators", tab: "creators" },
    { icon: <Folder className="w-5 h-5 text-orange-200/70" aria-hidden />, n: counts.data?.collections, label: "Collections to explore", tab: "collections" },
  ];
  return (
    <ul className="space-y-1">
      {rows.map((r, i) => (
        <motion.li key={r.tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.25 }}>
          <button
            type="button"
            onClick={() => nav.go("explore", { tab: r.tab })}
            className="flex items-center gap-4 min-h-11 w-full text-left group"
          >
            {r.icon}
            <span className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-white/90 tabular-nums min-w-[1.5ch]">{r.n ?? "–"}</span>
              <span className="text-sm text-white/55 font-light tracking-wide group-hover:text-white/70 transition-colors">{r.label}</span>
            </span>
          </button>
        </motion.li>
      ))}
    </ul>
  );
}
