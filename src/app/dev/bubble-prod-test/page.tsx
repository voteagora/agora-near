"use client";

import { useEffect, useState } from "react";
import BubbleChart from "@/components/Proposals/ProposalPage/BubbleChart/BubbleChart";
import { ProposalInfo } from "@/lib/contracts/types/voting";
import { ProposalVotingHistoryRecord } from "@/lib/api/proposal/types";

// Real data from prod API: proposal/6/charts
const REAL_PROD_DATA: ProposalVotingHistoryRecord[] = [
  {
    accountId: "lane.near",
    votingPower: "7238234349214783000000002",
    voteOption: "2",
    votedAt: new Date("2025-10-20T09:30:33.877Z").getTime(),
  },
  {
    accountId: "ray012803.tg",
    votingPower: "55375197863690188600001000",
    voteOption: "0",
    votedAt: new Date("2025-10-20T09:34:28.040Z").getTime(),
  },
  {
    accountId: "hos.slimedragon.near",
    votingPower: "786148123768879465500000002",
    voteOption: "1",
    votedAt: new Date("2025-10-20T11:38:23.046Z").getTime(),
  },
  {
    accountId: "ramgor.near",
    votingPower: "104287478199060398317908397",
    voteOption: "0",
    votedAt: new Date("2025-10-20T13:46:49.951Z").getTime(),
  },
  {
    accountId: "vote.mob.near",
    votingPower: "201142252239328427001100000003",
    voteOption: "1",
    votedAt: new Date("2025-10-20T17:51:55.022Z").getTime(),
  },
  {
    accountId: "delegate.sleet.near",
    votingPower: "1012094805317419791000000002",
    voteOption: "0",
    votedAt: new Date("2025-10-20T22:13:42.898Z").getTime(),
  },
  {
    accountId: "fgex.near",
    votingPower: "7105284461171934300000002",
    voteOption: "0",
    votedAt: new Date("2025-10-21T11:52:22.978Z").getTime(),
  },
  {
    accountId: "entechnologue.near",
    votingPower: "10039356302183869200000001",
    voteOption: "0",
    votedAt: new Date("2025-10-21T13:13:52.827Z").getTime(),
  },
];

const mockProposal: ProposalInfo = {
  id: "6",
  title: "Proposal 6 - Real Prod Data Test",
  description: "Testing with actual production data",
  proposer_id: "test.near",
  link: "https://gov.near.org/proposal",
  status: 3,
  snapshot_and_state: {
    snapshot: {
      block_height: 123456789,
      timestamp: Date.now() * 1_000_000,
    },
    state: {
      for_votes: "1000000000000000000000000",
      against_votes: "500000000000000000000000",
      abstain_votes: "200000000000000000000000",
    },
  },
} as any;

export default function BubbleProdTestPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-wash p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🧪 BubbleChart - Real Prod Data Test
          </h1>
          <p className="text-secondary mb-4">
            Testing with actual data from{" "}
            <code className="bg-tertiary/10 px-2 py-1 rounded">
              proposal/6/charts
            </code>
          </p>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <strong>Data source:</strong> 8 votes from production API
            <br />
            <strong>Expected:</strong> All 8 bubbles should render without
            freezing
            <br />
            <strong>Check console:</strong> Look for [BubbleChart] logs
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Live Test with Production Data
          </h2>

          <div className="border border-line rounded-lg p-4 mb-4">
            <BubbleChart proposal={mockProposal} votes={REAL_PROD_DATA} />
          </div>

          <div className="mt-4">
            <details className="p-3 bg-tertiary/5 rounded">
              <summary className="cursor-pointer font-medium text-secondary text-sm">
                📊 View Raw Production Data ({REAL_PROD_DATA.length} votes)
              </summary>
              <pre className="mt-2 overflow-auto max-h-96 text-xs">
                {JSON.stringify(REAL_PROD_DATA, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">
            ✅ Success Criteria
          </h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>
              ✓ 8 bubbles visible (not "No voting data available to display")
            </li>
            <li>✓ No freezing or browser crash</li>
            <li>✓ Zoom controls work</li>
            <li>✓ Click bubbles to navigate</li>
            <li>
              ✓ Console shows: "packedData after filter: 8 nodes" (or
              fallback)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

