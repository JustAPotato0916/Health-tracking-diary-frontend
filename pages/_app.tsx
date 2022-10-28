import "../styles/globals.css";
import type { AppProps } from "next/app";
import AnimatedPageTransition from "../components/PageChange/AnimatedPageTransition";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AnimatedPageTransition>
      <Component {...pageProps} />
    </AnimatedPageTransition>
  );
}

export default MyApp;
