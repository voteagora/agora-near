import { NextRequest, NextResponse } from "next/server";

/**
 * Validates that a bearer token is present in the request headers.
 * Does not validate the token value - accepts any non-empty string.
 *
 * @param request - The Next.js request object
 * @returns NextResponse with error if invalid, null if valid
 */
export function validateBearerToken(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("authorization");

  // Check if Authorization header exists
  if (!authHeader) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Authorization header is required",
      },
      { status: 401 }
    );
  }

  // Check if header follows Bearer format
  if (!authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Authorization header must use Bearer scheme",
      },
      { status: 401 }
    );
  }

  // Extract token and check if it's non-empty
  const token = authHeader.substring(7).trim();
  if (!token) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Bearer token must not be empty",
      },
      { status: 401 }
    );
  }

  // Token is present and non-empty, validation passed
  return null;
}
