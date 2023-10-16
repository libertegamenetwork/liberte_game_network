import theme from "@/styles/theme";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@100;200;300;400&display=swap"
        rel="stylesheet"
      />
      <body style={{ backgroundColor: theme.colors.background }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
