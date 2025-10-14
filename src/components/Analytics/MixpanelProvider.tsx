"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { identify, initMixpanel, pageView } from "@/lib/analytics/mixpanel";
import { useNear } from "@/contexts/NearContext";

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signedAccountId } = useNear();

  useEffect(() => {
    initMixpanel();
  }, []);

  useEffect(() => {
    identify(signedAccountId);
  }, [signedAccountId]);

  useEffect(() => {
    if (!pathname) return;
    pageView({ path: pathname });
  }, [pathname]);

  return children as any;
}
