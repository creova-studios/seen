import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Page, TopBar } from "../components/seen/primitives";

/** Standard pushed-screen frame: sticky top bar with back + page column. */
export function ScreenFrame({ title, onBack, action, children }: { title: string; onBack: () => void; action?: ReactNode; children: ReactNode }) {
  return (
    // The wrapper clips the slide-in offset so it cannot cause sideways scroll while it runs.
    // It must be a parent: an element cannot clip its own transform. (clip, unlike hidden, keeps the sticky bar working.)
    <div className="overflow-x-clip">
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
        className="min-h-dvh bg-black text-white"
      >
        <TopBar title={title} onBack={onBack} action={action} />
        <Page>{children}</Page>
      </motion.div>
    </div>
  );
}
