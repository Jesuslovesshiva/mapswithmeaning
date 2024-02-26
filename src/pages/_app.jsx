import "../styles/globals.css";
import "../components/multiRangeSlider/multiRangeSlider.css";
import "../components/EndGameModal/EndGameModal.css";
import Head from "next/head";

import "leaflet/dist/leaflet.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Teocalli</title>
        <title>Your Site Title</title>
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Alumni+Sans:wght@400;700&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alumni+Sans:wght@400;700&display=swap"
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Alumni+Sans:wght@400;700&display=swap"
            rel="stylesheet"
            type="text/css"
          />
        </noscript>
        <link rel="icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/favicon/android-chrome-512x512.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Add a site.webmanifest file in your public directory with icon details for Android */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
