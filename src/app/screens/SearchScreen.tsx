import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, SlidersHorizontal, Clock } from 'lucide-react';
import { useStoryState } from '../contexts/StoryStateContext';
import { searchStories, getSearchSuggestions } from '../data/searchService';
import type { ContentItem } from '../data/types';
import { StoryCard } from '../components/StoryCard';
import { track } from '../observability';
import { SearchBar } from '../components/seen/forms';
import { Button, Chip, StateTemplate } from '../components/seen/primitives';
import { ListItem } from '../components/seen/display';
import { SearchFiltersSheet } from '../components/SearchFiltersSheet';
import { activeFilterCount, applyFilters, emptyFilters, facetsOf } from '../data/searchFilters';
import { addRecentSearch, clearRecentSearches, getRecentSearches } from '../data/recentSearches';
import { STORY_WORLDS } from '../data/storyDatabase';
import { useT } from '../i18n/useT';

/** The most common cultural themes in the public catalogue, for the landing state. */
function topThemes(limit = 8): string[] {
  const n = new Map<string, number>();
  for (const s of STORY_WORLDS) if (s.visibility === 'public') for (const t of s.culturalThemes) n.set(t, (n.get(t) ?? 0) + 1);
  return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([t]) => t);
}

interface SearchScreenProps {
  onClose: () => void;
  onSelectStory?: (storyId: string) => void;
}

export function SearchScreen({ onClose, onSelectStory }: SearchScreenProps) {
  const { state } = useStoryState();
  const { language } = state;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const t = useT();
  const [filters, setFilters] = useState(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [recents, setRecents] = useState<string[]>(getRecentSearches);
  const themes = topThemes();
  const visible = applyFilters(results, filters);
  const filterCount = activeFilterCount(filters);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    // Simulate search delay for UX feedback
    const timer = setTimeout(() => {
      const searchResults = searchStories(query, language);
      setResults(searchResults);
      // Result count only — the query text itself is never recorded.
      track("search_performed", { results: searchResults.length });

      const searchSuggestions = getSearchSuggestions(query, language, 5);
      setSuggestions(searchSuggestions);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, language]);

  const handleSelectStory = (storyId: string) => {
    // Selecting a result navigates away; calling onClose() here as well used
    // to immediately bounce the user back to For You.
    addRecentSearch(query);
    if (onSelectStory) onSelectStory(storyId);
    else onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="relative max-w-(--seen-content-max) mx-auto h-dvh flex flex-col bg-black/40"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="sticky top-0 z-10 px-5 pt-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center"
                aria-label="Close search"
              >
                <X className="w-4 h-4 text-white/70" />
              </motion.button>
              <h2 className="text-white text-lg font-light tracking-tight">
                {language === 'en' ? 'Search Stories' : language === 'fr' ? 'Rechercher des Histoires' : language === 'es' ? 'Buscar Historias' : 'Search Stories'}
              </h2>
            </div>

            {/* Search Input — Figma Search Bar (Empty / Focused / Filled) */}
            <SearchBar
              id="global-search"
              label={language === 'fr' ? 'Rechercher des histoires' : language === 'es' ? 'Buscar historias' : 'Search stories'}
              placeholder={language === 'en' ? 'Search by title, author, or theme...' : language === 'fr' ? 'Rechercher par titre, auteur ou thème...' : 'Buscar por título, autor o tema...'}
              value={query}
              onChange={setQuery}
              autoFocus
            />
            {query.trim() && results.length > 0 && (
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-seen-muted" role="status" aria-live="polite">
                  {visible.length === 1 ? t('search.count1') : t('search.count', { n: String(visible.length) })}
                </p>
                <Button size="sm" variant="secondary" icon={<SlidersHorizontal className="w-4 h-4" aria-hidden />} onClick={() => setFiltersOpen(true)}>
                  {filterCount ? t('search.filtersN', { n: String(filterCount) }) : t('search.filters')}
                </Button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {query.trim() && (
              <div className="px-5 py-4">
                {isSearching && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  </div>
                )}

                {!isSearching && visible.length === 0 && (
                  <StateTemplate
                    kind="empty"
                    icon={<Search className="w-5 h-5" aria-hidden />}
                    title={t('search.zero.title', { q: query.trim() })}
                    message={t('search.zero.body')}
                    actionLabel={filterCount ? t('search.zero.clear') : suggestions[0] ? t('search.zero.try', { s: suggestions[0] }) : undefined}
                    onAction={filterCount ? () => setFilters(emptyFilters()) : suggestions[0] ? () => setQuery(suggestions[0]) : undefined}
                  />
                )}

                {!isSearching && visible.length > 0 && (
                  <div className="space-y-4">
                    {visible.map(story => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <StoryCard
                          id={story.id}
                          width="full"
                          title={story.title}
                          author={story.creator}
                          readTime={story.duration}
                          imageUrl={story.mediaSource}
                          onSelect={() => handleSelectStory(story.id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!query.trim() && (
              <div className="px-5 py-5 space-y-6">
                {recents.length > 0 && (
                  <section aria-label={t('search.recent')}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[13px] font-medium text-seen-secondary">{t('search.recent')}</h3>
                      <button type="button" className="min-h-11 px-1 text-xs text-seen-muted underline underline-offset-2 hover:text-white" onClick={() => { clearRecentSearches(); setRecents([]); }}>
                        {t('search.clearRecent')}
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {recents.map(r => (
                        <ListItem key={r} icon={<Clock className="w-4 h-4" />} label={r} onClick={() => setQuery(r)} />
                      ))}
                    </div>
                    <p className="text-xs text-seen-muted mt-2">{t('search.recentHint')}</p>
                  </section>
                )}
                {themes.length > 0 && (
                  <section aria-label={t('search.topics')}>
                    <h3 className="text-[13px] font-medium text-seen-secondary mb-2">{t('search.topics')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {themes.map(th => (
                        <Chip key={th} onClick={() => setQuery(th)}>{th}</Chip>
                      ))}
                    </div>
                  </section>
                )}
                {recents.length === 0 && themes.length === 0 && <p className="text-white/55 text-sm text-center">{t('search.landingHint')}</p>}
              </div>
            )}
          </div>

          <SearchFiltersSheet open={filtersOpen} onOpenChange={setFiltersOpen} filters={filters} onChange={setFilters} facets={facetsOf(results)} count={visible.length} />

          {/* Footer Info */}
          <div className="px-5 py-4 border-t border-white/5 text-center">
            <p className="text-white/55 text-xs">
              {results.length > 0 && `${results.length} ${language === 'en' ? 'result' : language === 'fr' ? 'résultat' : language === 'es' ? 'resultado' : 'result'}${results.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
