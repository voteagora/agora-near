"use client";

import DelegateProfile from "@/components/Delegates/DelegateProfile/DelegateProfile";
import ResourceNotFound from "@/components/shared/ResourceNotFound/ResourceNotFound";

import DelegateStatementWrapper from "@/components/Delegates/DelegateStatement/DelegateStatementWrapper";
import VotesContainerWrapper from "@/components/Delegates/DelegateVotes/VotesContainerWrapper";
import DelegationsContainerWrapper from "@/components/Delegates/Delegations/DelegationsContainerWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDelegateProfile } from "@/hooks/useDelegateProfile";
import { useVotingPower } from "@/hooks/useVotingPower";
import { useNear } from "@/contexts/NearContext";
import { useProposalConfig } from "@/hooks/useProposalConfig";
import { useDelegateEndorsement } from "@/hooks/useDelegateEndorsement";

export const DelegateProfileContent = ({ address }: { address: string }) => {
  const {
    data: delegate,
    isLoading: isLoadingProfile,
    isError,
  } = useDelegateProfile({
    accountId: address,
  });

  const { data: votingPower, isLoading: isLoadingVotingPower } =
    useVotingPower(address);

  const { signedAccountId } = useNear();
  const { config } = useProposalConfig();
  const { toggleEndorsement, isToggling } = useDelegateEndorsement();

  const isReviewer =
    signedAccountId && config?.reviewer_ids.includes(signedAccountId);

  const handleToggleEndorsement = () => {
    if (delegate) {
      toggleEndorsement({
        address,
        endorsed: !delegate.endorsed,
      });
    }
  };

  if (isLoadingProfile || isLoadingVotingPower) {
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 justify-between mt-12 w-full max-w-full">
        <Skeleton className="w-[350px] h-[50vh]" />
        <Skeleton className="w-full h-[75vh]" />
      </div>
    );
  }

  if (!delegate || isError) {
    return (
      <ResourceNotFound message="Hmm... can't find that account, please check again." />
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 justify-between mt-12 w-full max-w-full">
      <div className="flex flex-col static sm:sticky top-16 shrink-0 w-full sm:max-w-[350px]">
        {isReviewer && (
          <Button
            onClick={handleToggleEndorsement}
            disabled={isToggling}
            variant={delegate.endorsed ? "destructive" : "default"}
            className="mb-4 rounded-full"
          >
            {isToggling
              ? "Updating..."
              : delegate.endorsed
                ? "Remove Endorsement"
                : "Endorse Delegate"}
          </Button>
        )}
        <DelegateProfile
          profile={{
            address: address,
            twitter: delegate.twitter,
            discord: delegate.discord,
            email: delegate.email,
            warpcast: delegate.warpcast,
            topIssues: delegate.topIssues,
            statement: delegate.statement,
            endorsed: delegate.endorsed,
          }}
          stats={{
            votingPower,
            numOfDelegators: delegate.delegatedFromCount?.toString() ?? "0",
            participationRate: delegate.participationRate,
            votedFor: delegate.forCount?.toString() ?? "0",
            votedAgainst: delegate.againstCount?.toString() ?? "0",
            votedAbstain: delegate.abstainCount?.toString() ?? "0",
          }}
        />
      </div>
      <div className="flex flex-col sm:ml-12 min-w-0 flex-1 max-w-full">
        <Tabs defaultValue={"statement"} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="statement" variant="underlined">
              Statement
            </TabsTrigger>
            <TabsTrigger value="participation" variant="underlined">
              Participation
            </TabsTrigger>
            <TabsTrigger value="delegations" variant="underlined">
              Delegations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="statement">
            <DelegateStatementWrapper
              statement={delegate.statement ?? ""}
              topIssues={delegate.topIssues ?? []}
              address={address}
            />
          </TabsContent>
          <TabsContent value="participation">
            <VotesContainerWrapper address={address} />
          </TabsContent>
          <TabsContent value="delegations">
            <DelegationsContainerWrapper address={address} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
