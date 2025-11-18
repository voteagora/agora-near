import { NextRequest, NextResponse } from "next/server";
import { fetchProposal } from "@/lib/api/proposal/requests";

/**
 * GET /api/v1/proposal/[id]
 *
 * Public endpoint to fetch a specific proposal by its numeric proposalId.
 * Queries the NEAR blockchain directly via RPC.
 *
 * Path parameters:
 * - id: The numeric proposal ID (from the proposalId field, not the base58 id field)
 *
 * Response format:
 * {
 *   proposal: ProposalInfo
 * }
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate that id is provided and is a valid number
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        { error: "Proposal ID is required" },
        { status: 400 }
      );
    }

    const proposalId = parseInt(id, 10);
    if (isNaN(proposalId) || proposalId < 0) {
      return NextResponse.json(
        {
          error:
            "Invalid proposal ID. Must be a non-negative integer (use proposalId field, not id field).",
        },
        { status: 400 }
      );
    }

    // Fetch proposal from NEAR blockchain via RPC
    const proposal = await fetchProposal(id);

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Return the proposal
    return NextResponse.json({
      proposal,
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch proposal",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
