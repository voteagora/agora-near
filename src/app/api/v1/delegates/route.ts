import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchDelegates } from "@/lib/api/delegates/requests";
import { validateBearerToken } from "@/lib/apiAuth";

// Query parameter validation schema
const querySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  order_by: z.string().nullable().optional(),
  sorting_seed: z.coerce.number().int().default(0),
  filter_by: z.string().nullable().optional(),
  issue_type: z.string().nullable().optional(),
});

/**
 * GET /api/v1/delegates
 *
 * Public endpoint to list all delegates with pagination and filtering.
 *
 * Query parameters:
 * - offset: Number of delegates to skip (default: 0)
 * - limit: Number of delegates to return (default: 20, max: 100)
 * - order_by: Sort order (e.g., "votingPower", "participationRate")
 * - sorting_seed: Random seed for shuffling results (default: 0)
 * - filter_by: Filter option (e.g., "endorsed")
 * - issue_type: Filter by issue type
 *
 * Response format:
 * {
 *   delegates: DelegateProfile[],
 *   pagination: {
 *     offset: number,
 *     limit: number,
 *     total: number
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  // Validate bearer token
  const authError = validateBearerToken(request);
  if (authError) {
    return authError;
  }

  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const validationResult = querySchema.safeParse({
      offset: searchParams.get("offset"),
      limit: searchParams.get("limit"),
      order_by: searchParams.get("order_by"),
      sorting_seed: searchParams.get("sorting_seed"),
      filter_by: searchParams.get("filter_by"),
      issue_type: searchParams.get("issue_type"),
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

    const { offset, limit, order_by, sorting_seed, filter_by, issue_type } =
      validationResult.data;

    // Convert offset/limit to page-based pagination for backend API
    // Backend uses 1-based page numbering
    const page = Math.floor(offset / limit) + 1;
    const pageSize = limit;

    // Fetch delegates from backend
    const { delegates, count } = await fetchDelegates(
      pageSize,
      page,
      order_by ?? null,
      sorting_seed,
      filter_by ?? null,
      issue_type ?? null
    );

    // Calculate the slice we need from the returned page
    // In case offset doesn't align perfectly with page boundaries
    const startIndex = offset % limit;
    const slicedDelegates = delegates.slice(startIndex, startIndex + limit);

    // Remove email field from delegates
    const sanitizedDelegates = slicedDelegates.map((delegate) => {
      const rest = { ...delegate } as Record<string, unknown>;
      delete (rest as any).email;
      return rest;
    });

    // Return response with pagination metadata
    return NextResponse.json({
      delegates: sanitizedDelegates,
      pagination: {
        offset,
        limit,
        total: count,
      },
    });
  } catch (error) {
    console.error("Error fetching delegates:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch delegates",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
