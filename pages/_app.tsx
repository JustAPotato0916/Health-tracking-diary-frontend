import "../styles/globals.css";
import type { AppProps } from "next/app";
import AnimatedPageTransition from "../components/PageChange/AnimatedPageTransition";
import { AuthProvider } from "../src/hooks/useAuth";
import { useState } from "react";
import ModeToggle from "../components/general/ModeToggle";
import { appWithTranslation } from "next-i18next";

function MyApp({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  return (
    <AuthProvider>
      <AnimatedPageTransition>
        <main className={`${isDarkMode && "dark"}`}>
          <ModeToggle setIsDarkMode={setIsDarkMode} />

          <Component {...pageProps} />
        </main>
      </AnimatedPageTransition>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
