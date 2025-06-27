"use client";

import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";

const faqs = [
  {
    id: "what-is-near-governance",
    question: "What is NEAR House of Stake governance?",
    answer:
      "NEAR House of Stake governance is a decentralized governance system that empowers token holders to lock NEAR for voting rights, delegate votes to trusted representatives, and earn rewards for active participation. It enables the community to collectively make decisions about the protocol's future.",
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
            <AccordionContent className="text-secondary px-4">
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
