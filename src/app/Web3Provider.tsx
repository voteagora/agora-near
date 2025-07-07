"use client";

import { FC, PropsWithChildren } from "react";
import { createConfig, WagmiProvider } from "wagmi";
import { inter } from "@/styles/fonts";
import Footer from "@/components/Footer";
import { PageContainer } from "@/components/Layout/PageContainer";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import AgoraProvider from "@/contexts/AgoraContext";
import ConnectButtonProvider from "@/contexts/ConnectButtonContext";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Tenant from "@/lib/tenant/tenant";
import { hashFn } from "@wagmi/core/query";
import { NearProvider } from "@/contexts/NearContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
    },
  },
});

const metadata = {
  name: "Agora Next",
  description: "The on-chain governance company",
  url: process.env.NEXT_PUBLIC_AGORA_BASE_URL!,
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
const { ui } = Tenant.current();
const shouldHideAgoraBranding = ui.hideAgoraBranding;

export const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: projectId,
    appName: metadata.name,
    appDescription: metadata.description,
    appUrl: metadata.url,
  })
);

const Web3Provider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider options={{ enforceSupportedChains: false }}>
        <NearProvider>
          <body className={inter.variable}>
            <noscript>
              You need to enable JavaScript to run this app.
            </noscript>
            <ConnectButtonProvider>
              <PageContainer>
                <Toaster />
                <AgoraProvider>{children}</AgoraProvider>
              </PageContainer>
            </ConnectButtonProvider>
            {!shouldHideAgoraBranding && <Footer />}
            <SpeedInsights />
          </body>
        </NearProvider>
      </ConnectKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default Web3Provider;
