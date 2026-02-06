import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/", "/monitors", "/settings"];
const publicRoutes = ["/auth/login", "/auth/register"];

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000 - 10000;
  } catch {
    return true;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute =
    protectedRoutes.includes(path) ||
    path.startsWith("/monitors/") ||
    path.startsWith("/incidents/") ||
    path.startsWith("/seo") ||
    path.startsWith("/performance");
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("mc-access-tk")?.value;

  if (accessToken && isTokenExpired(accessToken)) {
    const response = NextResponse.redirect(
      new URL("/auth/login", request.nextUrl)
    );
    response.cookies.delete("mc-access-tk");
    return response;
  }

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
