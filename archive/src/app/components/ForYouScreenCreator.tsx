import { motion } from "motion/react";
import { useState } from "react";
import { NavigationBar } from "./NavigationBar";
import { ContentCard } from "./ContentCard";
import { StoryCard } from "./StoryCard";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "./EmptyState";
import { TrendingUp, Clock, Eye, CheckCircle, Edit3, BarChart3 } from "lucide-react";
import type { ContentLanguage } from "../data/types";
import { 
  getForYouSections, 
  getCreatorPerformanceData,
  getCreatorDrafts,
  getCreatorRecommendations 
} from "../data/queries";

interface ForYouScreenCreatorProps {
  activeLanguage: ContentLanguage;
  onNavigate: (screen: "for-you" | "explore" | "library" | "profile") => void;
  onContentSelect: (contentId: string) => void;
}

export function ForYouScreenCreator({ 
  activeLanguage, 
  onNavigate,
  onContentSelect 
}: ForYouScreenCreatorProps) {
  const sections = getForYouSections(activeLanguage);
  const performanceData = getCreatorPerformanceData();
  const drafts = getCreatorDrafts();
  const recommendations = getCreatorRecommendations();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <NavigationBar 
        title="For You"
        showBack={false}
        onBack={() => {}}
      />

      {/* Scrollable Content */}
      <div className="pb-24">
        {/* Creator Performance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-5 pt-6 pb-8"
        >
          <div className="border border-white/10 bg-white/[0.02] rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs tracking-widest uppercase text-white/40">Creator</span>
                  <div className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-xs tracking-widest uppercase text-white/60">
                    {performanceData.period}
                  </span>
                </div>
                <h2 className="text-lg font-light tracking-wide">Your Performance</h2>
              </div>
              <BarChart3 className="w-5 h-5 text-white/30" strokeWidth={1.5} />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Views */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Views</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{performanceData.views}</div>
                <div className="text-xs text-white/40">
                  {performanceData.viewsTrend > 0 ? '+' : ''}{performanceData.viewsTrend}%
                </div>
              </div>

              {/* Completion */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Completion</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{performanceData.completion}%</div>
                <div className="text-xs text-white/40">Avg rate</div>
              </div>

              {/* Engagement */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase text-white/40">Responses</span>
                </div>
                <div className="text-2xl font-light tracking-tight">{performanceData.responses}</div>
                <div className="text-xs text-white/40">Community</div>
              </div>
            </div>

            {/* View Details Link */}
            <button
              type="button"
              onClick={() => onNavigate("profile")}
              className="mt-6 w-full py-3 border border-white/10 rounded text-xs tracking-widest uppercase text-white/60 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              View Dashboard
            </button>
          </div>
        </motion.div>

        {/* Drafts in Progress */}
        {drafts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <SectionHeader
              title="In Progress"
              subtitle={`${drafts.length} draft${drafts.length !== 1 ? 's' : ''}`}
              onViewAll={() => onNavigate("library")}
            />
            
            <div className="px-5 space-y-3">
              {drafts.map((draft, index) => (
                <motion.button
                  key={draft.id}
                  type="button"
                  onClick={() => onContentSelect(draft.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="w-full flex items-center gap-4 p-4 border border-white/10 bg-white/[0.02] rounded-lg hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 text-left"
                >
                  {/* Progress Indicator */}
                  <div className="flex-shrink-0">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-white/10"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - draft.progress / 100)}`}
                          className="text-white/60 transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-light text-white/60">{draft.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-light tracking-wide mb-1 truncate">{draft.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Clock className="w-3 h-3" strokeWidth={1.5} />
                      <span>{draft.lastEdited}</span>
                    </div>
                  </div>

                  {/* Edit Icon */}
                  <Edit3 className="w-4 h-4 text-white/30 flex-shrink-0" strokeWidth={1.5} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommended Improvements */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <SectionHeader
              title="Recommendations"
              subtitle="Curated for you"
              onViewAll={() => {}}
            />
            
            <div className="px-5 space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="p-4 border border-white/10 bg-white/[0.02] rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 text-white/60" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-light tracking-wide mb-2">{rec.title}</h3>
                      <p className="text-xs text-white/40 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular For You Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
            className="mb-8"
          >
            <SectionHeader
              title={section.title}
              subtitle={section.subtitle}
              onViewAll={section.onViewAll}
            />
            
            {section.layout === 'carousel' && (
              <div className="flex gap-4 px-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                {section.items.map((item) => (
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
            )}

            {section.layout === 'grid' && (
              <div className="grid grid-cols-2 gap-4 px-5">
                {section.items.map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    creator={item.creator}
                    duration={item.duration}
                    imageUrl={item.imageUrl}
                    category={item.category}
                    onSelect={onContentSelect}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 pointer-events-none">
        <div className="max-w-[428px] mx-auto px-5 py-4 flex justify-around">
          <button
            type="button"
            onClick={() => onNavigate("for-you")}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white`}
          >
            <div className="relative">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-sm border-2 border-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </div>
              {/* Creator Badge */}
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white border border-black" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-medium">For You</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto group text-white/40 hover:text-white/60"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white/40 group-hover:border-white/60 transition-colors duration-300" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-light">Explore</span>
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
