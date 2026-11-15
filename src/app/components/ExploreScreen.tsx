/**
 * EXPLORE SCREEN
 * SEEN by CREOVA
 * 
 * Curated discovery with fixed categories
 * NO personalized content - different from For You
 */

import { DemoModeNotice } from "./DemoModeNotice";
import { GuestBanner } from "../guest/GuestBanner";
import { PageTitle } from "./seen/primitives";
import { languageChipText, languageNamesList } from "./seen/languageChip";
import type { StringKey } from "../i18n/strings";
import { useT } from "../i18n/useT";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAppNav } from "../navigation/AppNav";
import { ContentCard } from "./ContentCard";
import { StoryCard } from "./StoryCard";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "./EmptyState";
import { Search, Home, Compass, Library, User, BookOpen } from "lucide-react";
import { SegmentedTabs } from "./seen/primitives";
import { SearchBar } from "./seen/forms";
import { CreatorsPanel } from "../screens/CreatorsPanel";
import { CollectionsPanel } from "../screens/CollectionsPanel";
import type { ContentLanguage } from "../data/types";
import { getExploreCategories, searchStories } from "../data/storyService";
import type { Language } from "../data/storyDatabase";

interface ExploreScreenProps {
  onStoryClick: (contentId: string) => void;
  onNavigate: (screen: string) => void;
  onSearch?: () => void;
  language: ContentLanguage;
  initialTab?: ExploreTab;
}

export type ExploreTab = "stories" | "creators" | "collections";

/**
 * EXPLORE SECTION - CURATED DISCOVERY
 * 
 * Data Flow:
 * 1. Load fixed categories from storyService
 * 2. NO personalization - same for all users
 * 3. Search functionality
 * 4. Filter by type
 */
export function ExploreScreen({
  onStoryClick,
  onNavigate,
  onSearch,
  language,
  initialTab = "stories",
}: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const nav = useAppNav();
  const [tab, setTab] = useState<ExploreTab>(initialTab);
  useEffect(() => setTab(initialTab), [initialTab]);
  // Keep the tab in the URL so Back from a creator or collection returns to it.
  const changeTab = (next: ExploreTab) => {
    setTab(next);
    nav.go("explore", { tab: next }, { replace: true });
  };

  // Get curated categories
  const t = useT();
  const chipFor = (l: readonly string[] | undefined) => languageChipText(l, language);
  // Compact chip for the eye, full sentence for assistive tech ("Available in English and Français").
  const chipNode = (l: readonly string[] | undefined) => {
    const chip = chipFor(l);
    if (!chip || !l) return null;
    const names = languageNamesList([...new Set(l)].map(code => t(`search.lang.${code}` as StringKey)), t("list.and"));
    return (
      <span className="text-white/70">
        <span aria-hidden> · {chip}</span>
        <span className="sr-only">. {t("story.available", { list: names })}</span>
      </span>
    );
  };
  const categories = getExploreCategories(language as Language);
  

  // Search results
  const searchResults = searchQuery.length > 2 
    ? searchStories(searchQuery, language as Language) 
    : [];

  const filteredCategories = categories;

  // Show empty state if no categories
  if (categories.length === 0 && !searchQuery) {
    const emptyStateText = {
      en: { title: 'No Content Available', message: 'Check back soon for new stories.' },
      fr: { title: 'Aucun Contenu Disponible', message: 'Revenez bientôt pour de nouvelles histoires.' },
      es: { title: 'No Hay Contenido Disponible', message: 'Vuelva pronto para nuevas historias.' },
    };
    const text = emptyStateText[language as Language] || emptyStateText.en;
    
    return (
      <div className="min-h-dvh bg-black">
        <div className="pt-header pb-clearance px-gutter">
          <EmptyState
            icon="Compass"
            title={text.title}
            message={text.message}
            actionLabel="For You"
            onAction={() => onNavigate('for-you')}
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
      <main className="pt-header pb-clearance px-gutter max-w-(--seen-content-max) mx-auto">
        <DemoModeNotice /><GuestBanner />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <PageTitle className="mb-2">Explore</PageTitle>
          <p className="text-sm text-white/60">Stories, creators and collections, by theme and language</p>
        </motion.div>

        <div className="mb-6">
          <SegmentedTabs<ExploreTab>
            label="Explore sections"
            value={tab}
            onChange={changeTab}
            tabs={[
              { id: "stories", label: "Stories" },
              { id: "creators", label: "Creators" },
              { id: "collections", label: "Collections" },
            ]}
          />
        </div>

        {tab === "creators" && <CreatorsPanel />}
        {tab === "collections" && <CollectionsPanel />}

        {tab === "stories" && (<>
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            id="explore-search"
            label="Search stories"
            placeholder="Search stories"
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Search Results */}
        {searchQuery.length > 2 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <SectionHeader 
              title="Search Results"
              subtitle={`${searchResults.length} results for "${searchQuery}"`}
            />
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map(item => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    creator={item.creator}
                    subtitle={item.description}
                    duration={item.duration}
                    imageUrl={item.mediaSource}
                    typeLabel={<><BookOpen className="w-3 h-3" aria-hidden />{item.type}{chipNode(item.language)}</>}
                    onSelect={onStoryClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/55 text-sm">
                No results found for "{searchQuery}"
              </div>
            )}
          </motion.section>
        )}

        {/* Curated Categories */}
        {!searchQuery && filteredCategories.map((category, index) => (
          <motion.section
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="mb-12"
          >
            <SectionHeader 
              title={category.name}
              subtitle={category.description}
            />
            
            {/* Render based on category type */}
            {category.id === 'new-music' ? (
              // Horizontal scroll for music
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-gutter px-gutter">
                {category.items.map(item => (
                  <StoryCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    author={item.creator}
                    readTime={item.duration}
                    imageUrl={item.mediaSource}
                    onSelect={() => onStoryClick(item.id)}
                  />
                ))}
              </div>
            ) : (
              // Vertical list for stories/films/collections
              <div className="space-y-4">
                {category.items.map(item => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    creator={item.creator}
                    subtitle={item.description}
                    duration={item.duration}
                    imageUrl={item.mediaSource}
                    typeLabel={<><BookOpen className="w-3 h-3" aria-hidden />{item.type}{chipNode(item.language)}</>}
                    onSelect={onStoryClick}
                  />
                ))}
              </div>
            )}
          </motion.section>
        ))}

        </>)}
      </main>

      {/* Bottom Navigation */}
    </motion.div>
  );
}
