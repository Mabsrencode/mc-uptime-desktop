import environments from "@/lib/environment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("mc-access-tk")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { url } = body;
    if (!url) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }
    const response = await fetch(
      `${environments.API_URL}/analyze-performance/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Encore API error:", errorData);
      return NextResponse.json(
        { message: "Error fetching data", error: errorData },
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
