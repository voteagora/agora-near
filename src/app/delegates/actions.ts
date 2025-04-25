"use server";

import { fetchAllForAdvancedDelegation as apiFetchAllForAdvancedDelegation } from "@/app/api/delegations/getDelegations";
import { type DelegateStatementFormValues } from "@/components/DelegateStatement/CurrentDelegateStatement";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { fetchVotesForDelegate as apiFetchVotesForDelegate } from "@/app/api/common/votes/getVotes";
import {
  fetchIsDelegatingToProxy,
  fetchVotingPowerAvailableForDirectDelegation,
  fetchVotingPowerAvailableForSubdelegation,
} from "@/app/api/common/voting-power/getVotingPower";
import {
  fetchDelegate as apiFetchDelegate,
  fetchVoterStats as apiFetchVoterStats,
} from "@/app/api/common/delegates/getDelegates";
import { fetchDelegateStatement as apiFetchDelegateStatement } from "@/app/api/common/delegateStatement/getDelegateStatement";
import {
  fetchAllDelegatorsInChains,
  fetchCurrentDelegatees as apiFetchCurrentDelegatees,
  fetchCurrentDelegators as apiFetchCurrentDelegators,
  fetchDirectDelegatee as apiFetchDirectDelegatee,
} from "@/app/api/common/delegations/getDelegations";
import { createDelegateStatement } from "@/app/api/common/delegateStatement/createDelegateStatement";
import Tenant from "@/lib/tenant/tenant";
import { PaginationParams } from "../lib/pagination";
import { fetchUpdateNotificationPreferencesForAddress } from "@/app/api/common/notifications/updateNotificationPreferencesForAddress";

const MockDelegate = {
  address: '0x06ad892ce23c136bbda3a821570343a2af3e2914',
  citizen: false,
  votingPower: {
    total: '5562646021903899843106375',
    direct: '5562646021903899843106375',
    advanced: '0'
  },
  votingPowerRelativeToVotableSupply: 0,
  votingPowerRelativeToQuorum: 0,
  proposalsCreated: '0',
  proposalsVotedOn: '25',
  votedFor: '24',
  votedAgainst: '0',
  votedAbstain: '1',
  votingParticipation: 0.2403846153846154,
  lastTenProps: '6',
  numOfDelegators: '0',
  totalProposals: '104',
  statement: {
    signature: '0xacc9bfd1bff20c242eb78c32002005fb8e01ad4b979ed9d164f3713bb483c2f85665dffdc59f32e6464891b42e49c21345e1226bea5cb92eb1210d2437fd807e1b',
    payload: {
      email: 'taem.park@testinprod.io',
      daoSlug: 'OP',
      discord: 'https://discord.gg/42DFTeZwUZ',
      twitter: '@testinprod_io',
      warpcast: 'testinprod-io',
      topIssues: [Array],
      topStakeholders: [],
      agreeCodeConduct: true,
      delegateStatement: 'Test in Prod is a core development team of Near Collective. TiP has been an active developer to all parts of the OP Stack since 2022—OP-Erigon (execution), Delta network upgrade (consensus), Asterisc (proof), and infrastructures.\n' +
        '\n' +
        "We decided to become a delegate to contribute our technical understanding. Near governance decides major protocol upgrades and allocates funds for technical initiatives. As a team building the Collective's core technology at the frontline, we hope our knowledge contributes to the Collective's wiser decisions.\n" +
        '\n' +
        "Our common goal of the Near Collective is building the technology for a more open Internet by scaling Ethereum. We believe such a crucial infrastructure for humanity should be resilient, performant, and beneficial. With that in mind, let's summon Ether's Phoenix together.\n" +
        '\n' +
        'Our Discourse username is **testinprod_io**.',
      mostValuableProposals: [],
      leastValuableProposals: [],
      openToSponsoringProposals: null
    },
    twitter: '@testinprod_io',
    email: 'taem.park@testinprod.io',
    discord: 'https://discord.gg/42DFTeZwUZ',
    created_at: '2024-10-12',
    updated_at: '2024-10-12',
    warpcast: 'testinprod-io',
    endorsed: false,
    scw_address: null,
    notification_preferences: {
      last_updated: '2025-04-08T04:07:11.259Z',
      wants_proposal_created_email: true,
      wants_proposal_ending_soon_email: true
    }
  },
  relativeVotingPowerToVotableSupply: '0.04794'
}

export const fetchDelegate = async (address: string) => {
  try {
    const cachedFetchDelegate = unstable_cache(
      async () => {
        return MockDelegate;
        // return await apiFetchDelegate(address);
      },
      [`delegate-${address.toLowerCase()}`],
      {
        revalidate: 180, // 3 minutes
        tags: [`delegate-${address.toLowerCase()}`],
      }
    );

    return await cachedFetchDelegate();
  } catch (error) {
    console.error("Error fetching delegate data:", error);
    throw error;
  }
};

export const fetchVoterStats = unstable_cache(
  async (address: string, blockNumber?: number) => {
    return apiFetchVoterStats(address, blockNumber);
  },
  ["voterStats"],
  {
    // Cache for 10 minutes unless invalidated by the block
    // This cache will get invalidated by the block number update
    revalidate: 600,
    tags: ["voterStats"],
  }
);

export const fetchDelegateStatement = unstable_cache(
  async (address: string) => {
    return apiFetchDelegateStatement(address);
  },
  ["delegateStatement"],
  {
    // Longer cache is acceptable since the statement is not expected to change
    // often and invalidated with every delegate statement update
    revalidate: 600, // 10 minute cache
    tags: ["delegateStatement"],
  }
);

// Pass address of the connected wallet
export async function fetchVotingPowerForSubdelegation(
  addressOrENSName: string
) {
  return fetchVotingPowerAvailableForSubdelegation(addressOrENSName);
}

// Pass address of the connected wallet
export async function checkIfDelegatingToProxy(addressOrENSName: string) {
  return fetchIsDelegatingToProxy(addressOrENSName);
}

// Pass address of the connected wallet
export async function fetchBalanceForDirectDelegation(
  addressOrENSName: string
) {
  return fetchVotingPowerAvailableForDirectDelegation(addressOrENSName);
}

export async function fetchDirectDelegatee(addressOrENSName: string) {
  return apiFetchDirectDelegatee(addressOrENSName);
}

export async function submitDelegateStatement({
  address,
  delegateStatement,
  signature,
  message,
  scwAddress,
}: {
  address: `0x${string}`;
  delegateStatement: DelegateStatementFormValues;
  signature: `0x${string}`;
  message: string;
  scwAddress?: string;
}) {
  const response = await createDelegateStatement({
    address,
    delegateStatement,
    signature,
    message,
    scwAddress,
  });

  revalidateDelegateAddressPage(address.toLowerCase());
  revalidatePath("/delegates/create", "page");
  return response;
}

export async function fetchVotesForDelegate(
  addressOrENSName: string,
  pagination?: {
    offset: number;
    limit: number;
  }
) {
  return apiFetchVotesForDelegate({
    addressOrENSName,
    pagination,
  });
}

// Pass address of the connected wallet
export async function fetchCurrentDelegatees(addressOrENSName: string) {
  return apiFetchCurrentDelegatees(addressOrENSName);
}

export async function fetchCurrentDelegators(
  addressOrENSName: string,
  pagination: PaginationParams = {
    offset: 0,
    limit: 20,
  }
) {
  return apiFetchCurrentDelegators(addressOrENSName, pagination);
}

// TODO temporary fetch all query - optimization via API needed
export async function fetchAllForAdvancedDelegation(address: string) {
  return apiFetchAllForAdvancedDelegation(address);
}

// Pass address of the connected wallet
export async function fetchAllDelegatorsInChainsForAddress(
  addressOrENSName: string
) {
  return fetchAllDelegatorsInChains(addressOrENSName);
}

export async function balanceOf(address: string) {
  const { contracts } = Tenant.current();
  return contracts.token.contract.balanceOf(address);
}

export const fetchConnectedDelegate = async (address: string) => {
  return await Promise.all([
    fetchDelegate(address),
    fetchAllDelegatorsInChainsForAddress(address),
    balanceOf(address),
  ]);
};

export const revalidateDelegateAddressPage = async (
  delegateAddress: string
) => {
  revalidateTag(`delegate-${delegateAddress}`);
  revalidatePath(`/delegates/${delegateAddress}`, "page");
};

export async function updateNotificationPreferencesForAddress(
  address: `0x${string}`,
  email: string,
  options: {
    wants_proposal_created_email: "prompt" | "prompted" | true | false;
    wants_proposal_ending_soon_email: "prompt" | "prompted" | true | false;
  }
) {
  return fetchUpdateNotificationPreferencesForAddress(address, email, options);
}
