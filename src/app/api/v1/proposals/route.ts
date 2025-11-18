import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchApprovedProposals } from "@/lib/api/proposal/requests";

// Query parameter validation schema
const querySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * GET /api/v1/proposals
 *
 * Public endpoint to list all approved proposals with pagination.
 *
 * Query parameters:
 * - offset: Number of proposals to skip (default: 0)
 * - limit: Number of proposals to return (default: 20, max: 100)
 *
 * Response format:
 * {
 *   proposals: Proposal[],
 *   pagination: {
 *     offset: number,
 *     limit: number,
 *     total: number
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

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

    // Fetch proposals from backend
    const { proposals, count } = await fetchApprovedProposals(pageSize, page);

    // Calculate the slice we need from the returned page
    // In case offset doesn't align perfectly with page boundaries
    const startIndex = offset % limit;
    const slicedProposals = proposals.slice(startIndex, startIndex + limit);

    // Return response with pagination metadata
    return NextResponse.json({
      proposals: slicedProposals,
      pagination: {
        offset,
        limit,
        total: count,
      },
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch proposals",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
