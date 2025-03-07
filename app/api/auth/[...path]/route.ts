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

        const data = (await response.json()) as {
          user: { email: string; token: string };
        };
        const decoded = jwt.verify(data.user.token, environments.JWT) as {
          userID?: string;
          password?: string;
          exp?: number;
        };
        const accessToken: string = jwt.sign(
          { userID: decoded.userID, password: decoded.password },
          environments.JWT,
          { expiresIn: "1h" }
        );
        const cookieStore = await cookies();
        if (accessToken && decoded.exp) {
          cookieStore.set("mc-access-tk", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: new Date(decoded.exp * 1000), //Date.now() +
          });
        } else {
          console.error("Decoded token does not contain userID");
          return NextResponse.json(
            { message: "Invalid token" },
            { status: 400 }
          );
        }
        return NextResponse.json({
          data,
          message: "Login Successfully!",
        });
      } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
          { message: "Server error", error: String(error) },
          { status: 500 }
        );
      }
    }

    if (path.includes("register")) {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json(
          { message: "Missing email or password" },
          { status: 403 }
        );
      }

      try {
        const response = await fetch(`${environments.API_URL}/auth/register`, {
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

        const data = await response.json();
        return NextResponse.json(data);
      } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
          { message: "Server error", error: String(error) },
          { status: 500 }
        );
      }
    }

    if (path.includes("verify")) {
      const { email, password, otp } = body;
      if (!otp) {
        return NextResponse.json(
          { error: { message: "Missing OTP" } },
          { status: 403 }
        );
      }
      if (!email || !password) {
        return NextResponse.json(
          { message: "Missing email or password" },
          { status: 403 }
        );
      }

      try {
        const response = await fetch(
          `${environments.API_URL}/auth/verify-otp`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, otp }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Backend error:", errorData);
          return NextResponse.json(
            { message: "Backend error", error: errorData },
            { status: response.status }
          );
        }

        const data = (await response.json()) as {
          user: { email: string; token: string };
        };
        const decoded = jwt.verify(data.user.token, environments.JWT) as {
          userID?: string;
          password?: string;
          exp?: number;
        };
        const accessToken: string = jwt.sign(
          { userID: decoded.userID, password: decoded.password },
          environments.JWT,
          { expiresIn: "1h" }
        );
        const cookieStore = await cookies();
        if (accessToken && decoded.exp) {
          cookieStore.set("mc-access-tk", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: new Date(decoded.exp * 1000),
          });
        } else {
          console.error("Decoded token does not contain userID");
          return NextResponse.json(
            { message: "Invalid token" },
            { status: 400 }
          );
        }
        return NextResponse.json({
          data,
          message: "Registered Successfully!",
        });
      } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json(
          { message: "Server error", error: String(error) },
          { status: 500 }
        );
      }
    }
    if (path.includes("logout")) {
      try {
        const cookieStore = await cookies();
        cookieStore.delete("mc-access-tk");
        return NextResponse.json({ message: "Logout successfully!" });
      } catch (error) {
        NextResponse.json({ error: error });
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
