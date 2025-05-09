"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import DelegateStatementForm from "@/components/DelegateStatement/DelegateStatementForm";
import AgoraLoader, {
  LogoLoader,
} from "@/components/shared/AgoraLoader/AgoraLoader";
import { useNear } from "@/contexts/NearContext";
import { DelegateStatement } from "@/lib/api/delegates/types";
import Tenant from "@/lib/tenant/tenant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ResourceNotFound from "../shared/ResourceNotFound/ResourceNotFound";

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
  const shouldHideAgoraBranding = ui.hideAgoraBranding;
  const { signedAccountId } = useNear();
  const isConnected = !!signedAccountId;
  const [loading, setLoading] = useState<boolean>(true);
  const [delegateStatement, setDelegateStatement] =
    useState<DelegateStatement | null>(null);

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
    (delegateStatement: DelegateStatement | null) => {
      return {
        agreeCodeConduct: !requireCodeOfConduct,
        discord: delegateStatement?.discord || "",
        delegateStatement: delegateStatement?.payload?.delegateStatement || "",
        email: delegateStatement?.email || "",
        twitter: delegateStatement?.twitter || "",
        warpcast: delegateStatement?.warpcast || "",
        topIssues:
          (delegateStatement?.payload?.topIssues ?? []).length > 0
            ? delegateStatement?.payload?.topIssues
            : defaultIssues,
      };
    },
    [requireCodeOfConduct, defaultIssues]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(delegateStatement),
    mode: "onChange",
  });

  useEffect(() => {
    // TODO: Fetch delegate statement from API
    const fetchedDelegateStatement = null;
    setDelegateStatement(fetchedDelegateStatement);
    form.reset(getDefaultValues(fetchedDelegateStatement));
    setLoading(false);
  }, [form, getDefaultValues]);

  if (!isConnected) {
    return <ResourceNotFound message="Oops! Nothing's here" />;
  }

  return loading ? (
    shouldHideAgoraBranding ? (
      <LogoLoader />
    ) : (
      <AgoraLoader />
    )
  ) : (
    <DelegateStatementForm form={form} />
  );
}
