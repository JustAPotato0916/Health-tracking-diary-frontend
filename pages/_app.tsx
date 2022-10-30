import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import AnimatedPageTransition from "../components/pageChange/AnimatedPageTransition";
import { AuthProvider } from "../src/hooks/useAuth";
import { appWithTranslation } from "next-i18next";
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60000 } },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <AnimatedPageTransition>
            <Component {...pageProps} />
          </AnimatedPageTransition>
        </RecoilRoot>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
