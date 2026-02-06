import environments from "@/lib/environment";
import { handleUnauthorizedResponse } from "@/lib/handleUnauthorized";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("mc-access-tk")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId");
    if (!siteId) {
      return NextResponse.json(
        { message: "Incident ID is required" },
        { status: 400 }
      );
    }
    const response = await fetch(
      `${environments.API_URL}/status-monitor/${siteId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const unauthorizedResponse = await handleUnauthorizedResponse(response);
    if (unauthorizedResponse) return unauthorizedResponse;
    if (!response.ok) {
      console.error("NestJS API error:", data);
      return NextResponse.json(
        { message: "Error fetching data", error: data },
        { status: response.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("mc-access-tk")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, email, type, error, details } = body;

    if (!url || !email || !type) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const response = await fetch(`${environments.API_URL}/test-notification`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        email,
        type,
        error: error || "Test error",
        details: details || "Test details",
      }),
    });

    const data = await response.json();
    const unauthorizedResponse2 = await handleUnauthorizedResponse(response);
    if (unauthorizedResponse2) return unauthorizedResponse2;
    if (!response.ok) {
      console.error("NestJS API error:", data);
      return NextResponse.json(
        { message: "Error sending test notification", error: data },
        { status: response.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
