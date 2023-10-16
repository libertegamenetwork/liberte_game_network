import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { SolanaProvider } from "@/contexts/SolanaProvider";
import { Toaster } from "react-hot-toast";
import theme from "@/styles/theme";
import MagicProvider from "@/contexts/MagicProvider";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SolanaProvider>
      <MagicProvider>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <Toaster />
          </QueryClientProvider>
        </ChakraProvider>
      </MagicProvider>
    </SolanaProvider>
  );
}
