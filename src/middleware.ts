import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (request: NextRequest): NextResponse => {
  const token = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/signup", "/confirm"];

  const isPublic = publicRoutes.some((path) => pathname.startsWith(path));

  const isAuth = Boolean(token);

  if (!isAuth && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuth && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuth && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
