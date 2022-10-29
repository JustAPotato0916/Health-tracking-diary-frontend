import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import AnimatedPageTransition from "../components/PageChange/AnimatedPageTransition";
import { AuthProvider } from "../src/hooks/useAuth";
import { useState } from "react";
import ModeToggle from "../components/general/ModeToggle";
import { appWithTranslation } from "next-i18next";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60000 } },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AnimatedPageTransition>
          <main className={`${isDarkMode && "dark"}`}>
            <ModeToggle setIsDarkMode={setIsDarkMode} />

            <Component {...pageProps} />
          </main>
        </AnimatedPageTransition>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
