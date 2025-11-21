import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchProposalVotes } from "@/lib/api/proposal/requests";
import { validateBearerToken } from "@/lib/apiAuth";

// Query parameter validation schema
const querySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * GET /api/v1/proposal/[id]/votes
 *
 * Public endpoint to fetch votes for a specific proposal by its numeric proposalId.
 * Returns a paginated list of all votes cast on the proposal.
 *
 * Path parameters:
 * - id: The numeric proposal ID (from the proposalId field, not the base58 id field)
 *
 * Query parameters:
 * - offset: Number of votes to skip (default: 0)
 * - limit: Number of votes to return (default: 20, max: 100)
 *
 * Response format:
 * {
 *   votes: ProposalVote[],
 *   pagination: {
 *     offset: number,
 *     limit: number,
 *     total: number
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Validate bearer token
  const authError = validateBearerToken(request);
  if (authError) {
    return authError;
  }

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

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

    // Parse and validate query parameters
    const validationResult = querySchema.safeParse({
      offset: searchParams.get("offset"),
      limit: searchParams.get("limit"),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { offset, limit } = validationResult.data;

    // Convert offset/limit to page-based pagination for backend API
    // Backend uses 1-based page numbering
    const page = Math.floor(offset / limit) + 1;
    const pageSize = limit;

    // Fetch votes from backend
    const { votes, count } = await fetchProposalVotes(id, pageSize, page);

    // Calculate the slice we need from the returned page
    // In case offset doesn't align perfectly with page boundaries
    const startIndex = offset % limit;
    const slicedVotes = votes.slice(startIndex, startIndex + limit);

    // Return response with pagination metadata
    return NextResponse.json({
      votes: slicedVotes,
      pagination: {
        offset,
        limit,
        total: count,
      },
    });
  } catch (error) {
    console.error("Error fetching proposal votes:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch proposal votes",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
