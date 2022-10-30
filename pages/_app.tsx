import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import AnimatedPageTransition from "../components/PageChange/AnimatedPageTransition";
import { AuthProvider } from "../src/hooks/useAuth";
import ModeToggle from "../components/general/ModeToggle";
import { appWithTranslation } from "next-i18next";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60000 } },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AnimatedPageTransition>
          <Component {...pageProps} />
        </AnimatedPageTransition>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
