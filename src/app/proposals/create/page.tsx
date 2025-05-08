"use client";

import { HStack } from "@/components/Layout/Stack";
import CreateProposalForm from "@/components/Proposals/ProposalCreation/CreateProposalForm";
import InfoPanel from "@/components/Proposals/ProposalCreation/InfoPanel";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useProposalConfig } from "@/hooks/useProposalConfig";

export default function CreateProposalPage() {
  const { config, isLoading } = useProposalConfig();

  if (isLoading || !config) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <HStack
      justifyContent="justify-between"
      gap={16}
      className="w-full max-w-[76rem] mt-12 mb-8 flex flex-col-reverse items-center sm:flex-row sm:items-start"
    >
      <CreateProposalForm votingConfig={config} />
      <div className=" shrink-0 w-full sm:w-[24rem]">
        <InfoPanel votingConfig={config} />
      </div>
    </HStack>
  );
}
