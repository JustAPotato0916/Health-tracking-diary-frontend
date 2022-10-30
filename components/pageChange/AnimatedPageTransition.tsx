import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { spring } from "../../src/config/motion/spring";
import ModeToggle from "../general/ModeToggle";

function AnimatedPageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    setMode(localStorage.getItem("theme") ?? "dark");
  });

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        className={mode}
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
        <ModeToggle setMode={setMode} />

        {children}

        <Toaster position="bottom-center" />
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimatedPageTransition;
