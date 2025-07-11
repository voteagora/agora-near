import { useMemo } from "react";
import { ResponsiveAssetRow } from "./ResponsiveAssetRow";
import TokenAmount from "../shared/TokenAmount";
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
