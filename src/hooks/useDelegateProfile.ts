import { getDelegate } from "@/lib/api/delegates/requests";
import { useQuery } from "@tanstack/react-query";

export const QK_DELEGATE_PROFILE = "delegateProfile";

export const useDelegateProfile = ({ accountId }: { accountId?: string }) => {
  return useQuery({
    queryKey: [QK_DELEGATE_PROFILE, accountId],
    queryFn: () => getDelegate(accountId ?? ""),
    enabled: !!accountId,
  });
};
