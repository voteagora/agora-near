import { fetchNeedsMyVoteProposals as apiFetchNeedsMyVoteProposals } from "@/app/api/common/proposals/getNeedsMyVoteProposals";
import {
  fetchDraftProposalForSponsor as apiFetchDraftProposalsForSponsorship,
  fetchDraftProposals as apiFetchDraftProposals,
  fetchProposals as apiFetchProposals,
} from "@/app/api/common/proposals/getProposals";
import { fetchVotableSupply as apiFetchVotableSupply } from "@/app/api/common/votableSupply/getVotableSupply";
import { fetchGovernanceCalendar as apiFetchGovernanceCalendar } from "@/app/api/common/governanceCalendar/getGovernanceCalendar";
import Hero from "@/components/Hero/Hero";
import NeedsMyVoteProposalsList from "@/components/Proposals/NeedsMyVoteProposalsList/NeedsMyVoteProposalsList";
import ProposalsList from "@/components/Proposals/ProposalsList/ProposalsList";
import { proposalsFilterOptions } from "@/lib/constants";
import Tenant from "@/lib/tenant/tenant";
import MyDraftProposals from "@/components/Proposals/DraftProposals/MyDraftProposals";
import MySponsorshipRequests from "@/components/Proposals/DraftProposals/MySponsorshipRequests";
import { PaginationParams } from "@/app/lib/pagination";
import SubscribeDialogLauncher from "@/components/Notifications/SubscribeDialogRootLauncher";

async function fetchProposals(
  filter: string,
  pagination = { limit: 10, offset: 0 }
) {
  "use server";
  return {
    meta: {
      has_next: false,
      total_returned: 0,
      next_offset: 0,
    },
    data: [
      {
        id: "1",
        proposer: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        snapshotBlockNumber: 17000000,
        createdTime: new Date("2024-01-15T10:00:00Z"),
        startTime: new Date("2024-01-15T12:00:00Z"),
        startBlock: "17000100",
        endTime: new Date("2024-01-22T12:00:00Z"),
        endBlock: "17100000",
        cancelledTime: null,
        executedTime: null,
        executedBlock: null,
        queuedTime: null,
        markdowntitle: "Proposal to Upgrade Protocol Parameters",
        description:
          "This proposal aims to adjust key protocol parameters to improve efficiency and security.",
        quorum: BigInt("1000000000000000000000"), // 1000 tokens
        approvalThreshold: BigInt("500000000000000000000"), // 500 tokens
        proposalData: {
          options: [],
        },
        unformattedProposalData:
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        proposalResults: {
          for: BigInt("750000000000000000000"),
          against: BigInt("250000000000000000000"),
          abstain: BigInt("0"),
        },
        proposalType: "STANDARD" as const,
        status: "ACTIVE" as const,
        createdTransactionHash: "0x123...abc",
        cancelledTransactionHash: null,
        executedTransactionHash: null,
      },
    ],
  };
}

async function fetchNeedsMyVoteProposals(address: string) {
  "use server";
  return apiFetchNeedsMyVoteProposals(address);
}

async function fetchVotableSupply() {
  "use server";
  return apiFetchVotableSupply();
}

async function fetchGovernanceCalendar() {
  "use server";
  return apiFetchGovernanceCalendar();
}

export default async function ProposalsHome() {
  const { ui } = Tenant.current();

  if (!ui.toggle("proposals")) {
    return <div>Route not supported for namespace</div>;
  }

  const plmEnabled = ui.toggle("proposal-lifecycle")?.enabled;
  const supportsNotifications = ui.toggle("email-subscriptions")?.enabled;

  const [governanceCalendar, relevalntProposals, allProposals, votableSupply] =
    await Promise.all([
      fetchGovernanceCalendar(),
      fetchProposals(proposalsFilterOptions.relevant.filter),
      fetchProposals(proposalsFilterOptions.everything.filter),
      fetchVotableSupply(),
    ]);

  return (
    <div className="flex flex-col">
      {supportsNotifications && <SubscribeDialogLauncher />}
      <Hero page="proposals" />
      {plmEnabled && (
        <>
          <MyDraftProposals
            fetchDraftProposals={async (address) => {
              "use server";
              return apiFetchDraftProposals(address);
            }}
          />
          <MySponsorshipRequests
            fetchDraftProposals={async (address) => {
              "use server";
              return apiFetchDraftProposalsForSponsorship(address);
            }}
          />
        </>
      )}
      <NeedsMyVoteProposalsList
        fetchNeedsMyVoteProposals={fetchNeedsMyVoteProposals}
        votableSupply={votableSupply}
      />
      <ProposalsList
        initRelevantProposals={relevalntProposals}
        initAllProposals={allProposals}
        fetchProposals={async (
          pagination: PaginationParams,
          filter: string
        ) => {
          "use server";
          return fetchProposals(filter, pagination);
        }}
        governanceCalendar={governanceCalendar}
        votableSupply={votableSupply}
      />
    </div>
  );
}
