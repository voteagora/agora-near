"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNear } from "@/contexts/NearContext";
import { createDelegateStatement } from "@/lib/api/delegates/requests";

import Tenant from "@/lib/tenant/tenant";
import { useDelegateStatementStore } from "@/stores/delegateStatement";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type UseFormReturn, useWatch } from "react-hook-form";
import { type DelegateStatementFormValues } from "./CurrentDelegateStatement";
import DelegateStatementFormSection from "./DelegateStatementFormSection";
import OtherInfoFormSection from "./OtherInfoFormSection";
import TopIssuesFormSection from "./TopIssuesFormSection";
import DelegateProfile from "../Delegates/DelegateProfile/DelegateProfile";
import { DelegateProfile as DelegateProfileType } from "@/lib/api/delegates/types";

export default function DelegateStatementForm({
  form,
  delegate,
}: {
  form: UseFormReturn<DelegateStatementFormValues>;
  delegate?: DelegateProfileType;
}) {
  const router = useRouter();
  const { ui } = Tenant.current();
  const { signMessage, signedAccountId, networkId } = useNear();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const hasTopIssues = Boolean(
    ui.governanceIssues && ui.governanceIssues.length > 0
  );

  const agreeCodeConduct = useWatch({
    control: form.control,
    name: "agreeCodeConduct",
  });

  const setSaveSuccess = useDelegateStatementStore(
    (state) => state.setSaveSuccess
  );

  async function onSubmit(values: DelegateStatementFormValues) {
    if (!agreeCodeConduct) {
      return;
    }
    if (!signedAccountId) {
      throw new Error("signer not available");
    }

    values.topIssues = values.topIssues.filter((issue) => issue.value !== "");

    const {
      discord,
      delegateStatement,
      email,
      twitter,
      warpcast,
      topIssues,
      notificationPreferences,
    } = values;

    // User will only sign what they are seeing on the frontend
    const body = {
      address: signedAccountId,
      twitter,
      discord,
      email,
      warpcast,
      statement: delegateStatement,
      topIssues,
      notificationPreferences,
      agreeCodeConduct: values.agreeCodeConduct,
    };

    const serializedBody = JSON.stringify(body, undefined, "\t");

    const signature = await signMessage({ message: serializedBody });

    if (!signature) {
      setSubmissionError("Signature failed, please try again");
      return;
    }

    const response = await createDelegateStatement(
      {
        address: signedAccountId,
        message: serializedBody,
        signature: signature.signature,
        publicKey: signature.publicKey,
        twitter,
        discord,
        email,
        warpcast,
        topIssues,
        agreeCodeConduct: agreeCodeConduct,
        statement: delegateStatement,
        notification_preferences: {
          wants_proposal_created_email:
            notificationPreferences.wants_proposal_created_email,
          wants_proposal_ending_soon_email:
            notificationPreferences.wants_proposal_ending_soon_email,
        },
      },
      networkId
    );

    if (!response) {
      setSubmissionError(
        "There was an error submitting your form, please try again"
      );
      return;
    }

    setSaveSuccess(true);
    router.push(`/delegates/${signedAccountId}`);
  }

  const canSubmit =
    !!signedAccountId &&
    !form.formState.isSubmitting &&
    !!form.formState.isValid &&
    !!agreeCodeConduct;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-16 justify-between mt-12 w-full max-w-full">
      {delegate && (
        <div className="flex flex-col static sm:sticky top-16 shrink-0 w-full sm:max-w-[350px]">
          <DelegateProfile
            isEditMode
            profile={{
              address: delegate.address ?? "",
              statement: delegate.statement ?? "",
              twitter: delegate.twitter,
              discord: delegate.discord,
              warpcast: delegate.warpcast,
            }}
          />
        </div>
      )}
      <div className="flex flex-col w-full">
        <div className="flex flex-col bg-neutral border rounded-xl border-line shadow-newDefault">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DelegateStatementFormSection form={form} />
              {hasTopIssues && <TopIssuesFormSection form={form} />}

              <OtherInfoFormSection form={form} />

              <div className="flex flex-col sm:flex-row justify-end sm:justify-between items-stretch sm:items-center gap-4 py-8 px-6 flex-wrap">
                <span className="text-sm text-primary">
                  Tip: you can always come back and edit your profile at any
                  time.
                </span>

                <Button
                  variant="elevatedOutline"
                  className="py-3 px-4 text-primary"
                  disabled={!canSubmit}
                  type="submit"
                >
                  Submit delegate profile
                </Button>
                {form.formState.isSubmitted && !agreeCodeConduct && (
                  <span className="text-red-700 text-sm">
                    You must agree with the code of conduct to continue
                  </span>
                )}
                {submissionError && (
                  <span className="text-red-700 text-sm">
                    {submissionError}
                  </span>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
