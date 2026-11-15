import { motion } from "motion/react";
import { useEffect } from "react";

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  // Auto-advance after 2 seconds or wait for user action
  useEffect(() => {
    const timer = setTimeout(() => {
      // Optional: auto-advance
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1.2, 1.3, 1.2],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"
      />

      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1673234757545-21c6fd8da9bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBncmFkaWVudCUyMHRleHR1cmV8ZW58MXx8fHwxNzcwMTY4MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8">
        {/* Minimal branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl tracking-tight text-white mb-2">
            SEEN
          </h1>
          <p className="text-xs tracking-[0.4em] uppercase text-white/30">
            by CREOVA
          </p>
        </motion.div>

        {/* Poetic tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.5 }}
          className="text-sm text-white/50 text-center max-w-[280px] mb-16 leading-relaxed"
        >
          Where stories live,
          <br />
          where culture breathes
        </motion.p>

        {/* Call to action */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="group relative px-12 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-500"
        >
          <span className="text-sm tracking-[0.2em] uppercase text-white">
            Enter SEEN
          </span>
          <motion.div
            className="absolute inset-0 rounded-full bg-white/5"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      </div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-12 left-0 right-0 text-center"
      >
        <p className="text-xs text-white/20">
          Tap to begin
        </p>
      </motion.div>
    </motion.div>
  );
}