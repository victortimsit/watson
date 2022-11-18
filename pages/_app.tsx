import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Watson</title>
        <meta
          name="description"
          content="Improve your English speaking skills by talking to Watson"
        />
        <link rel="icon" href="/favicon.ico" />
        <script async src="https://cdn.splitbee.io/sb.js" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
