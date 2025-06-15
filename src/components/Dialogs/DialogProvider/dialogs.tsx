import { DialogDefinitions } from "./types";
import { DelegateDialog } from "../DelegateDialog/DelegateDialog";
import { NearDelegateDialog } from "../DelegateDialog/NearDelegateDialog";
import { NearUndelegateDialog } from "../UndelegateDialog/NearUndelegateDialog";
import { SwitchNetwork } from "../SwitchNetworkDialog/SwitchNetworkDialog";
import { CastProposalDialog } from "@/components/Proposals/ProposalCreation/CastProposalDialog";
import {
  CastVoteDialog,
  SupportTextProps,
} from "@/components/Proposals/ProposalPage/CastVoteDialog/CastVoteDialog";
import { AdvancedDelegateDialog } from "../AdvancedDelegateDialog/AdvancedDelegateDialog";
import { ApprovalCastVoteDialog } from "@/components/Proposals/ProposalPage/ApprovalCastVoteDialog/ApprovalCastVoteDialog";
import { Proposal } from "@/app/api/common/proposals/proposal";
import RetroPGFShareCardDialog from "@/components/RetroPGF/RetroPGFShareCardDialog";
import { DelegateChunk } from "@/app/api/common/delegates/delegate";
import { VotingPowerData } from "@/app/api/common/voting-power/votingPower";
import { MissingVote } from "@/lib/voteUtils";
import {
  DelegateePayload,
  Delegation,
} from "@/app/api/common/delegations/delegation";
import { Chain } from "viem/chains";
import { DeleteDraftProposalDialog } from "@/app/proposals/draft/components/DeleteDraftButton";
import CreateDraftProposalDialog from "@/app/proposals/draft/components/dialogs/CreateDraftProposalDialog";
import UpdateDraftProposalDialog from "@/app/proposals/draft/components/dialogs/UpdateDraftProposalDialog";
import SponsorOnchainProposalDialog from "@/app/proposals/draft/components/dialogs/SponsorOnchainProposalDialog";
import SponsorSnapshotProposalDialog from "@/app/proposals/draft/components/dialogs/SponsorSnapshotProposalDialog";
import AddGithubPRDialog from "@/app/proposals/draft/components/dialogs/AddGithubPRDialog";
import { StakedDeposit } from "@/lib/types";
import { fetchAllForAdvancedDelegation } from "@/app/delegates/actions";
import { PartialDelegationDialog } from "@/components/Dialogs/PartialDelegateDialog/PartialDelegationDialog";
import SubscribeDialog from "@/components/Notifications/SubscribeDialog";
import { ShareDialog as ShareVoteDialog } from "@/components/Proposals/ProposalPage/ShareVoteDialog/ShareVoteDialog";
import { Vote } from "@/app/api/common/votes/vote";
import { SimulationReportDialog } from "../SimulationReportDialog/SimulationReportDialog";
import { StructuredSimulationReport } from "@/lib/seatbelt/types";
import { NearVoteDialog } from "../NearVoteDialog";
import { ProposalInfo, VotingConfig } from "@/lib/contracts/types/voting";
import { NearVoteOptionsDialog } from "../NearVoteOptionsDialog";
import { UndelegateDialog } from "../UndelegateDialog/UndelegateDialog";
import { NearProposalModal } from "@/components/Proposals/NearProposals/NearProposalModal";
import { LockDialogSource, NearLockDialog } from "../NearLockDialog/index";
import { VeNearOnboardingModal } from "@/app/near/VeNearOnboardingModal";
import {
  NearStakingDialog,
  StakingSource,
} from "../NearStakingDialog/NearStakingDialog";
import { VotingPowerProjectionsDialog } from "../VotingPowerProjectionsDialog";

export type DialogType =
  | AdvancedDelegateDialogType
  | ApprovalCastVoteDialogType
  | CastProposalDialogType
  | CastVoteDialogType
  | CreateDraftProposalDialog
  | DelegateDialogType
  | NearDelegateDialogType
  | NearUndelegateDialogType
  | NearProposalDialogType
  | DeleteDraftProposalDialog
  | OpenGithubPRDialog
  | PartialDelegateDialogType
  | RetroPGFShareCardDialog
  | SponsorOnchainDraftProposalDialog
  | SponsorSnapshotDraftProposalDialog
  | SwithcNetworkDialogType
  | UndelegateDialogType
  | UpdateDraftProposalDialog
  | OpenGithubPRDialog
  | SubscribeDialog
  | ShareVoteDialogType
  | SimulationReportDialogType
  | NearVoteDialogType
  | NearVoteOptionsDialogType
  | NearLockDialogType
  | VeNearOnboardingDialogType
  | NearStakingDialogType
  | VotingPowerProjectionsDialogType;
// | FaqDialogType

export type NearDelegateDialogType = {
  type: "NEAR_DELEGATE";
  params: {
    delegateAddress: string;
  };
};

export type NearUndelegateDialogType = {
  type: "NEAR_UNDELEGATE";
  params: {
    delegateAddress: string;
  };
};

export type NearProposalDialogType = {
  type: "NEAR_PROPOSAL";
  params: Record<string, never>;
};

export type NearLockDialogType = {
  type: "NEAR_LOCK";
  className?: string;
  params: {
    source: LockDialogSource;
    preSelectedTokenId?: string;
  };
};

export type NearStakingDialogType = {
  type: "NEAR_STAKING";
  className?: string;
  params: {
    prefilledAmount?: string;
    source: StakingSource;
  };
};

export type DelegateDialogType = {
  type: "DELEGATE";
  params: {
    delegate: DelegateChunk;
    fetchBalanceForDirectDelegation: (
      addressOrENSName: string
    ) => Promise<bigint>;
    fetchDirectDelegatee: (
      addressOrENSName: string
    ) => Promise<DelegateePayload | null>;
  };
};

export type UndelegateDialogType = {
  type: "UNDELEGATE";
  params: {
    delegate: DelegateChunk;
    fetchBalanceForDirectDelegation: (
      addressOrENSName: string
    ) => Promise<bigint>;
    fetchDirectDelegatee: (
      addressOrENSName: string
    ) => Promise<DelegateePayload | null>;
  };
};

export type AdvancedDelegateDialogType = {
  type: "ADVANCED_DELEGATE";
  params: {
    target: string;
    fetchAllForAdvancedDelegation: typeof fetchAllForAdvancedDelegation;
  };
};

export type PartialDelegateDialogType = {
  type: "PARTIAL_DELEGATE";
  params: {
    delegate: DelegateChunk;
    fetchCurrentDelegatees: (addressOrENSName: string) => Promise<Delegation[]>;
  };
};

export type CastProposalDialogType = {
  type: "CAST_PROPOSAL";
  params: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    txHash?: string;
  };
};

export type RetroPGFShareCardDialog = {
  transparent: boolean;
  type: "RETROPGF_SHARE_CARD";
  params: {
    awarded: string;
    displayName: string;
    id: string;
    profileImageUrl: string | null;
  };
};

export type SwithcNetworkDialogType = {
  type: "SWITCH_NETWORK";
  params: {
    chain: Chain;
  };
};

export type StaleDepositAddDialogType = {
  type: "STAKE_DEPOSIT_ADD";
  params: {
    deposit: StakedDeposit;
  };
};

export type StakeDepositWithdrawDialogType = {
  type: "STAKE_DEPOSIT_WITHDRAW";
  params: {
    deposit: StakedDeposit;
  };
};

// export type FaqDialogType = {
//   type: "FAQ";
//   params: {};
// };

export type CastVoteDialogProps = {
  proposalId: string;
  reason: string;
  supportType: SupportTextProps["supportType"];
  closeDialog: () => void;
  delegate: any;
  votingPower: VotingPowerData;
  authorityChains: string[][];
  missingVote: MissingVote;
};

export type CastVoteDialogType = {
  type: "CAST_VOTE";
  params: Omit<CastVoteDialogProps, "closeDialog">;
};

export type ShareVoteDialogType = {
  type: "SHARE_VOTE";
  params: {
    forPercentage: number;
    againstPercentage: number;
    blockNumber: string | null;
    endsIn: string | null;
    voteDate: string | null;
    supportType: SupportTextProps["supportType"];
    voteReason: string;
    proposalId: string;
    proposalTitle: string;
    proposalType: "OPTIMISTIC" | "STANDARD" | "APPROVAL" | "SNAPSHOT";
    proposal: Proposal;
    newVote: {
      support: string;
      reason: string;
      params: string[];
      weight: string;
    };
    totalOptions: number;
    votes: Vote[];
    options: {
      description: string;
      votes: string;
      votesAmountBN: string;
      totalVotingPower: string;
      proposalSettings: any;
      thresholdPosition: number;
      isApproved: boolean;
    }[];
  };
  className?: string;
};

export type ApprovalCastVoteDialogProps = {
  proposal: Proposal;
  hasStatement: boolean;
  votingPower: VotingPowerData;
  authorityChains: string[][];
  missingVote: MissingVote;
  closeDialog: () => void;
};

export type ApprovalCastVoteDialogType = {
  type: "APPROVAL_CAST_VOTE";
  params: Omit<ApprovalCastVoteDialogProps, "closeDialog">;
};

export type DeleteDraftProposalDialog = {
  type: "DELETE_DRAFT_PROPOSAL";
  params: { proposalId: number };
};

export type CreateDraftProposalDialog = {
  type: "CREATE_DRAFT_PROPOSAL";
  params: { redirectUrl: string; githubUrl: string };
};

export type UpdateDraftProposalDialog = {
  type: "UPDATE_DRAFT_PROPOSAL";
  params: { redirectUrl: string };
};

export type SponsorSnapshotDraftProposalDialog = {
  type: "SPONSOR_SNAPSHOT_DRAFT_PROPOSAL";
  params: { redirectUrl: string; snapshotLink: string };
};

export type SponsorOnchainDraftProposalDialog = {
  type: "SPONSOR_ONCHAIN_DRAFT_PROPOSAL";
  params: { redirectUrl: string; txHash: `0x${string}` };
};

export type OpenGithubPRDialog = {
  type: "OPEN_GITHUB_PR";
  params: { redirectUrl: string; githubUrl: string };
};

export type SubscribeDialog = {
  type: "SUBSCRIBE";
  params: { type: "root" | "vote" };
};

export type SimulationReportDialogType = {
  type: "SIMULATION_REPORT";
  params: {
    report: StructuredSimulationReport | null;
  };
  className?: string;
};

export type NearVoteDialogType = {
  type: "NEAR_VOTE";
  params: {
    proposal: ProposalInfo;
    config: VotingConfig;
    preSelectedVote?: number;
  };
};

export type NearVoteOptionsDialogType = {
  type: "NEAR_VOTE_OPTIONS";
  params: {
    proposal: ProposalInfo;
    config: VotingConfig;
  };
};

export type VeNearOnboardingDialogType = {
  type: "VENEAR_ONBOARDING";
  params: Record<never, never>;
};

export type VotingPowerProjectionsDialogType = {
  type: "VOTING_POWER_PROJECTIONS";
  className?: string;
  params: {
    votingPower: string;
  };
};

export const dialogs: DialogDefinitions<DialogType> = {
  NEAR_DELEGATE: ({ delegateAddress }, closeDialog) => {
    return (
      <NearDelegateDialog
        delegateAddress={delegateAddress}
        closeDialog={closeDialog}
      />
    );
  },
  NEAR_UNDELEGATE: ({ delegateAddress }, closeDialog) => {
    return (
      <NearUndelegateDialog
        delegateAddress={delegateAddress}
        closeDialog={closeDialog}
      />
    );
  },
  NEAR_PROPOSAL: () => {
    return <NearProposalModal />;
  },
  NEAR_LOCK: (params, closeDialog) => {
    return <NearLockDialog closeDialog={closeDialog} {...params} />;
  },
  DELEGATE: (
    { delegate, fetchBalanceForDirectDelegation, fetchDirectDelegatee },
    closeDialog
  ) => {
    return (
      <DelegateDialog
        delegate={delegate}
        fetchBalanceForDirectDelegation={fetchBalanceForDirectDelegation}
        fetchDirectDelegatee={fetchDirectDelegatee}
      />
    );
  },
  UNDELEGATE: (
    { delegate, fetchBalanceForDirectDelegation, fetchDirectDelegatee },
    closeDialog
  ) => {
    return (
      <UndelegateDialog
        delegate={delegate}
        fetchBalanceForDirectDelegation={fetchBalanceForDirectDelegation}
        fetchDirectDelegatee={fetchDirectDelegatee}
      />
    );
  },
  PARTIAL_DELEGATE: ({ delegate, fetchCurrentDelegatees }, closeDialog) => {
    return (
      <PartialDelegationDialog
        closeDialog={closeDialog}
        delegate={delegate}
        fetchCurrentDelegatees={fetchCurrentDelegatees}
      />
    );
  },
  ADVANCED_DELEGATE: (
    { target, fetchAllForAdvancedDelegation },
    closeDialog
  ) => {
    return (
      <AdvancedDelegateDialog
        target={target}
        fetchAllForAdvancedDelegation={fetchAllForAdvancedDelegation}
        completeDelegation={closeDialog}
      />
    );
  },
  CAST_PROPOSAL: ({ isError, isLoading, isSuccess, txHash }, closeDialog) => {
    return (
      <CastProposalDialog
        isError={isError}
        isLoading={isLoading}
        isSuccess={isSuccess}
        txHash={txHash}
        closeDialog={closeDialog}
      />
    );
  },
  CAST_VOTE: (
    {
      proposalId,
      reason,
      supportType,
      delegate,
      votingPower,
      authorityChains,
      missingVote,
    },
    closeDialog
  ) => {
    return (
      <CastVoteDialog
        proposalId={proposalId}
        reason={reason}
        supportType={supportType}
        closeDialog={closeDialog}
        delegate={delegate}
        votingPower={votingPower}
        authorityChains={authorityChains}
        missingVote={missingVote}
      />
    );
  },
  APPROVAL_CAST_VOTE: (
    { proposal, hasStatement, votingPower, authorityChains, missingVote },
    closeDialog
  ) => {
    return (
      <ApprovalCastVoteDialog
        proposal={proposal}
        hasStatement={hasStatement}
        closeDialog={closeDialog}
        votingPower={votingPower}
        authorityChains={authorityChains}
        missingVote={missingVote}
      />
    );
  },
  SHARE_VOTE: ({
    forPercentage,
    againstPercentage,
    blockNumber,
    endsIn,
    voteDate,
    supportType,
    voteReason,
    proposalId,
    proposalTitle,
    proposalType,
    proposal,
    totalOptions,
    options,
    votes,
    newVote,
  }) => {
    return (
      <ShareVoteDialog
        forPercentage={forPercentage}
        againstPercentage={againstPercentage}
        blockNumber={blockNumber}
        endsIn={endsIn}
        voteDate={voteDate}
        supportType={supportType}
        voteReason={voteReason}
        proposalId={proposalId}
        proposalTitle={proposalTitle}
        proposalType={proposalType}
        proposal={proposal}
        newVote={newVote}
        totalOptions={totalOptions}
        options={options}
        votes={votes}
      />
    );
  },
  RETROPGF_SHARE_CARD: (
    {
      awarded,
      displayName,
      id,
      profileImageUrl,
    }: {
      awarded: string;
      displayName: string;
      id: string;
      profileImageUrl: string | null;
    },
    closeDialog
  ) => {
    return (
      <RetroPGFShareCardDialog
        awarded={awarded}
        displayName={displayName}
        id={id}
        profileImageUrl={profileImageUrl}
        closeDialog={closeDialog}
      />
    );
  },
  SWITCH_NETWORK: ({ chain }: { chain: Chain }, closeDialog) => (
    <SwitchNetwork chain={chain} closeDialog={closeDialog} />
  ),
  DELETE_DRAFT_PROPOSAL: ({ proposalId }, closeDialog) => (
    <DeleteDraftProposalDialog
      closeDialog={closeDialog}
      proposalId={proposalId}
    />
  ),
  CREATE_DRAFT_PROPOSAL: ({ redirectUrl, githubUrl }) => (
    <CreateDraftProposalDialog
      redirectUrl={redirectUrl}
      githubUrl={githubUrl}
    />
  ),
  UPDATE_DRAFT_PROPOSAL: ({ redirectUrl }, closeDialog) => (
    <UpdateDraftProposalDialog redirectUrl={redirectUrl} />
  ),
  SPONSOR_ONCHAIN_DRAFT_PROPOSAL: ({ redirectUrl, txHash }, closeDialog) => (
    <SponsorOnchainProposalDialog
      redirectUrl={redirectUrl}
      txHash={txHash}
      closeDialog={closeDialog}
    />
  ),
  SPONSOR_SNAPSHOT_DRAFT_PROPOSAL: (
    { redirectUrl, snapshotLink },
    closeDialog
  ) => (
    <SponsorSnapshotProposalDialog
      redirectUrl={redirectUrl}
      snapshotLink={snapshotLink}
      closeDialog={closeDialog}
    />
  ),
  OPEN_GITHUB_PR: ({ redirectUrl, githubUrl }, closeDialog) => (
    <AddGithubPRDialog
      redirectUrl={redirectUrl}
      githubUrl={githubUrl}
      closeDialog={closeDialog}
    />
  ),
  SUBSCRIBE: ({ type }, closeDialog) => {
    return <SubscribeDialog closeDialog={closeDialog} type={type} />;
  },
  SIMULATION_REPORT: ({ report }, closeDialog) => (
    <SimulationReportDialog report={report} closeDialog={closeDialog} />
  ),
  NEAR_VOTE: ({ proposal, config, preSelectedVote }, closeDialog) => (
    <NearVoteDialog
      proposal={proposal}
      config={config}
      preSelectedVote={preSelectedVote}
      closeDialog={closeDialog}
    />
  ),
  NEAR_VOTE_OPTIONS: ({ proposal, config }, closeDialog) => (
    <NearVoteOptionsDialog
      proposal={proposal}
      config={config}
      closeDialog={closeDialog}
    />
  ),
  VENEAR_ONBOARDING: (_, closeDialog) => {
    return <VeNearOnboardingModal closeDialog={closeDialog} />;
  },
  NEAR_STAKING: (params, closeDialog) => {
    return <NearStakingDialog closeDialog={closeDialog} {...params} />;
  },
  VOTING_POWER_PROJECTIONS: ({ votingPower }, closeDialog) => {
    return (
      <VotingPowerProjectionsDialog
        closeDialog={closeDialog}
        votingPower={votingPower}
      />
    );
  },
  // FAQ: () => {
  //   return <FaqDialog />;
  // },
};
