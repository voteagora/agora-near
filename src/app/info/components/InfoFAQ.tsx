"use client";

import React, { useEffect, ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

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
              The user transfers NEAR tokens from their wallet into their
              personal lockup contract.
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
    answer:
      "The proposal process begins with community discussion on the governance forum. Once a proposal gains sufficient support, it can be submitted on-chain for voting. Proposals must meet quorum requirements and pass with the required majority to be implemented.",
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
];

const InfoFAQ = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there's a hash in the URL for deep linking
    const hash = window.location.hash.replace("#", "");
    if (hash && faqs.some((faq) => faq.id === hash)) {
      // Small delay to ensure the DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [searchParams]);

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-black text-primary mb-6">
        Frequently Asked Questions
      </h3>
      <Accordion type="single" collapsible className="w-full">
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
