import { motion } from "motion/react";
import { useState } from "react";
import { NavigationBar } from "./NavigationBar";
import { ContentCard } from "./ContentCard";
import { SectionHeader } from "./SectionHeader";
import { Megaphone, TrendingUp, Music, Film, FileText, Building2, Calendar } from "lucide-react";
import type { ContentLanguage } from "../data/types";
import { 
  getExploreCategories,
  getCreatorOpenCalls,
  getTrendingFormats,
  getInstitutionalOpportunities 
} from "../data/queries";

interface ExploreScreenCreatorProps {
  activeLanguage: ContentLanguage;
  onNavigate: (screen: "for-you" | "explore" | "library" | "profile") => void;
  onContentSelect: (contentId: string) => void;
}

export function ExploreScreenCreator({ 
  activeLanguage, 
  onNavigate,
  onContentSelect 
}: ExploreScreenCreatorProps) {
  const categories = getExploreCategories(activeLanguage);
  const openCalls = getCreatorOpenCalls(activeLanguage);
  const trendingFormats = getTrendingFormats();
  const opportunities = getInstitutionalOpportunities(activeLanguage);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <NavigationBar 
        title="Explore"
        showBack={false}
        onBack={() => {}}
      />

      {/* Scrollable Content */}
      <div className="pb-24">
        {/* Open Calls & Themes */}
        {openCalls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-5 pt-6 pb-8"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Megaphone className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-xs tracking-widest uppercase text-white/40">Creator Opportunities</span>
              </div>
              <h2 className="text-xl font-light tracking-wide">Open Calls</h2>
            </div>

            <div className="space-y-3">
              {openCalls.map((call, index) => (
                <motion.button
                  key={call.id}
                  type="button"
                  onClick={() => onContentSelect(call.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="w-full text-left p-5 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase bg-white/10 text-white/80 rounded">
                          {call.category}
                        </span>
                        {call.featured && (
                          <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase bg-white/5 text-white/60 rounded border border-white/10">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-light tracking-wide">{call.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/60 leading-relaxed mb-4">{call.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Due {call.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{call.organization}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trending Formats */}
        {trendingFormats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="px-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-xs tracking-widest uppercase text-white/40">Platform Insights</span>
              </div>
              <h2 className="text-xl font-light tracking-wide">Trending Formats</h2>
            </div>

            <div className="flex gap-3 px-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1">
              {trendingFormats.map((format, index) => {
                const Icon = format.type === 'music' ? Music : format.type === 'film' ? Film : FileText;
                
                return (
                  <motion.button
                    key={format.id}
                    type="button"
                    onClick={() => onContentSelect(format.id)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                    className="flex-shrink-0 w-[160px] snap-start p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                      <span className="text-xs tracking-wider uppercase text-white/40">{format.type}</span>
                    </div>
                    
                    <div className="text-left mb-3">
                      <div className="text-2xl font-light tracking-tight mb-0.5">{format.growth}%</div>
                      <div className="text-[10px] tracking-wider uppercase text-white/40">Growth</div>
                    </div>

                    <div className="text-left">
                      <div className="text-xs text-white/60 leading-relaxed">{format.description}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Institutional Opportunities */}
        {opportunities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="px-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                <span className="text-xs tracking-widest uppercase text-white/40">Institutional</span>
              </div>
              <h2 className="text-xl font-light tracking-wide">Collections Seeking Contributors</h2>
            </div>

            <div className="px-5 space-y-3">
              {opportunities.map((opp, index) => (
                <motion.button
                  key={opp.id}
                  type="button"
                  onClick={() => onContentSelect(opp.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="w-full text-left p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-light tracking-wide mb-1">{opp.institution}</h3>
                      <p className="text-xs text-white/60 mb-2">{opp.collection}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {opp.themes.map((theme, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 text-[10px] tracking-wider uppercase bg-white/5 text-white/50 rounded"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Explore Categories */}
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
            className="mb-8"
          >
            <SectionHeader
              title={category.title}
              subtitle={category.subtitle}
              onViewAll={category.onViewAll}
            />
            
            <div className="flex gap-4 px-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              {category.items.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-[280px] snap-start">
                  <ContentCard
                    id={item.id}
                    title={item.title}
                    creator={item.creator}
                    duration={item.duration}
                    imageUrl={item.imageUrl}
                    category={item.category}
                    onSelect={onContentSelect}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 pointer-events-none">
        <div className="max-w-[428px] mx-auto px-5 py-4 flex justify-around">
          <button
            type="button"
            onClick={() => onNavigate("for-you")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <div className="relative">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-sm border-2 border-white/40 group-hover:border-white/60 transition-colors duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/40 border border-black" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">For You</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-medium">Explore</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate("library")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="space-y-0.5">
                <div className="w-4 h-0.5 bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
                <div className="w-4 h-0.5 bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
                <div className="w-4 h-0.5 bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
              </div>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">Library</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white/40 group-hover:border-white/60 transition-colors duration-300 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white/60 transition-colors duration-300" />
              </div>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
