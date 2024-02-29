import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Alumni+Sans:wght@400;700&&display=swap"
          type="font/woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alumni+Sans:wght@400;700&display=swap"
        />
      </Head>
      <body className="bg-custom-bg">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
