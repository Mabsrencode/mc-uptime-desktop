import { NextResponse } from "next/server";
import environments from "@/lib/environment";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const body = await req.json();

    if (path.includes("login")) {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json(
          { message: "Missing email or password" },
          { status: 403 }
        );
      }

      try {
        const response = await fetch(`${environments.API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Backend error:", errorData);
          return NextResponse.json(
            { message: "Backend error", error: errorData },
            { status: response.status }
          );
        }

        const data = (await response.json()) as { token: string };
        const decoded = jwt.verify(data.token, environments.JWT) as {
          userID?: string;
          password?: string;
          exp?: number;
        };
        const accessToken: string = jwt.sign(
          { userID: decoded.userID },
          environments.JWT
        );
        const cookieStore = await cookies();
        if (accessToken && decoded.exp) {
          cookieStore.set("mc-access-tk", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: new Date(Date.now() + decoded.exp * 1000),
          });
        } else {
          console.error("Decoded token does not contain userID");
          return NextResponse.json(
            { message: "Invalid token" },
            { status: 400 }
          );
        }
        console.log(cookieStore.getAll());

        console.log(decoded);
        return NextResponse.json(data);
      } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
          { message: "Server error", error: String(error) },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: "Invalid path" }, { status: 400 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
