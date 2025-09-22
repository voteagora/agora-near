import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string; address: string } }
) {
  try {
    const { projectId, address } = params;
    const body = await request.json();
    const { txHash } = body;

    if (!projectId || !address) {
      return NextResponse.json(
        { error: "Project ID and address are required" },
        { status: 400 }
      );
    }

    if (!txHash) {
      return NextResponse.json(
        { error: "Transaction hash is required" },
        { status: 400 }
      );
    }

    const NEAR_CLAIM_API_URL = process.env.NEAR_CLAIM_API_URL;
    const NEAR_CLAIM_API_KEY = process.env.NEAR_CLAIM_API_KEY;

    if (!NEAR_CLAIM_API_URL || !NEAR_CLAIM_API_KEY) {
      console.error(
        "Missing NEAR_CLAIM_API_URL or NEAR_CLAIM_API_KEY environment variables"
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const response = await axios.post(
      `${NEAR_CLAIM_API_URL}/claim/${projectId}/${address}`,
      { txHash },
      {
        headers: {
          Authorization: `Bearer ${NEAR_CLAIM_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `NEAR Claim API responded with status: ${response.status}`
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error marking proof as claimed:", error);
    return NextResponse.json(
      { error: "Failed to mark proof as claimed" },
      { status: 500 }
    );
  }
}
