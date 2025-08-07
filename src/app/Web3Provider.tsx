"use client";

import { FC, PropsWithChildren } from "react";
import Footer from "@/components/Footer";
import { PageContainer } from "@/components/Layout/PageContainer";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Tenant from "@/lib/tenant/tenant";
import { NearProvider } from "@/contexts/NearContext";
import InfoBanner from "@/components/InfoBanner";

const queryClient = new QueryClient();

const { ui } = Tenant.current();
const shouldHideAgoraBranding = ui.hideAgoraBranding;
const shouldHideAgoraFooter = ui.hideAgoraFooter;

const networkId =
  process.env.NEXT_PUBLIC_AGORA_ENV === "prod" ? "mainnet" : "testnet";

const Web3Provider: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <NearProvider networkId={networkId}>
      <>
        <InfoBanner />
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <PageContainer>
          <Toaster />
          {children}
        </PageContainer>
        {!shouldHideAgoraFooter && <Footer />}
        <SpeedInsights />
      </>
    </NearProvider>
  </QueryClientProvider>
);

export default Web3Provider;
