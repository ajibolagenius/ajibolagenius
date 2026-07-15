import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (request.method === "POST" || request.headers.has("next-action")) {
    return NextResponse.next();
  }
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
