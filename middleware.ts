import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
}

export const config = {
  matcher: ["/dashboard", "/soil-scanner", "/news", "/crop-analysis", "/market", "/shop", "/services", "/kisan-call"],
};