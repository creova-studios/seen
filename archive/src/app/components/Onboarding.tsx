import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { UserRole, UserIntent } from "../contexts/StoryStateContext";

interface OnboardingProps {
  onComplete: (data: {
    role: UserRole;
    intent: UserIntent;
  }) => void;
  initialStep?: number;
}

type OnboardingStep = 
  | "arrival" 
  | "orientation" 
  | "role" 
  | "intent" 
  | "presence" 
  | "threshold";

const stepOrder: OnboardingStep[] = [
  "arrival",
  "orientation", 
  "role",
  "intent",
  "presence",
  "threshold"
];

export function Onboarding({ onComplete, initialStep = 0 }: OnboardingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<UserIntent | null>(null);
  
  const currentStep = stepOrder[currentStepIndex];

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("onboarding_step", currentStepIndex.toString());
  }, [currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < stepOrder.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    handleNext();
  };

  const handleIntentSelect = (intent: UserIntent) => {
    setSelectedIntent(intent);
    handleNext();
  };

  const handleComplete = () => {
    if (selectedRole && selectedIntent) {
      localStorage.setItem("onboarding_completed", "true");
      localStorage.removeItem("onboarding_step");
      onComplete({
        role: selectedRole,
        intent: selectedIntent
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {currentStep === "arrival" && (
          <ArrivalStep key="arrival" onNext={handleNext} />
        )}
        {currentStep === "orientation" && (
          <OrientationStep key="orientation" onNext={handleNext} />
        )}
        {currentStep === "role" && (
          <RoleStep key="role" onSelect={handleRoleSelect} />
        )}
        {currentStep === "intent" && (
          <IntentStep key="intent" onSelect={handleIntentSelect} />
        )}
        {currentStep === "presence" && (
          <PresenceStep key="presence" onNext={handleNext} />
        )}
        {currentStep === "threshold" && (
          <ThresholdStep key="threshold" onEnter={handleComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Step 1: Arrival
function ArrivalStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md"
    >
      <motion.h1 
        className="text-2xl leading-relaxed text-white/90 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        You are entering SEEN
      </motion.h1>
      
      <motion.p 
        className="text-base leading-relaxed text-white/50 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        An operating system for presence, creation, and soft power.
      </motion.p>
      
      <motion.button
        onClick={onNext}
        className="px-8 py-3 text-sm tracking-wider uppercase text-white/90 hover:text-white transition-all duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        whileHover={{ y: -2 }}
      >
        Begin
      </motion.button>
    </motion.div>
  );
}

// Step 2: Orientation
function OrientationStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-left max-w-lg"
    >
      <motion.div 
        className="space-y-8 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <p className="text-lg leading-relaxed text-white/80">
          SEEN is not a platform. It is a place where work, identity, and culture move together.
        </p>
        
        <p className="text-base leading-relaxed text-white/60">
          Every story, sound, and image exists as part of a larger narrative. 
          You control what you create. You decide what resonates. 
          Nothing here tracks you. Nothing here performs for algorithms.
        </p>
        
        <p className="text-base leading-relaxed text-white/60">
          This is a system built for presence, not reach. For depth, not speed. 
          For communities that form around shared meaning, not metrics.
        </p>
      </motion.div>
      
      <motion.button
        onClick={onNext}
        className="px-8 py-3 text-sm tracking-wider uppercase text-white/90 hover:text-white transition-all duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        whileHover={{ y: -2 }}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}

// Step 3: Role Recognition
function RoleStep({ onSelect }: { onSelect: (role: UserRole) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md"
    >
      <motion.h2 
        className="text-xl leading-relaxed text-white/80 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        How do you enter the system?
      </motion.h2>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <RoleButton
          label="Creator"
          subtitle="I make work"
          onClick={() => onSelect("creator")}
          delay={1.0}
        />
        <RoleButton
          label="Viewer"
          subtitle="I explore culture"
          onClick={() => onSelect("viewer")}
          delay={1.1}
        />
        <RoleButton
          label="Moderator"
          subtitle="I shape communities"
          onClick={() => onSelect("moderator")}
          delay={1.2}
        />
      </motion.div>
    </motion.div>
  );
}

function RoleButton({ 
  label, 
  subtitle, 
  onClick, 
  delay 
}: { 
  label: string; 
  subtitle: string; 
  onClick: () => void; 
  delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full py-5 text-left border-b border-white/10 hover:border-white/30 transition-all duration-500 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ x: 8 }}
    >
      <div className="text-base text-white/90 mb-1 group-hover:text-white transition-colors duration-500">
        {label}
      </div>
      <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors duration-500">
        {subtitle}
      </div>
    </motion.button>
  );
}

// Step 4: Intent Setting
function IntentStep({ onSelect }: { onSelect: (intent: UserIntent) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md"
    >
      <motion.h2 
        className="text-xl leading-relaxed text-white/80 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        Why are you here?
      </motion.h2>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <IntentButton
          label="Share work"
          onClick={() => onSelect("create")}
          delay={1.0}
        />
        <IntentButton
          label="Build a body of work"
          onClick={() => onSelect("create")}
          delay={1.1}
        />
        <IntentButton
          label="Explore culture"
          onClick={() => onSelect("explore")}
          delay={1.2}
        />
        <IntentButton
          label="Connect with communities"
          onClick={() => onSelect("contribute")}
          delay={1.3}
        />
      </motion.div>
    </motion.div>
  );
}

function IntentButton({ 
  label, 
  onClick, 
  delay 
}: { 
  label: string; 
  onClick: () => void; 
  delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full py-5 text-left border-b border-white/10 hover:border-white/30 transition-all duration-500 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ x: 8 }}
    >
      <div className="text-base text-white/90 group-hover:text-white transition-colors duration-500">
        {label}
      </div>
    </motion.button>
  );
}

// Step 5: Presence Setup
function PresenceStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md"
    >
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <p className="text-lg leading-relaxed text-white/70 mb-6">
          Your presence will form here.
        </p>
        
        <p className="text-base leading-relaxed text-white/50">
          As you create, explore, and contribute, this space becomes yours.
        </p>
      </motion.div>
      
      <motion.button
        onClick={onNext}
        className="px-8 py-3 text-sm tracking-wider uppercase text-white/90 hover:text-white transition-all duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        whileHover={{ y: -2 }}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}

// Step 6: Threshold
function ThresholdStep({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md"
    >
      <motion.h1 
        className="text-2xl leading-relaxed text-white/90 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        You are now SEEN.
      </motion.h1>
      
      <motion.button
        onClick={onEnter}
        className="px-8 py-3 text-sm tracking-wider uppercase text-white hover:text-white/90 transition-all duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1 }}
        whileHover={{ y: -2 }}
      >
        Enter
      </motion.button>
    </motion.div>
  );
}