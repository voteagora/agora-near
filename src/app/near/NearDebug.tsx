"use client";

import { useState, useEffect } from "react";
import { useNear } from "@/contexts/NearContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VeNearDebugCards from "./VeNearDebugCards";
import NearTokenAmount from "@/components/shared/NearTokenAmount";

export default function NearDebug() {
  const { signedAccountId, signIn, signOut, getBalance } = useNear();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
                      <NearTokenAmount
                        amount={balance ?? "0"}
                        maximumSignificantDigits={24}
                      />
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
