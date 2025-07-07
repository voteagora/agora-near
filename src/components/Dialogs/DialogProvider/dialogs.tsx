import { DialogDefinitions } from "./types";
import { NearDelegateDialog } from "../DelegateDialog/NearDelegateDialog";
import { NearUndelegateDialog } from "../UndelegateDialog/NearUndelegateDialog";
import { NearVoteDialog } from "../NearVoteDialog";
import { ProposalInfo, VotingConfig } from "@/lib/contracts/types/voting";
import { NearVoteOptionsDialog } from "../NearVoteOptionsDialog";
import { NearProposalModal } from "@/components/Proposals/NearProposals/NearProposalModal";
import { LockDialogSource, NearLockDialog } from "../NearLockDialog/index";
import { VeNearOnboardingModal } from "@/app/near/VeNearOnboardingModal";
import {
  NearStakingDialog,
  StakingSource,
} from "../NearStakingDialog/NearStakingDialog";
import { VotingPowerProjectionsDialog } from "../VotingPowerProjectionsDialog";
import { NearUnlockDialog } from "../NearUnlockDialog";

export type DialogType =
  | NearDelegateDialogType
  | NearUndelegateDialogType
  | NearProposalDialogType
  | OpenGithubPRDialog
  | OpenGithubPRDialog
  | NearVoteDialogType
  | NearVoteOptionsDialogType
  | NearLockDialogType
  | VeNearOnboardingDialogType
  | NearStakingDialogType
  | VotingPowerProjectionsDialogType
  | NearUnlockDialogType;
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

export type NearVoteDialogType = {
  type: "NEAR_VOTE";
  params: {
    proposal: ProposalInfo;
    config: VotingConfig;
    preSelectedVote?: number;
    onSuccess?: () => void;
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

export type NearUnlockDialogType = {
  type: "NEAR_UNLOCK";
  params: Record<string, never>;
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
  NEAR_UNLOCK: (_, closeDialog) => {
    return <NearUnlockDialog closeDialog={closeDialog} />;
  },
};
