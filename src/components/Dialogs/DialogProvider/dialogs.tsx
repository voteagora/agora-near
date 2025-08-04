import { DialogDefinitions } from "./types";
import { DelegateDialog } from "../DelegateDialog/DelegateDialog";
import { UndelegateDialog } from "../UndelegateDialog/UndelegateDialog";
import { NearVoteDialog } from "../VoteDialog";
import { ProposalInfo, VotingConfig } from "@/lib/contracts/types/voting";
import { VoteOptionsDialog } from "../VoteOptionsDialog";
import { ProposalModal } from "@/components/Proposals/Proposals/ProposalModal";
import { LockDialogSource, NearLockDialog } from "../LockDialog/index";
import { VeNearOnboardingModal } from "@/app/near/VeNearOnboardingModal";
import { StakingDialog, StakingSource } from "../StakingDialog/StakingDialog";
import { VotingPowerProjectionsDialog } from "../VotingPowerProjectionsDialog";
import { UnlockDialog } from "../UnlockDialog";
import { EncourageConnectWalletDialog } from "@/components/Delegates/Delegations/EncourageConnectWalletDialog";
import SubscribeDialog from "@/components/Notifications/SubscribeDialog";

export type DialogType =
  | DelegateDialogType
  | UndelegateDialogType
  | NearProposalDialogType
  | NearVoteDialogType
  | VoteOptionsDialogType
  | NearLockDialogType
  | VeNearOnboardingDialogType
  | StakingDialogType
  | VotingPowerProjectionsDialogType
  | UnlockDialogType
  | EncourageConnectWalletDialogType
  | SubscribeDialogType;

export type DelegateDialogType = {
  type: "NEAR_DELEGATE";
  params: {
    delegateAddress: string;
  };
};

export type UndelegateDialogType = {
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

export type StakingDialogType = {
  type: "NEAR_STAKING";
  className?: string;
  params: {
    prefilledAmount?: string;
    source: StakingSource;
  };
};

export type NearVoteDialogType = {
  type: "NEAR_VOTE";
  params: {
    proposal: ProposalInfo;
    config: VotingConfig;
    preSelectedVote?: number;
    onSuccess?: () => void;
  };
};

export type VoteOptionsDialogType = {
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

export type UnlockDialogType = {
  type: "NEAR_UNLOCK";
  params: Record<string, never>;
};

export type EncourageConnectWalletDialogType = {
  type: "ENCOURAGE_CONNECT_WALLET";
  params: {};
};

export type SubscribeDialogType = {
  type: "NEAR_SUBSCRIBE";
  params: { type: "root" | "vote" };
};

export const dialogs: DialogDefinitions<DialogType> = {
  NEAR_DELEGATE: ({ delegateAddress }, closeDialog) => {
    return (
      <DelegateDialog
        delegateAddress={delegateAddress}
        closeDialog={closeDialog}
      />
    );
  },
  NEAR_UNDELEGATE: ({ delegateAddress }, closeDialog) => {
    return (
      <UndelegateDialog
        delegateAddress={delegateAddress}
        closeDialog={closeDialog}
      />
    );
  },
  NEAR_PROPOSAL: () => {
    return <ProposalModal />;
  },
  NEAR_LOCK: (params, closeDialog) => {
    return <NearLockDialog closeDialog={closeDialog} {...params} />;
  },
  NEAR_VOTE: (
    { proposal, config, preSelectedVote, onSuccess },
    closeDialog
  ) => (
    <NearVoteDialog
      proposal={proposal}
      config={config}
      preSelectedVote={preSelectedVote}
      closeDialog={closeDialog}
      onSuccess={onSuccess}
    />
  ),
  NEAR_VOTE_OPTIONS: ({ proposal, config }, closeDialog) => (
    <VoteOptionsDialog
      proposal={proposal}
      config={config}
      closeDialog={closeDialog}
    />
  ),
  VENEAR_ONBOARDING: (_, closeDialog) => {
    return <VeNearOnboardingModal closeDialog={closeDialog} />;
  },
  NEAR_STAKING: (params, closeDialog) => {
    return <StakingDialog closeDialog={closeDialog} {...params} />;
  },
  VOTING_POWER_PROJECTIONS: ({ votingPower }, closeDialog) => {
    return (
      <VotingPowerProjectionsDialog
        closeDialog={closeDialog}
        votingPower={votingPower}
      />
    );
  },
  NEAR_UNLOCK: (_, closeDialog) => {
    return <UnlockDialog closeDialog={closeDialog} />;
  },
  ENCOURAGE_CONNECT_WALLET: ({}, closeDialog) => (
    <EncourageConnectWalletDialog closeDialog={closeDialog} />
  ),
  NEAR_SUBSCRIBE: ({ type }, closeDialog) => {
    return <SubscribeDialog closeDialog={closeDialog} type={type} />;
  },
};
