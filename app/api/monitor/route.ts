import environments from "@/lib/environment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("mc-access-tk")?.value;
    console.log(accessToken);
    const body = await req.json();
    const { url, userID, email } = body;
    const response = await fetch(`${environments.API_URL}/site`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ url, userID, email }),
    });
    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
export async function GET() {}
