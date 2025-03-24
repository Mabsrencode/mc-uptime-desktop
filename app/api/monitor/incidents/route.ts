import environments from "@/lib/environment";
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
    const userId = searchParams.get("userId");
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const paginate = searchParams.get("paginate");
    if (!userId) {
      return NextResponse.json(
        { message: "Incident ID is required" },
        { status: 400 }
      );
    }
    const url = search
      ? `${
          environments.API_URL
        }/incidents/${userId}?search=${encodeURIComponent(
          search
        )}&type=${type}&status=${status}`
      : `${
          environments.API_URL
        }/incidents/${userId}?search=${search}&type=${type}&status=${status}&paginate=${
          paginate ?? 5
        }`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
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
