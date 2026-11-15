import { motion } from "motion/react";
import { NavigationBar } from "./NavigationBar";
import { ContentCard } from "./ContentCard";
import { StoryCard } from "./StoryCard";
import { SectionHeader } from "./SectionHeader";
import { Plus, Mic, Upload } from "lucide-react";

interface HomeScreenProps {
  onStoryClick: () => void;
  userIntent?: "explore" | "create" | "contribute";
}

export function HomeScreen({ onStoryClick, userIntent = "explore" }: HomeScreenProps) {
  // Content data
  const featuredStory = {
    title: "Midnight Resonance",
    subtitle: "A journey through sound and silence",
    category: "CREOVA Music",
    imageUrl: "https://images.unsplash.com/photo-1762160766849-05ecfddd7481?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBwb3J0cmFpdCUyMG11c2ljaWFuJTIwZGFya3xlbnwxfHx8fDE3NzAxNjc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080"
  };

  const storyWorlds = [
    {
      title: "Echoes of Light",
      subtitle: "Visual poetry in motion",
      category: "Story World",
      imageUrl: "https://images.unsplash.com/photo-1751309165814-c6fd8e7bb740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBMjQlMjBmaWxtJTIwY2luZW1hdGljJTIwc3RpbGx8ZW58MXx8fHwxNzcwMTY3NzY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Form & Shadow",
      subtitle: "Where fabric meets feeling",
      category: "Story World",
      imageUrl: "https://images.unsplash.com/photo-1536303158031-c868b371399f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwcG9ydHJhaXQlMjBkYXJrfGVufDF8fHx8MTc3MDE2Nzc2OXww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const archiveStories = [
    {
      title: "The Evolution of Jazz",
      author: "Marcus Chen",
      readTime: "8 min",
      imageUrl: "https://images.unsplash.com/photo-1763215733028-02803292649c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWNpYW4lMjB2aW50YWdlJTIwYWVzdGhldGljfGVufDF8fHx8MTc3MDE2Nzc2OXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Street Culture",
      author: "Sofia Rodriguez",
      readTime: "6 min",
      imageUrl: "https://images.unsplash.com/photo-1512010462867-6a82ced24f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGN1bHR1cmUlMjBzdHJlZXQlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NzAxNjc3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Analog Dreams",
      author: "Jordan Kim",
      readTime: "5 min",
      imageUrl: "https://images.unsplash.com/photo-1634564900373-382953f37578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMHBsYXllciUyMGFlc3RoZXRpY3xlbnwxfHx8fDE3NzAxNDAxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const communityVoices = [
    {
      title: "Moments of Reflection",
      author: "Aisha Thompson",
      readTime: "4 min",
      imageUrl: "https://images.unsplash.com/photo-1729641246194-e30bb302ffce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBlcnNvbiUyMHRob3VnaHRmdWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzAxNjgzNzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Creating in Silence",
      author: "Yuki Tanaka",
      readTime: "7 min",
      imageUrl: "https://images.unsplash.com/photo-1765029582797-65367bf81ac6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMGNyZWF0aW5nJTIwYXJ0JTIwc3R1ZGlvfGVufDF8fHx8MTc3MDE2ODM3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Between the Notes",
      author: "River Martinez",
      readTime: "5 min",
      imageUrl: "https://images.unsplash.com/photo-1583240350279-d37a7597fd09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbW90aW9uYWwlMjBwb3J0cmFpdCUyMGNsb3NldXAlMjBjaW5lbWF0aWN8ZW58MXx8fHwxNzcwMTY4MzcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  // Intent-specific CTAs and content prioritization
  const getIntentCTA = () => {
    switch (userIntent) {
      case "create":
        return {
          icon: Plus,
          text: "Begin Creating",
          subtitle: "Start your story"
        };
      case "contribute":
        return {
          icon: Upload,
          text: "Add to Archive",
          subtitle: "Share your moment"
        };
      default:
        return null;
    }
  };

  const intentCTA = getIntentCTA();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-black"
    >
      {/* Navigation */}
      <NavigationBar />

      {/* Main Content */}
      <main className="pt-20 pb-24 px-5 max-w-[428px] mx-auto">
        {/* Intent-based CTA (for Create & Contribute) */}
        {intentCTA && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <button className="w-full p-6 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-white/10 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <intentCTA.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base text-white mb-1">
                    {intentCTA.text}
                  </h3>
                  <p className="text-sm text-white/50">
                    {intentCTA.subtitle}
                  </p>
                </div>
              </div>
            </button>
          </motion.section>
        )}

        {/* Featured Content - adapt based on intent */}
        <section className="mb-12">
          {userIntent === "explore" && (
            <div className="mb-3">
              <span className="text-xs tracking-[0.3em] uppercase text-white/40">
                Featured for You
              </span>
            </div>
          )}
          {userIntent === "create" && (
            <div className="mb-3">
              <span className="text-xs tracking-[0.3em] uppercase text-white/40">
                Creative Inspiration
              </span>
            </div>
          )}
          {userIntent === "contribute" && (
            <div className="mb-3">
              <span className="text-xs tracking-[0.3em] uppercase text-white/40">
                Latest from the Archive
              </span>
            </div>
          )}
          <div onClick={onStoryClick} className="cursor-pointer">
            <ContentCard 
              id="featured-midnight-resonance"
              title={featuredStory.title}
              creator={featuredStory.subtitle}
              imageUrl={featuredStory.imageUrl}
              category={featuredStory.category}
              onSelect={onStoryClick}
            />
          </div>
        </section>

        {/* Story Worlds - shown for all intents but with different emphasis */}
        {userIntent !== "contribute" && (
          <section className="mb-12">
            <SectionHeader 
              title={userIntent === "create" ? "Story Examples" : "Story Worlds"}
              subtitle={userIntent === "create" ? "See what's possible" : "Immersive narratives"}
            />
            <div className="space-y-4">
              {storyWorlds.map((item, index) => (
                <div key={index} onClick={onStoryClick} className="cursor-pointer">
                  <ContentCard 
                    id={`story-world-${index}`}
                    title={item.title}
                    creator={item.subtitle}
                    imageUrl={item.imageUrl}
                    category={item.category}
                    onSelect={onStoryClick}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* From the Archive - prioritized for Contribute intent */}
        <section className={userIntent === "contribute" ? "mb-12" : "mb-12"}>
          <SectionHeader 
            title={userIntent === "contribute" ? "Community Archive" : "From the Archive"}
            subtitle={userIntent === "contribute" ? "Preserved moments" : "Cultural heritage"}
          />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
            {archiveStories.map((story, index) => (
              <div key={index} onClick={onStoryClick}>
                <StoryCard {...story} />
              </div>
            ))}
          </div>
        </section>

        {/* Community Voices */}
        <section className="mb-8">
          <SectionHeader 
            title={userIntent === "create" ? "Creator Spotlights" : "Community Voices"}
            subtitle={userIntent === "create" ? "Learn from others" : "Stories from our collective"}
          />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
            {communityVoices.map((story, index) => (
              <div key={index} onClick={onStoryClick}>
                <StoryCard {...story} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/60 border-t border-white/5 z-40">
        <div className="max-w-[428px] mx-auto px-5 py-4 flex justify-around">
          {["For You", "Explore", "Library", "Profile"].map((item) => (
            <button
              key={item}
              className="text-xs tracking-wider uppercase text-white/40 hover:text-white/80 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
    </motion.div>
  );
}