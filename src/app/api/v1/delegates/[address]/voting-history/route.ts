import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchVoteHistory } from "@/lib/api/delegates/requests";

// Query parameter validation schema
const querySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * GET /api/v1/delegates/[address]/voting-history
 *
 * Public endpoint to fetch voting history for a specific delegate.
 *
 * Path parameters:
 * - address: The delegate's NEAR account address
 *
 * Query parameters:
 * - offset: Number of votes to skip (default: 0)
 * - limit: Number of votes to return (default: 20, max: 100)
 *
 * Response format:
 * {
 *   votes: VoteHistory[],
 *   pagination: {
 *     offset: number,
 *     limit: number,
 *     total: number
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const { searchParams } = new URL(request.url);

    // Validate that address is provided
    if (!address || typeof address !== "string" || address.trim().length === 0) {
      return NextResponse.json(
        { error: "Delegate address is required" },
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

    // Fetch vote history from backend
    const { votes, count } = await fetchVoteHistory(pageSize, page, address);

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
    console.error("Error fetching voting history:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch voting history",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
