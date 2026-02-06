import { NextResponse } from "next/server";
import environments from "@/lib/environment";
import { handleUnauthorizedResponse } from "@/lib/handleUnauthorized";
import { cookies } from "next/headers";

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("mc-access-tk")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json(
        { message: "ids must be provided as query parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${environments.API_URL}/site/bulk-delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ids: ids.split(",") }),
      }
    );

    const data = await response.json();
    const unauthorizedResponse = await handleUnauthorizedResponse(response);
    if (unauthorizedResponse) return unauthorizedResponse;
    if (!response.ok) {
      console.error("Backend error:", data);
      return NextResponse.json(
        { message: "Backend error", error: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Monitors deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
