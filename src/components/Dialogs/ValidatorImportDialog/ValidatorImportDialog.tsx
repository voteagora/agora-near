"use client";

import { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNear } from "@/contexts/NearContext";
import { useOpenDialog } from "../DialogProvider/DialogProvider";
import { useStakedBalance } from "@/hooks/useStakedBalance";
import { useQuery } from "@tanstack/react-query";
import { utils } from "near-api-js";

export function ValidatorImportDialog({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const { signedAccountId, viewMethod } = useNear();
  const openDialog = useOpenDialog();
  const [validatorId, setValidatorId] = useState("");
  const [accountId, setAccountId] = useState("");

  const effectiveAccountId = useMemo(
    () => accountId || signedAccountId || "",
    [accountId, signedAccountId]
  );

  const { stakedBalance, isLoading: isLoadingStaked } = useStakedBalance({
    stakingPoolId: validatorId,
    accountId: effectiveAccountId,
  });

  const { data: unstakedBalance, isLoading: isLoadingUnstaked } = useQuery({
    queryKey: ["unstakedBalance", validatorId, effectiveAccountId],
    queryFn: async () => {
      const res = (await viewMethod({
        contractId: validatorId,
        method: "get_account_unstaked_balance",
        args: { account_id: effectiveAccountId },
      })) as string | null;
      return res;
    },
    enabled: !!validatorId && !!effectiveAccountId,
  });

  const handleProceed = useCallback(() => {
    if (!validatorId || !effectiveAccountId) return;
    // Abre el lock dialog para continuar el flujo normal tras verificar manualmente en review
    openDialog({
      type: "NEAR_LOCK",
      className: "sm:w-[700px]",
      params: { source: "onboarding" },
    });
  }, [validatorId, effectiveAccountId, openDialog]);

  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      <h2 className="text-xl font-semibold">Importar desde validador</h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-secondary">
          Validator ID (staking pool)
        </label>
        <Input
          placeholder="example.poolv1.near"
          value={validatorId}
          onChange={(e) => setValidatorId(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-secondary">Tu cuenta (opcional)</label>
        <Input
          placeholder="tu-cuenta.near"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
      </div>
      {validatorId && effectiveAccountId ? (
        <div className="flex flex-col gap-2 border border-line rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-sm text-secondary">Cuenta</span>
            <span className="text-sm">{effectiveAccountId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary">Validador</span>
            <span className="text-sm">{validatorId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary">Staked</span>
            <span className="text-sm">
              {isLoadingStaked
                ? "..."
                : stakedBalance
                  ? utils.format.formatNearAmount(stakedBalance)
                  : "0"}{" "}
              NEAR
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary">Unstaked</span>
            <span className="text-sm">
              {isLoadingUnstaked
                ? "..."
                : unstakedBalance
                  ? utils.format.formatNearAmount(unstakedBalance)
                  : "0"}{" "}
              NEAR
            </span>
          </div>
        </div>
      ) : null}
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={closeDialog}>
          Cancelar
        </Button>
        <Button
          onClick={handleProceed}
          disabled={!validatorId || !effectiveAccountId}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
