import { useCallback } from "react";

const WALLET_POPUP_DISMISSED_KEY = "agora_wallet_popup_dismissed";
const POPUP_EXPIRY_DAYS = 30;

export const useWalletPopup = () => {
  const hasDismissedPopup = useCallback(() => {
    if (typeof window === "undefined") return false;

    const dismissedData = localStorage.getItem(WALLET_POPUP_DISMISSED_KEY);
    if (!dismissedData) return false;

    try {
      const { timestamp } = JSON.parse(dismissedData);
      const expiryTime = timestamp + POPUP_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

      if (Date.now() > expiryTime) {
        localStorage.removeItem(WALLET_POPUP_DISMISSED_KEY);
        return false;
      }

      return true;
    } catch {
      localStorage.removeItem(WALLET_POPUP_DISMISSED_KEY);
      return false;
    }
  }, []);

  const dismissPopup = useCallback(() => {
    if (typeof window === "undefined") return;
    const dismissedData = {
      timestamp: Date.now(),
    };
    localStorage.setItem(
      WALLET_POPUP_DISMISSED_KEY,
      JSON.stringify(dismissedData)
    );
  }, []);

  const resetPopup = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(WALLET_POPUP_DISMISSED_KEY);
  }, []);

  return {
    hasDismissedPopup: hasDismissedPopup(),
    dismissPopup,
    resetPopup,
  };
};
