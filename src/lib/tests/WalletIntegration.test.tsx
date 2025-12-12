
import { renderHook, act, waitFor } from "@testing-library/react";
import { NearContext, NearProvider, useNear } from "@/contexts/NearContext";
import { MockWalletSelector } from "@/lib/tests/MockWalletSelector";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Partially mock the wallet selector setup
vi.mock("@near-wallet-selector/core", async () => {
    const actual = await vi.importActual("@near-wallet-selector/core");
    return {
        ...actual,
        setupWalletSelector: () => Promise.resolve(new MockWalletSelector()),
    };
});

// Mock environment variables
vi.stubEnv("NEXT_PUBLIC_AGORA_ENV", "local");
vi.stubEnv("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID", "mock-project-id");

// Mock constants to avoid env check failure
vi.mock("@/lib/api/constants", () => ({
  getApiUrl: () => "http://mock-api.com",
}));

describe("Wallet Integration Structure", () => {
    it("initializes with mock wallet selector and can sign transactions", async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <NearProvider networkId="testnet">
                {children}
            </NearProvider>
        );

        const { result } = renderHook(() => useNear(), { wrapper });

        // Wait for initialization
        await waitFor(() => {
            expect(result.current.isInitialized).toBe(true);
        }, { timeout: 2000 });

        // Verify account is "signed in" (mock behavior)
        expect(result.current.signedAccountId).toBe("mock-user.testnet");

        // Verify we can simulate a transaction
        const consoleSpy = vi.spyOn(console, "log");
        
        await act(async () => {
            await result.current.callMethod({
                contractId: "test-contract",
                method: "test_method",
                args: { foo: "bar" }
            });
        });

        // Verify our mock wallet logic was triggered
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("Mock calling signAndSendTransaction"),
            expect.objectContaining({
                receiverId: "test-contract",
                actions: [
                    expect.objectContaining({
                        type: "FunctionCall",
                        params: expect.objectContaining({
                            methodName: "test_method"
                        })
                    })
                ]
            })
        );
    });
});
