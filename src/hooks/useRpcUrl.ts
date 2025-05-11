import { useNear } from "@/contexts/NearContext";

import { getRpcUrl } from "@/lib/utils";

export const useRpcUrl = ({
  useArchivalNode = false,
}: {
  useArchivalNode?: boolean;
}) => {
  const { networkId } = useNear();
  return getRpcUrl(networkId, {
    useArchivalNode,
  });
};
