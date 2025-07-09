"use client";

import { HStack, VStack } from "@/components/Layout/Stack";
import { VotingConfig } from "@/lib/contracts/types/voting";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import ProposalDetailsForm from "./ProposalDetailsForm";
import SubmitButton from "./SubmitButton";
import { NEAR_VOTING_OPTIONS } from "@/lib/constants";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  link: z
    .string()
    .min(1, "Link is required")
    .url("Must be a valid URL")
    .refine((url) => url.includes("https://gov.near.org/"), {
      message:
        "Proposal links must be from https://gov.near.org/. Create a forum post first to gather community support.",
    }),
  options: z
    .array(
      z.object({
        title: z.string().min(1, "Option title is required"),
      })
    )
    .min(2, "At least two options are required"),
});

export type FormValues = z.infer<typeof formSchema>;

type CreateProposalFormProps = {
  votingConfig: VotingConfig;
};

export default function CreateProposalForm({
  votingConfig,
}: CreateProposalFormProps) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      options: NEAR_VOTING_OPTIONS.map((title) => ({ title })),
    },
    mode: "onBlur",
  });

  return (
    <VStack className="w-full">
      <FormProvider {...methods}>
        <VStack className="bg-neutral rounded-xl border border-line shadow-newDefault">
          <div className="p-8 border-b border-line">
            <h1 className="text-2xl font-extrabold pb-1 text-primary">
              Create proposal
            </h1>
            <ProposalDetailsForm />
          </div>
          <HStack
            justifyContent="justify-between"
            alignItems="items-center"
            className="p-8"
          >
            <SubmitButton
              baseFee={votingConfig.base_proposal_fee || "0"}
              voteStorageFee={votingConfig.vote_storage_fee || "0"}
            />
          </HStack>
        </VStack>
      </FormProvider>
    </VStack>
  );
}
