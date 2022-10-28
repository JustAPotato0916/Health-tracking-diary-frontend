import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import { spring } from "../../src/config/motion/spring";

function AnimatedPageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        transition={spring}
        key={router.pathname}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimatedPageTransition;
