"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateProposal } from "@/hooks/useCreateProposal";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { utils } from "near-api-js";
import { SubmitHandler, useForm } from "react-hook-form";

const Required = () => <span className="text-red-500">*</span>;

type Inputs = {
  title: string;
  description: string;
  link: string;
};

export function NearProposalModal({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { config } = useProposalConfig();
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
      voting_options: ["Yes", "No"],
    });
  };

  if (!config) return null;

  if (createProposalError) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-red-500">
            {createProposalError.message}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Create Proposal</h3>
        <p className="text-sm text-muted-foreground">
          Create a new proposal for the community to vote on.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <InfoItem
              label="Base Proposal Fee"
              value={utils.format.formatNearAmount(config.base_proposal_fee)}
              unit="NEAR"
            />
            <InfoItem
              label="Vote Storage Fee"
              value={utils.format.formatNearAmount(config.vote_storage_fee)}
              unit="NEAR"
            />
            <InfoItem
              label="Max Voting Options"
              value={config.max_number_of_voting_options.toString()}
            />
            <InfoItem
              label="Voting Duration"
              value={`${parseInt(config.voting_duration_ns) / 1e9 / (60 * 60 * 24)} days`}
              isRaw
            />
          </div>

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
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md"
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
                    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                })}
              />
              {errors.link?.type === "pattern" && (
                <p className="text-red-500">Valid link format is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Voting Options (Max: {config.max_number_of_voting_options})
              </label>
              <div className="space-y-2">
                {["Yes", "No"].map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={option} placeholder="Enter option" disabled />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreatingProposal}>
            {isCreatingProposal ? "Creating..." : "Create Proposal"}
          </Button>
        </div>
      </form>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  unit?: string;
  isRaw?: boolean;
}

const InfoItem = ({ label, value, unit, isRaw }: InfoItemProps) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-lg font-medium">
      {isRaw ? value : `${value}${unit ? ` ${unit}` : ""}`}
    </p>
  </div>
);
