"use client";

import React, { useEffect, ReactNode, useState, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { getQuorumFloor, getQuorumPercentage } from "@/lib/proposalUtils";
import TokenAmount from "@/components/shared/TokenAmount";
import { MixpanelEvents } from "@/lib/analytics/mixpanel";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";

interface FAQ {
  id: string;
  question: string;
  answer: string | ReactNode;
}

// Reusable components for consistent styling
const Text = ({ children }: { children: ReactNode }) => (
  <p className="leading-relaxed">{children}</p>
);

const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary underline hover:text-secondary font-medium"
  >
    {children}
  </a>
);

const Code = ({ children }: { children: string }) => (
  <code className="bg-gray-100 px-2 py-1 rounded">{children}</code>
);

const CodeLink = ({ href, code }: { href: string; code: string }) => (
  <ExternalLink href={href}>
    <Code>{code}</Code>
  </ExternalLink>
);

const Callout = ({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "info";
}) => (
  <div
    className={`border-l-4 border-primary p-6 rounded-r-lg ${variant === "info" ? "bg-blue-50" : "bg-gray-50 border border-gray-200"}`}
  >
    {children}
  </div>
);

const StepCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="font-semibold mb-2 text-base">{title}</p>
    <Text>{children}</Text>
  </div>
);

interface APITableRow {
  contract: string;
  method: string;
  methodUrl: string;
  description: ReactNode;
}

const APITable = ({ rows }: { rows: APITableRow[] }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border-b border-gray-300 px-6 py-4 text-left font-semibold">
            Contract
          </th>
          <th className="border-b border-gray-300 px-6 py-4 text-left font-semibold">
            API Method
          </th>
          <th className="border-b border-gray-300 px-6 py-4 text-left font-semibold">
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="border-b border-gray-200 px-6 py-4">
              {row.contract}
            </td>
            <td className="border-b border-gray-200 px-6 py-4">
              <CodeLink href={row.methodUrl} code={row.method} />
            </td>
            <td className="border-b border-gray-200 px-6 py-4 leading-relaxed">
              {row.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const faqs: FAQ[] = [
  {
    id: "what-is-near-governance",
    question: "What is NEAR House of Stake governance?",
    answer: (
      <Text>
        NEAR House of Stake governance is a decentralized governance system that
        empowers token holders to lock NEAR for voting rights, delegate votes to
        trusted representatives, and earn rewards for active participation. It
        enables the community to collectively make decisions about the
        protocol&apos;s future.
      </Text>
    ),
  },
  {
    id: "contract-level-onboarding",
    question:
      "How does onboarding to NEAR House of Stake work at the contract level?",
    answer: (
      <div className="space-y-6">
        <Text>
          Onboarding to House of Stake involves a few different contract
          operations and transfers:
        </Text>
        <div className="space-y-4">
          <StepCard title="1. Make a deposit to the veNEAR contract">
            The user sends a small amount of NEAR to the veNEAR contract to
            cover storage costs and enable participation.
          </StepCard>
          <StepCard title="2. Deploy a personal lockup contract">
            The user requests the veNEAR contract to create their own lockup
            contract and pays the storage and deployment fees.
          </StepCard>
          <StepCard title="3. Fund your lockup contract">
            The user transfers NEAR, or any other supported tokens, from their
            wallet into their personal lockup contract.
          </StepCard>
          <StepCard title="4. Choose a staking service">
            The user selects which staking pool (like Meta Pool or liNEAR) to
            stake with.
          </StepCard>
          <StepCard title="5. Lock your NEAR tokens">
            The user locks the tokens inside the lockup contract to receive
            voting power.
          </StepCard>
          <StepCard title="6. (Optional) Stake your tokens">
            The user may choose to stake their locked tokens to earn staking
            rewards while participating in governance.
          </StepCard>
        </div>
        <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
          <Image
            src="/images/house_of_stake_onboarding.png"
            alt=""
            className="w-full h-auto"
            width={0}
            height={0}
            unoptimized
          />
        </div>
      </div>
    ),
  },
  {
    id: "staking-pools-whitelist",
    question:
      "Why are liNEAR and Meta Pool the only supported staking pools for House of Stake?",
    answer: (
      <div className="space-y-6">
        <Text>
          The goal of House of Stake is to make onboarding as seamless as
          possible. Liquid staking tokens, such as liNEAR and stNEAR, allow
          users to instantly transfer and lock tokens for voting power, without
          any disruption to your staking rewards.
        </Text>
        <Text>
          With that being said, House of Stake contracts support any staking
          pool that&apos;s whitelisted. Refer to the table below for the key
          contract APIs you&apos;ll need to interact with.
        </Text>
        <APITable
          rows={[
            {
              contract: "veNEAR contract",
              method: "get_config",
              methodUrl:
                "https://github.com/fastnear/house-of-stake-contracts/blob/main/venear-contract/src/config.rs#L46",
              description: (
                <>
                  Returns the veNEAR config, including the{" "}
                  <CodeLink
                    href="https://github.com/fastnear/house-of-stake-contracts/blob/main/venear-contract/src/config.rs#L22"
                    code="staking_pool_whitelist_account_id"
                  />
                  .
                </>
              ),
            },
            {
              contract: "Lockup contract",
              method: "select_staking_pool",
              methodUrl:
                "https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L15",
              description:
                "Allows you to set your preferred staking pool. Note that if you've already selected a staking pool such as liNEAR or stNEAR you'll need to unset your existing staking pool.",
            },
            {
              contract: "Lockup contract",
              method: "unselect_staking_pool",
              methodUrl:
                "https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L47",
              description:
                "Allows you to unset your current staking pool. Note you can only unset your staking pool if the amount deposited in that pool is 0. Otherwise you will need to withdraw first.",
            },
          ]}
        />
        <Callout variant="info">
          <p className="leading-relaxed italic">
            If you have a preferred staking pool that is not currently
            whitelisted, create a proposal and suggest which staking pools
            should be added.
          </p>
        </Callout>
      </div>
    ),
  },
  {
    id: "manage-staking-directly",
    question:
      "Why can't I manage my staking directly within the House of Stake dapp?",
    answer: (
      <div className="space-y-6">
        <Text>
          House of Stake&apos;s primary focus is to give NEAR token holders a
          way to gain voting power, earn rewards, and boost rewards with
          staking. When you stake your locked NEAR tokens, you are doing so
          through your lockup contract, which is custodying your funds.
        </Text>
        <Text>
          If you&apos;d like to further manage staked funds, you can use the
          lockup API methods to do so. The table below highlights the key API
          methods for managing your staked funds:
        </Text>
        <APITable
          rows={[
            {
              contract: "Lockup contract",
              method: "deposit_and_stake",
              methodUrl:
                "https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L127C12-L127C29",
              description:
                "Deposits funds that are in your lockup contract into the staking pool and stakes them.",
            },
            {
              contract: "Lockup contract",
              method: "unstake",
              methodUrl:
                "https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L333",
              description: "Unstakes your funds from the staking pool.",
            },
            {
              contract: "Lockup contract",
              method: "withdraw_from_staking_pool",
              methodUrl:
                "https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L213",
              description:
                "Withdraws all available funds from the staking pool.",
            },
            {
              contract: "Lockup contract",
              method: "refresh_staking_pool_balance",
              methodUrl:
                "https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L175C12-L175C40",
              description:
                "Retrieves total liquid balance from the staking pool and updates the internal state of the lockup contract. This is useful if you have staking rewards that you want to withdraw (you can withdraw the staking rewards without unlocking your principal balance of NEAR!).",
            },
          ]}
        />
      </div>
    ),
  },
  {
    id: "fungible-token-withdrawal",
    question: "Why do I need to unstake my liNEAR and stNEAR to withdraw?",
    answer: (
      <Text>
        In the current House of Stake contracts, users can deposit liNEAR or
        stNEAR into the lockup contract, but the design does not support direct
        transfers of these tokens out of the contract. Instead, users must
        unstake the tokens back to native NEAR before withdrawal as a
        workaround. This stems from an initial focus on staking functionality
        rather than full transferability, with fungible token transfers
        complicated by pricing dependencies not denominated in NEAR. The lockup
        contract is non-upgradable, making this behavior fixed for the lifetime
        of the V1 lockup contract. This will be addressed in a future version of
        House of Stake.
      </Text>
    ),
  },
  {
    id: "how-to-participate",
    question: "How can I participate in NEAR governance?",
    answer: (
      <Text>
        You can participate by locking your NEAR tokens to gain voting power,
        delegating your voting power to trusted delegates who align with your
        values, or becoming a delegate yourself. All participants earn rewards
        for their active involvement in the governance process.
      </Text>
    ),
  },
  {
    id: "what-are-delegates",
    question: "What are delegates and why are they important?",
    answer: (
      <Text>
        Delegates are community members who have been entrusted with voting
        power by token holders. They actively participate in governance by
        voting on proposals, engaging in discussions, and representing the
        interests of those who delegated to them. Delegates play a crucial role
        in ensuring informed decision-making.
      </Text>
    ),
  },
  {
    id: "voting-power",
    question: "How is voting power calculated?",
    answer: (
      <Text>
        Voting power is determined by the amount of NEAR tokens you have locked
        in the governance contract. The more NEAR you lock, the more voting
        power you have. You can either use this voting power directly or
        delegate it to others while still maintaining ownership of your tokens.
      </Text>
    ),
  },
  {
    id: "rewards-system",
    question: "How does the rewards system work?",
    answer: (
      <Text>
        House of Stake is currently debating how best to reward governance
        participants. It&apos;s likely that rewards will be offered in future,
        but this isn&apos;t final yet.
      </Text>
    ),
  },
  {
    id: "proposal-process",
    question: "What is the proposal process?",
    answer: (
      <div className="space-y-6">
        <Text>
          The proposal process begins with community discussion on the
          governance forum. Once a proposal gains sufficient support, it can be
          submitted as a pull request to the canonical proposals repository ({" "}
          <ExternalLink href="https://github.com/houseofstake/proposals">
            github.com/houseofstake/proposals
          </ExternalLink>{" "}
          ). See{" "}
          <ExternalLink href="https://github.com/houseofstake/proposals/blob/main/HSPs/hsp-001.md">
            {" "}
            https://github.com/houseofstake/proposals/blob/main/HSPs/hsp-001.md
          </ExternalLink>{" "}
          for more information on this process.
        </Text>
        <Text>
          Once a proposal has been merged there, it can go live on-chain for
          voting. Proposals must meet quorum requirements and pass with the
          required majority to be implemented.
        </Text>
        <Text>
          All proposals require a forum post on gov.near.org and to be merged to
          the proposals repository before on-chain submission. This ensures
          proper community discussion.
        </Text>
        <Callout>
          <p className="font-semibold mb-4 text-base">Process:</p>
          <ol className="list-decimal list-inside space-y-3 text-base leading-relaxed">
            <li>Create a forum post discussing your proposal</li>
            <li>Gather feedback and build community support</li>
            <li>
              Submit complete proposal, in correct format, to the proposals
              repository and wait until it's been merged and assigned a HSP
              number.
            </li>
            <li>Submit on-chain using your merged HSP URL.</li>
          </ol>
        </Callout>
      </div>
    ),
  },
  {
    id: "quorum-requirements",
    question: "What are the quorum requirements?",
    answer: (
      <Text>
        {`Quorum is not modeled onchain in House of Stake v1, but the community has decided that proposals must meet a minimum quorum requirement to be considered passed. The quorum is calculated as the higher of either ${getQuorumPercentage()}% of total veNEAR supply or an absolute floor of `}
        <TokenAmount
          amount={getQuorumFloor()}
          currency="veNEAR"
          trailingSpace={false}
          maximumSignificantDigits={0}
          minimumFractionDigits={0}
        />
        {`. In House of Stake v1.5, the quorum requirement will be enforced onchain.`}
      </Text>
    ),
  },
  {
    id: "locking-period",
    question: "What is the token locking period?",
    answer: (
      <Text>
        When you lock NEAR tokens for governance, they are locked for a specific
        period. During this time, you cannot transfer or use these tokens for
        other purposes, but you maintain voting rights and earn rewards. The
        locking period helps ensure long-term alignment with the protocol&apos;s
        success.
      </Text>
    ),
  },
  {
    id: "delegation-vs-direct-voting",
    question: "Should I delegate or vote directly?",
    answer: (
      <Text>
        The choice depends on your level of engagement and expertise. If you
        have the time and knowledge to research proposals thoroughly, direct
        voting gives you full control. If you prefer to entrust your voting
        power to someone who actively participates in governance, delegation is
        a great option.
      </Text>
    ),
  },
  {
    id: "staking-unstaking-cli",
    question:
      "How to interact with the underlying staking pool through the lockup contracts?",
    answer: (
      <Text>
        We put together a guide on how to interact with the underlying staking
        pool through the lockup contracts:{" "}
        <Link
          className="text-primary underline hover:text-secondary font-medium"
          href="https://github.com/voteagora/agora-near/wiki/How-to:-Lock-and-Stake-with-a-Custom-Staking-Pool"
        >
          Lock and Stake with a Custom Staking Pool
        </Link>
      </Text>
    ),
  },
  {
    id: "only-one-lst-position",
    question: "Why can't I lock more than one LST position?",
    answer: (
      <Text>
        The current contract architecture only allows one LST position to be
        locked at a time. Concurrent locking of multiple LSTs is not supported
        in House of Stake V1. When you lock NEAR tokens for governance, they are
        locked for a specific period. During this time, you cannot transfer or
        use these tokens for other purposes, but you maintain voting rights and
        earn rewards. The locking period helps ensure long-term alignment with
        the protocol&apos;s success.
      </Text>
    ),
  },
  {
    id: "proposal-start-timing",
    question: "When does a proposal go live?",
    answer: (
      <Text>
        The proposal reviewer selects the start time. This can be any time, on a
        per-proposal basis.
      </Text>
    ),
  },
];

const InfoFAQ = () => {
  const searchParams = useSearchParams();
  const faqId = searchParams?.get("item");
  const isValidFaqId = faqId && faqs.some((faq) => faq.id === faqId);
  const [openItem, setOpenItem] = useState<string | undefined>(
    isValidFaqId ? faqId : undefined
  );

  useEffect(() => {
    // Check if there's a valid FAQ ID in the query params
    if (isValidFaqId && faqId) {
      setOpenItem(faqId);
      setTimeout(() => {
        const element = document.getElementById(faqId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [faqId, isValidFaqId]);

  const handleToggle = useCallback((value: string) => {
    setOpenItem(value);
    if (value) {
      const faq = faqs.find((f) => f.id === value);
      trackEvent({
        event_name: MixpanelEvents.FAQExpanded,
        event_data: { id: value, question: faq?.question },
      });
    }
  }, []);

  return (
    <div className="mt-16 w-full">
      <div className="mx-auto">
        <h3 className="text-3xl font-black text-primary mb-10">
          Frequently Asked Questions
        </h3>
        <Accordion
          type="single"
          collapsible
          className="space-y-4"
          value={openItem}
          onValueChange={handleToggle}
        >
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              id={faq.id}
              className="w-full border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="w-full text-left text-primary hover:text-secondary text-base font-semibold px-8 py-6 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="w-full text-base leading-relaxed px-8 pb-8 pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-12 text-base text-tertiary bg-gray-50 rounded-lg p-6">
          <Text>
            Have more questions? Join the discussion on our{" "}
            <ExternalLink href="https://gov.near.org/">
              Governance Forum
            </ExternalLink>{" "}
            or{" "}
            <ExternalLink href="https://discord.gg/nearprotocol">
              Discord
            </ExternalLink>
            .
          </Text>
        </div>
      </div>
    </div>
  );
};

export default InfoFAQ;
