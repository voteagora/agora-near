import { useMemo } from "react";
import { AssetRow } from "./AssetRow";
import NearTokenAmount from "../shared/NearTokenAmount";
import { useNear } from "@/contexts/NearContext";
import { LINEAR_POOL, STNEAR_POOL } from "@/lib/constants";

export const VeNearStakedAssetRow = ({
  stakedBalance,
  stakingPoolId,
}: {
  stakedBalance: string;
  stakingPoolId: string;
}) => {
  const { networkId } = useNear();

  const token = useMemo(() => {
    if (stakingPoolId === LINEAR_POOL.contracts[networkId]) {
      return LINEAR_POOL.metadata;
    }

    if (stakingPoolId === STNEAR_POOL.contracts[networkId]) {
      return STNEAR_POOL.metadata;
    }

    return null;
  }, [stakingPoolId, networkId]);

  const columns = useMemo(() => {
    return [
      {
        title: "Staked balance",
        subtitle: <NearTokenAmount amount={stakedBalance} />,
      },
    ];
  }, [stakedBalance]);

  return (
    <AssetRow metadata={token} columns={columns} showOverflowMenu={false} />
  );
};
