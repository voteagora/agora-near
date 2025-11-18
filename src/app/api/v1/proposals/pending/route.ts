import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchPendingProposals } from "@/lib/api/proposal/requests";

// Query parameter validation schema
const querySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  created_by: z.string().optional(),
});

/**
 * GET /api/v1/proposals/pending
 *
 * Public endpoint to list all pending proposals with pagination.
 *
 * Query parameters:
 * - offset: Number of proposals to skip (default: 0)
 * - limit: Number of proposals to return (default: 20, max: 100)
 * - created_by: Optional filter to only return proposals created by a specific account
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
      created_by: searchParams.get("created_by"),
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

    const { offset, limit, created_by } = validationResult.data;

    // Convert offset/limit to page-based pagination for backend API
    // Backend uses 1-based page numbering
    const page = Math.floor(offset / limit) + 1;
    const pageSize = limit;

    // Fetch proposals from backend
    const { proposals, count } = await fetchPendingProposals(
      pageSize,
      page,
      created_by
    );

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
    console.error("Error fetching pending proposals:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch pending proposals",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
