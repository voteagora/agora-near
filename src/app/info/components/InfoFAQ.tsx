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

interface FAQ {
  id: string;
  question: string;
  answer: string | ReactNode;
}

const faqs: FAQ[] = [
  {
    id: "what-is-near-governance",
    question: "What is NEAR House of Stake governance?",
    answer:
      "NEAR House of Stake governance is a decentralized governance system that empowers token holders to lock NEAR for voting rights, delegate votes to trusted representatives, and earn rewards for active participation. It enables the community to collectively make decisions about the protocol's future.",
  },
  {
    id: "contract-level-onboarding",
    question:
      "How does onboarding to NEAR House of Stake work at the contract level?",
    answer: (
      <div className="space-y-4">
        <p>
          Onboarding to House of Stake involves a few different contract
          operations and transfers:
        </p>
        <div className="space-y-3">
          <div>
            <p className="font-semibold mb-1">
              1. Make a deposit to the veNEAR contract
            </p>
            <p>
              The user sends a small amount of NEAR to the veNEAR contract to
              cover storage costs and enable participation.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">
              2. Deploy a personal lockup contract
            </p>
            <p>
              The user requests the veNEAR contract to create their own lockup
              contract and pays the storage and deployment fees.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">3. Fund your lockup contract</p>
            <p>
              The user transfers NEAR, or any other supported tokens, from their
              wallet into their personal lockup contract.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">4. Choose a staking service</p>
            <p>
              The user selects which staking pool (like Meta Pool or liNEAR) to
              stake with.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">5. Lock your NEAR tokens</p>
            <p>
              The user locks the tokens inside the lockup contract to receive
              voting power.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">
              6. (Optional) Stake your tokens
            </p>
            <p>
              The user may choose to stake their locked tokens to earn staking
              rewards while participating in governance.
            </p>
          </div>
        </div>
        <div className="mt-6">
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
      <div className="space-y-4">
        <p>
          The goal of House of Stake is to make onboarding as seamless as
          possible. Liquid staking tokens, such as liNEAR and stNEAR, allow
          users to instantly transfer and lock tokens for voting power, without
          any disruption to your staking rewards.
        </p>
        <p>
          With that being said, House of Stake contracts support any staking
          pool that&apos;s whitelisted. Refer to the table below for the key
          contract APIs you&apos;ll need to interact with.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Contract
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  API Method
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  veNEAR contract
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href="https://github.com/fastnear/house-of-stake-contracts/blob/main/venear-contract/src/config.rs#L46"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-secondary"
                  >
                    <code>get_config</code>
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Returns the veNEAR config, including the{" "}
                  <a
                    href="https://github.com/fastnear/house-of-stake-contracts/blob/main/venear-contract/src/config.rs#L22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-secondary"
                  >
                    <code>staking_pool_whitelist_account_id</code>
                  </a>
                  .
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Lockup contract
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href="https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L15"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-secondary"
                  >
                    <code>select_staking_pool</code>
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Allows you to set your preferred staking pool. Note that if
                  you&apos;ve already selected a staking pool such as liNEAR or
                  stNEAR you&apos;ll need to unset your existing staking pool.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Lockup contract
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href="https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L47"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-secondary"
                  >
                    <code>unselect_staking_pool</code>
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Allows you to unset your current staking pool. Note you can
                  only unset your staking pool if the amount deposited in that
                  pool is 0. Otherwise you will need to withdraw first.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 border-l-4 border-primary p-4 italic">
          <p>
            If you have a preferred staking pool that is not currently
            whitelisted, create a proposal and suggest which staking pools
            should be added.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "manage-staking-directly",
    question:
      "Why can't I manage my staking directly within the House of Stake dapp?",
    answer: (
      <div className="space-y-4">
        <p>
          House of Stake&apos;s primary focus is to give NEAR token holders a
          way to gain voting power, earn rewards, and boost rewards with
          staking. When you stake your locked NEAR tokens, you are doing so
          through your lockup contract, which is custodying your funds.
        </p>
        <p>
          If you&apos;d like to further manage staked funds, you can use the
          lockup API methods to do so. The table below highlights the key API
          methods for managing your staked funds:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Contract
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  API Method
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Lockup contract
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href="https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L127C12-L127C29"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-secondary"
                  >
                    <code>deposit_and_stake</code>
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Deposits funds that are in your lockup contract into the
                  staking pool and stakes them.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Lockup contract
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href="https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L333"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-secondary"
                  >
                    <code>unstake</code>
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Unstakes your funds from the staking pool.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Lockup contract
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href="https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L213"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-secondary"
                  >
                    <code>withdraw_from_staking_pool</code>
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Withdraws all available funds from the staking pool.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Lockup contract
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href="https://github.com/fastnear/house-of-stake-contracts/blob/main/lockup-contract/src/owner.rs#L175C12-L175C40"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-secondary"
                  >
                    <code>refresh_staking_pool_balance</code>
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Retrieves total liquid balance from the staking pool and
                  updates the internal state of the lockup contract. This is
                  useful if you have staking rewards that you want to withdraw
                  (you can withdraw the staking rewards without unlocking your
                  principal balance of NEAR!).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr className="border-t border-gray-300 my-4" />
      </div>
    ),
  },
  {
    id: "fungible-token-withdrawal",
    question: "Why do I need to unstake my liNEAR and stNEAR to withdraw?",
    answer:
      "In the current House of Stake contracts, users can deposit liNEAR or stNEAR into the lockup contract, but the design does not support direct transfers of these tokens out of the contract. Instead, users must unstake the tokens back to native NEAR before withdrawal as a workaround. This stems from an initial focus on staking functionality rather than full transferability, with fungible token transfers complicated by pricing dependencies not denominated in NEAR. The lockup contract is non-upgradable, making this behavior fixed for the lifetime of the V1 lockup contract. This will be addressed in a future version of House of Stake.",
  },
  {
    id: "how-to-participate",
    question: "How can I participate in NEAR governance?",
    answer:
      "You can participate by locking your NEAR tokens to gain voting power, delegating your voting power to trusted delegates who align with your values, or becoming a delegate yourself. All participants earn rewards for their active involvement in the governance process.",
  },
  {
    id: "what-are-delegates",
    question: "What are delegates and why are they important?",
    answer:
      "Delegates are community members who have been entrusted with voting power by token holders. They actively participate in governance by voting on proposals, engaging in discussions, and representing the interests of those who delegated to them. Delegates play a crucial role in ensuring informed decision-making.",
  },
  {
    id: "voting-power",
    question: "How is voting power calculated?",
    answer:
      "Voting power is determined by the amount of NEAR tokens you have locked in the governance contract. The more NEAR you lock, the more voting power you have. You can either use this voting power directly or delegate it to others while still maintaining ownership of your tokens.",
  },
  {
    id: "rewards-system",
    question: "How does the rewards system work?",
    answer:
      "Participants earn rewards for actively engaging in governance. This includes rewards for locking tokens, delegating voting power, and participating in votes. Delegates can also earn additional rewards based on their participation rate and the amount of voting power delegated to them.",
  },
  {
    id: "proposal-process",
    question: "What is the proposal process?",
    answer: (
      <div className="space-y-4">
        <p>
          The proposal process begins with community discussion on the
          governance forum. Once a proposal gains sufficient support, it can be
          submitted on-chain for voting. Proposals must meet quorum requirements
          and pass with the required majority to be implemented.
        </p>
        <p>
          All proposals require a forum post on{" "}
          <a
            href="https://gov.near.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-secondary"
          >
            gov.near.org
          </a>{" "}
          before on-chain submission. This ensures proper community discussion.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded p-4">
          <p className="font-semibold mb-2">Process:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Create a forum post discussing your proposal</li>
            <li>Gather feedback and build community support</li>
            <li>Submit on-chain using your forum post URL</li>
          </ol>
        </div>
      </div>
    ),
  },
  {
    id: "quorum-requirements",
    question: "What are the quorum requirements?",
    answer: (
      <div>
        {`Quorum is not modeled onchain in House of Stake v1, but the community has decided that proposals must meet a minimum quorum requirement to be considered passed. The quorum is calculated as the higher of either ${getQuorumPercentage()}% of total veNEAR supply or an absolute floor of `}
        <TokenAmount
          amount={getQuorumFloor()}
          currency="veNEAR"
          trailingSpace={false}
          maximumSignificantDigits={0}
          minimumFractionDigits={0}
        />
        {`. In House of Stake v1.5, the quorum requirement will be enforced onchain.`}
      </div>
    ),
  },
  {
    id: "locking-period",
    question: "What is the token locking period?",
    answer:
      "When you lock NEAR tokens for governance, they are locked for a specific period. During this time, you cannot transfer or use these tokens for other purposes, but you maintain voting rights and earn rewards. The locking period helps ensure long-term alignment with the protocol's success.",
  },
  {
    id: "delegation-vs-direct-voting",
    question: "Should I delegate or vote directly?",
    answer:
      "The choice depends on your level of engagement and expertise. If you have the time and knowledge to research proposals thoroughly, direct voting gives you full control. If you prefer to entrust your voting power to someone who actively participates in governance, delegation is a great option.",
  },
  {
    id: "rewards-distribution",
    question: "How will rewards be calculated and distributed?",
    answer: (
      <div className="space-y-4">
        <p>
          The formula to calculate the annual total NEAR rewards paid to veNEAR
          holders is as follows:
        </p>
        <div className="p-4 text-center my-4">
          <span className="font-mono text-lg">
            NEAR<sub>rewards</sub> = NEAR<sub>locked</sub> × veNEAR
            <sub>rewardsApy</sub>
          </span>
        </div>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>
              veNEAR<sub>rewardsApy</sub>
            </strong>{" "}
            will be set by the Screening Committee.
          </li>
          <li>
            The above formula assumes the distribution of{" "}
            <strong>
              NEAR<sub>rewards</sub>
            </strong>{" "}
            to be annual.
          </li>
        </ul>
        <p>
          Given the above estimate for{" "}
          <strong>
            NEAR<sub>rewards</sub>
          </strong>{" "}
          in a given month/epoch, a given user is awarded based on their veNEAR
          holdings as a ratio to{" "}
          <strong>
            veNEAR<sub>supply</sub>
          </strong>
          :
        </p>
        <div className="p-4 text-center my-4">
          <span className="font-mono text-lg">
            NEAR<sub>userA</sub> = NEAR<sub>rewards</sub> × (veNEAR
            <sub>userA</sub> / veNEAR<sub>supply</sub>)
          </span>
        </div>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            Users need to claim rewards based on their percentage ownership of
            the veNEAR supply, as per the above formula.
          </li>
        </ul>
        <p>
          Based on the current capital cost (5.8%), the annual spending on NEAR
          rewards will be as per the table below.
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  NEAR Locked
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Required Annual NEAR Rewards*
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">
                  1,000,000
                </td>
                <td className="border border-gray-300 px-4 py-3 font-medium">
                  58,000
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">
                  10,000,000
                </td>
                <td className="border border-gray-300 px-4 py-3 font-medium">
                  580,000
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">
                  100,000,000
                </td>
                <td className="border border-gray-300 px-4 py-3 font-medium">
                  5,800,000
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">
                  500,000,000
                </td>
                <td className="border border-gray-300 px-4 py-3 font-medium">
                  29,000,000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The rewards can be funded from multiple sources, where Treasury and
          0.5% annual token inflation are the main sources of funds.
        </p>
        <div className="mt-4">
          <a
            href="https://www.gauntlet.xyz/resources/near-house-of-stake-governance-proposal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-secondary"
          >
            Learn more
          </a>
        </div>
      </div>
    ),
  },
  {
    id: "staking-unstaking-cli",
    question:
      "How to interact with the underlying staking pool through the lockup contracts?",
    answer: (
      <div className="space-y-4">
        <p>
          In order to interact with the underlying staking pool in the contracts
          run the following commands
        </p>
        <div className="space-y-3">
          <p className="font-semibold mb-1"> 1. Select the staking pool</p>
          <p>
            {`near contract call-function as-transaction lockup-example.near select_staking_pool json-args ‘{“select_staking_pool_account_id”: “staking_pool-example”}’ prepaid-gas '75.0 Tgas' sign-as YOUR_ACCOUNT.near network-config mainnet sign-with-keychain send`}
          </p>
          <p className="font-semibold mb-1">2. Deposit and stake</p>
          <p>
            {`near contract call-function as-transaction lockup-example.near deposit_and_stake json-args '{"amount": "1000000000000000000000000000" }' prepaid-gas '125.0 Tgas' attached-deposit '1 yoctoNEAR' sign-as YOUR_ACCOUNT.near network-config mainnet sign-with-keychain send`}
          </p>
          <p className="font-semibold mb-1">3. And finally, unstake</p>
          <p>
            {`near contract call-function as-transaction staking-pool-example.near unstake_all json-args '' prepaid-gas '125.0 Tgas' attached-deposit '1 yoctoNEAR' sign-as YOUR_ACCOUNT.near network-config mainnet sign-with-keychain send`}
          </p>
        </div>
      </div>
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
    <div className="mt-12">
      <h3 className="text-2xl font-black text-primary mb-6">
        Frequently Asked Questions
      </h3>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={openItem}
        onValueChange={handleToggle}
      >
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} id={faq.id}>
            <AccordionTrigger className="text-left text-primary hover:text-secondary">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm px-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-6 text-sm text-tertiary">
        <p>
          Have more questions? Join the discussion on our{" "}
          <a
            href="https://gov.near.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-secondary"
          >
            Governance Forum
          </a>{" "}
          or{" "}
          <a
            href="https://discord.gg/nearprotocol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-secondary"
          >
            Discord
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default InfoFAQ;
