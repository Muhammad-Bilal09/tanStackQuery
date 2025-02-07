import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  const session = await auth();

  const publicRoutes = ["/auth/login", "/auth/register"];
  const protectedRoutes = ["/"];

  if (protectedRoutes.includes(req.nextUrl.pathname) && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*"],
};
