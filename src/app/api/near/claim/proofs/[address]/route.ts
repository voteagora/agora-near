import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
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

    const response = await axios.get(
      `${NEAR_CLAIM_API_URL}/proofs/${address}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${NEAR_CLAIM_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            address: address.toLowerCase(),
            totalProofs: 0,
            proofs: [],
          },
          { status: 200 }
        );
      }

      throw new Error(
        `NEAR Claim API responded with status: ${response.status}`
      );
    }

    const data = response.data;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching NEAR claim proofs:", error);
    return NextResponse.json(
      { error: "Failed to fetch claim proofs" },
      { status: 500 }
    );
  }
}
