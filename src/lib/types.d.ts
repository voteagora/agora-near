import { TENANT_NAMESPACES } from "./constants";
import { DelegateChunk } from "@/app/staking/components/delegates/DelegateCardList";
import { StaticImageData } from "next/image";

export type VoterStats = {
  voter: string;
  total_proposals: number;
  last_10_props: number;
};

export type TenantNamespace =
  (typeof TENANT_NAMESPACES)[keyof typeof TENANT_NAMESPACES];

export type TenantToken = {
  name: string;
  symbol: string;
  decimals: number;
};

export type RetroPGFProject = {
  id: string;
  bio: string;
  impactCategory: string[];
  displayName: string;
  websiteUrl: string;
  applicant: {
    address: {
      address: string;
    };
    id: string;
  };
  applicantType: string;
  profile: {
    profileImageUrl: string;
    bannerImageUrl: string;
    id: string;
  };
  includedInBallots: number;
  impactDescription: string;
  contributionDescription: string;
  contributionLinks: {
    type: string;
    url: string;
    description: string;
  }[];
  impactMetrics: {
    description: string;
    number: number;
    url: string;
  }[];
  fundingSources: {
    type: string;
    currency: string;
    amount: number;
    description: string;
  }[];
};

// Analytics events
export enum ANALYTICS_EVENT_NAMES {
  STANDARD_VOTE = "standard_vote",
  ADVANCED_VOTE = "advanced_vote",
  DELEGATE = "delegate",
  ADVANCED_DELEGATE = "advanced_delegate",
  PARTIAL_DELEGATION = "partial_delegation",
  CREATE_PROPOSAL = "create_proposal",
  SHARE_VOTE = "share_vote",
}

export type AnalyticsEvent =
  | {
      event_name: ANALYTICS_EVENT_NAMES.STANDARD_VOTE;
      event_data: {
        proposal_id: string;
        support: number;
        voter: `0x${string}`;
        transaction_hash: string;
        reason?: string;
        params?: `0x${string}`;
      };
    }
  | {
      event_name: ANALYTICS_EVENT_NAMES.ADVANCED_VOTE;
      event_data: {
        proposal_id: string;
        support: number;
        voter: `0x${string}`;
        transaction_hash: string;
        reason?: string;
        params?: `0x${string}`;
      };
    }
  | {
      event_name: ANALYTICS_EVENT_NAMES.DELEGATE;
      event_data: {
        delegator: `0x${string}`;
        delegate: `0x${string}`;
        transaction_hash: string;
      };
    }
  | {
      event_name: ANALYTICS_EVENT_NAMES.ADVANCED_DELEGATE;
      event_data: {
        delegatees: DelegateChunk[];
        delegator: `0x${string}`;
        transaction_hash: string;
      };
    }
  | {
      event_name: ANALYTICS_EVENT_NAMES.CREATE_PROPOSAL;
      event_data: {
        transaction_hash: string;
        uses_plm: boolean;
        proposal_data: any;
      };
    }
  | {
      event_name: ANALYTICS_EVENT_NAMES.PARTIAL_DELEGATION;
      event_data: {
        transaction_hash: string;
        delegatees: DelegateChunk[];
        delegator: `0x${string}`;
        is_scw: boolean;
      };
    }
  | {
      event_name: ANALYTICS_EVENT_NAMES.SHARE_VOTE;
      event_data: {
        proposal_id: string;
        address?: `0x${string}`;
        type: "X" | "COPY_LINK" | "DOWNLOAD_IMAGE" | "WARPCAST";
      };
    };

export type TokenType = "near" | "lst" | "lockup";

export type TokenMetadata = {
  name: string;
  symbol: string;
  decimals: number;
  icon: string | StaticImageData;
};

export type TokenWithBalance = {
  type: TokenType;
  accountId?: string;
  metadata?: TokenMetadata | null;
  balance: string;
};

export type StakingPool = {
  id: string;
  contracts: {
    mainnet: string;
    testnet: string;
  };
  priceMethod?: string;
  metadata: TokenMetadata;
};
