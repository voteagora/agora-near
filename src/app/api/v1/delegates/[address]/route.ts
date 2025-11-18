import { NextRequest, NextResponse } from "next/server";
import { getDelegate } from "@/lib/api/delegates/requests";

/**
 * GET /api/v1/delegates/[address]
 *
 * Public endpoint to fetch a specific delegate by their address.
 *
 * Path parameters:
 * - address: The delegate's NEAR account address
 *
 * Response format:
 * {
 *   delegate: DelegateProfile
 * }
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;

    // Validate that address is provided
    if (!address || typeof address !== "string" || address.trim().length === 0) {
      return NextResponse.json(
        { error: "Delegate address is required" },
        { status: 400 }
      );
    }

    // Fetch delegate from backend
    const delegate = await getDelegate(address);

    if (!delegate) {
      return NextResponse.json(
        { error: "Delegate not found" },
        { status: 404 }
      );
    }

    // Return the delegate
    return NextResponse.json({
      delegate,
    });
  } catch (error) {
    console.error("Error fetching delegate:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch delegate",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
