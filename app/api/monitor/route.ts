import environments from "@/lib/environment";
import { handleUnauthorizedResponse } from "@/lib/handleUnauthorized";
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
    const { url, userID, email, interval, monitorType } = body;
    const response = await fetch(`${environments.API_URL}/site`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url,
        userID,
        email,
        interval,
        monitorType,
      }),
    });
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
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
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
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("perPage") || "10";

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type && type !== 'null' && type !== 'undefined') params.set('type', type);
    if (status && status !== 'null' && status !== 'undefined') params.set('status', status);
    params.set('page', page);
    params.set('perPage', perPage);

    const url = `${environments.API_URL}/user-sites/${userId}?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

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

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("mc-access-tk")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    const response = await fetch(`${environments.API_URL}/site/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const unauthorizedResponse = await handleUnauthorizedResponse(response);
      if (unauthorizedResponse) return unauthorizedResponse;
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      return NextResponse.json(
        { message: "Backend error", error: errorData },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Monitor deleted successfully" });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("mc-access-tk")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, url, interval, monitorType } = await req.json();

    const response = await fetch(`${environments.API_URL}/site/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, interval, monitorType }),
    });

    if (!response.ok) {
      const unauthorizedResponse = await handleUnauthorizedResponse(response);
      if (unauthorizedResponse) return unauthorizedResponse;
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      return NextResponse.json(
        { message: "Backend error", error: errorData },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Monitor updated successfully" });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
