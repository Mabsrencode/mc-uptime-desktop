import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Checks if the backend response is a 401 Unauthorized.
 * If so, deletes the access token cookie and returns a 401 response
 * so the client-side authFetch can redirect to login.
 */
export async function handleUnauthorizedResponse(
  response: Response
): Promise<NextResponse | null> {
  if (response.status === 401) {
    const cookieStore = await cookies();
    cookieStore.delete("mc-access-tk");

    return NextResponse.json(
      { message: "Session expired. Please log in again." },
      { status: 401 }
    );
  }
  return null;
}
