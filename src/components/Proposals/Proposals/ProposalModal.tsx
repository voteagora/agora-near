"use client";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import TokenAmount from "@/components/shared/TokenAmount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProposal } from "@/hooks/useCreateProposal";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { NEAR_VOTING_OPTIONS } from "@/lib/constants";
import { SubmitHandler, useForm } from "react-hook-form";

const Required = () => <span className="text-red-500">*</span>;

type Inputs = {
  title: string;
  description: string;
  link: string;
};

export function ProposalModal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { config, votingDuration, isLoading } = useProposalConfig();
  const { createProposal, isCreatingProposal, createProposalError } =
    useCreateProposal({
      baseFee: config?.base_proposal_fee || "0",
      storageFee: config?.vote_storage_fee || "0",
    });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createProposal({
      title: data.title,
      description: data.description,
      link: data.link,
      voting_options: NEAR_VOTING_OPTIONS,
    });
  };

  if (!config || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-4 min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Create Proposal</h3>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Proposals must adhere to the style guide and be approved by the
            Screening Committee.
          </p>
          <p className="text-sm text-muted-foreground">
            Once approved, voting will be open for {votingDuration}.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 py-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title <Required />
              </label>
              <Input
                placeholder="Enter proposal title"
                {...register("title", { required: true })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description <Required />
              </label>
              <Textarea
                className="h-[200px] resize-none"
                placeholder="Enter proposal description"
                {...register("description", { required: true })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Link <Required />
              </label>
              <Input
                placeholder="Enter proposal link"
                {...register("link", {
                  required: true,
                  pattern:
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                })}
              />
              {errors.link?.type === "pattern" && (
                <p className="text-red-500">Valid link format is required</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isCreatingProposal}>
              {isCreatingProposal ? "Creating..." : "Create Proposal"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Creating a proposal requires a{" "}
              <TokenAmount amount={config.base_proposal_fee} /> fee, and a{" "}
              <TokenAmount
                amount={config.vote_storage_fee}
                maximumSignificantDigits={5}
              />{" "}
              deposit
            </p>
          </div>
        </div>
      </form>
      {createProposalError && (
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-red-500">
              {createProposalError.message}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
