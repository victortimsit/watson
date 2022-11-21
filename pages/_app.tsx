import type { AppProps } from "next/app";
import "../styles/globals.css";
import DynamicHead from "./components/DynamicHead";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DynamicHead />
      <Component {...pageProps} />
    </>
  );
}
