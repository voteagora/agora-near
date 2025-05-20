"use client";

import { useCallback, useEffect, useMemo } from "react";

import DelegateStatementForm from "@/components/DelegateStatement/DelegateStatementForm";
import AgoraLoader from "@/components/shared/AgoraLoader/AgoraLoader";
import { useNear } from "@/contexts/NearContext";
import { useDelegateProfile } from "@/hooks/useDelegateProfile";
import Tenant from "@/lib/tenant/tenant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ResourceNotFound from "../shared/ResourceNotFound/ResourceNotFound";
import { DelegateProfile } from "@/lib/api/delegates/types";

export type DelegateStatementFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  agreeCodeConduct: z.boolean(),
  discord: z.string(),
  delegateStatement: z.string(),
  email: z.string(),
  twitter: z.string(),
  warpcast: z.string(),
  topIssues: z.array(
    z
      .object({
        type: z.string(),
        value: z.string(),
      })
      .strict()
  ),
});

export default function CurrentDelegateStatement() {
  const { ui } = Tenant.current();

  const { signedAccountId, isInitialized } = useNear();
  const isConnected = !!signedAccountId;

  const { data: delegate, isLoading } = useDelegateProfile({
    accountId: signedAccountId,
  });

  const topIssues = ui.governanceIssues;
  const defaultIssues = useMemo(
    () =>
      !topIssues
        ? []
        : topIssues.map((issue) => ({
            type: issue.key,
            value: "",
          })),
    [topIssues]
  );

  const requireCodeOfConduct = !!ui.toggle("delegates/code-of-conduct")
    ?.enabled;

  const getDefaultValues = useCallback(
    (delegateProfile: DelegateProfile | undefined) => {
      return {
        agreeCodeConduct: !requireCodeOfConduct,
        discord: delegateProfile?.discord || "",
        delegateStatement: delegateProfile?.statement || "",
        email: delegateProfile?.email || "",
        twitter: delegateProfile?.twitter || "",
        warpcast: delegateProfile?.warpcast || "",
        topIssues:
          (delegateProfile?.topIssues ?? []).length > 0
            ? (delegateProfile?.topIssues ?? defaultIssues)
            : defaultIssues,
      };
    },
    [requireCodeOfConduct, defaultIssues]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(delegate),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(getDefaultValues(delegate));
  }, [form, getDefaultValues, delegate]);

  if (isLoading || !isInitialized) {
    return <AgoraLoader />;
  }

  if (!isConnected) {
    return <ResourceNotFound message="Oops! Nothing's here" />;
  }

  return <DelegateStatementForm form={form} delegate={delegate} />;
}
