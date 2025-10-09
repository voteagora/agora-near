"use client";

import { useState, useEffect } from "react";
import { useNear } from "@/contexts/NearContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VeNearDebugCards from "./VeNearDebugCards";
import TokenAmount from "@/components/shared/TokenAmount";
import { useFungibleTokens } from "@/hooks/useFungibleTokens";
import { FungibleToken } from "@/lib/api/fungibleTokens";

export default function NearDebug() {
  const { signedAccountId, signIn, signOut, getBalance } = useNear();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: fungibleTokens, isLoading: isLoadingFungibleTokens } =
    useFungibleTokens(signedAccountId);

  useEffect(() => {
    async function fetchBalance() {
      if (signedAccountId) {
        setIsLoading(true);
        try {
          const accountBalance = await getBalance(signedAccountId);
          setBalance(accountBalance);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setBalance(null);
      }
    }

    fetchBalance();
  }, [signedAccountId, getBalance]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // Filter for specific liquid staking tokens
  const liquidStakingTokens =
    fungibleTokens?.tokens?.filter(
      (token: FungibleToken) =>
        token.contract_id ===
          process.env.NEXT_PUBLIC_NEAR_LINEAR_TOKEN_CONTRACT_ID ||
        token.contract_id ===
          process.env.NEXT_PUBLIC_NEAR_STNEAR_TOKEN_CONTRACT_ID ||
        token.contract_id ===
          process.env.NEXT_PUBLIC_NEAR_RNEAR_TOKEN_CONTRACT_ID
    ) || [];

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-2 w-full gap-2">
        <Card className="flex flex-col grow">
          <CardHeader>
            <CardTitle>Your NEAR Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {signedAccountId ? (
                <>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Connected Account
                    </p>
                    <p className="text-lg font-medium">{signedAccountId}</p>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Account Balance
                    </p>
                    {isLoading ? (
                      <p className="text-lg">Loading...</p>
                    ) : (
                      <TokenAmount
                        amount={balance ?? "0"}
                        maximumSignificantDigits={24}
                      />
                    )}
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Liquid Staking Tokens
                    </p>
                    {isLoadingFungibleTokens ? (
                      <p className="text-lg">Loading...</p>
                    ) : liquidStakingTokens.length > 0 ? (
                      <div className="space-y-2">
                        {liquidStakingTokens.map(
                          (token: FungibleToken, index: number) => (
                            <div
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <span className="font-medium">
                                {token.contract_id ===
                                process.env
                                  .NEXT_PUBLIC_NEAR_LINEAR_TOKEN_CONTRACT_ID
                                  ? "liNEAR"
                                  : token.contract_id ===
                                      process.env
                                        .NEXT_PUBLIC_NEAR_STNEAR_TOKEN_CONTRACT_ID
                                    ? "stNEAR"
                                    : token.contract_id ===
                                        process.env
                                          .NEXT_PUBLIC_NEAR_RNEAR_TOKEN_CONTRACT_ID
                                      ? "rNEAR"
                                      : token.contract_id}
                              </span>
                              <TokenAmount
                                amount={token.balance}
                                currency={
                                  token.contract_id ===
                                  process.env
                                    .NEXT_PUBLIC_NEAR_LINEAR_TOKEN_CONTRACT_ID
                                    ? "liNEAR"
                                    : token.contract_id ===
                                        process.env
                                          .NEXT_PUBLIC_NEAR_STNEAR_TOKEN_CONTRACT_ID
                                      ? "stNEAR"
                                      : token.contract_id ===
                                          process.env
                                            .NEXT_PUBLIC_NEAR_RNEAR_TOKEN_CONTRACT_ID
                                        ? "rNEAR"
                                        : token.contract_id
                                }
                                maximumSignificantDigits={24}
                              />
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No liquid staking tokens found
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full mt-4"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 py-8">
                  <p className="text-center text-muted-foreground mb-4">
                    Connect your NEAR wallet to view account information and
                    manage your transactions.
                  </p>
                  <Button
                    variant="default"
                    className="w-64"
                    onClick={handleSignIn}
                  >
                    Connect NEAR Wallet
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <VeNearDebugCards />
      </div>
    </div>
  );
}
