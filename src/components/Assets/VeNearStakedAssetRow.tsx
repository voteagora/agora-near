import { useMemo } from "react";
import { ResponsiveAssetRow } from "./ResponsiveAssetRow";
import TokenAmount from "../shared/TokenAmount";
import { LINEAR_POOL, STNEAR_POOL, RNEAR_POOL } from "@/lib/constants";
import nearAssetIcon from "@/assets/near_icon.jpg";

export const VeNearStakedAssetRow = ({
  stakedBalance,
  stakingPoolId,
}: {
  stakedBalance: string;
  stakingPoolId: string;
}) => {
  const token = useMemo(() => {
    if (stakingPoolId === LINEAR_POOL.contract) {
      return LINEAR_POOL.metadata;
    }

    if (stakingPoolId === STNEAR_POOL.contract) {
      return STNEAR_POOL.metadata;
    }

    if (stakingPoolId === RNEAR_POOL.contract) {
      return RNEAR_POOL.metadata;
    }

    // Fallback for custom staking pools
    return {
      name: stakingPoolId,
      symbol: "NEAR",
      icon: nearAssetIcon,
      decimals: 24,
      isCustomPool: true,
    };
  }, [stakingPoolId]);

  const columns = useMemo(() => {
    return [
      {
        title: "Staked balance",
        subtitle: <TokenAmount amount={stakedBalance} />,
      },
    ];
  }, [stakedBalance]);

  return (
    <ResponsiveAssetRow
      metadata={token}
      columns={columns}
      showOverflowMenu={false}
    />
  );
};
