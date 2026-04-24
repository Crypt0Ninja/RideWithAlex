import { NextRequest, NextResponse } from "next/server";
import { storeTokensFromCode } from "@/lib/google/oauth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const cookieState = request.cookies.get("google_oauth_state")?.value;

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/google-setup?error=${encodeURIComponent(error)}`, request.url),
    );
  }
  if (!code) {
    return NextResponse.redirect(
      new URL("/admin/google-setup?error=missing_code", request.url),
    );
  }
  if (!state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(
      new URL("/admin/google-setup?error=state_mismatch", request.url),
    );
  }

  try {
    const email = await storeTokensFromCode(code);
    const response = NextResponse.redirect(
      new URL(`/admin/google-setup?connected=${encodeURIComponent(email)}`, request.url),
    );
    response.cookies.delete("google_oauth_state");
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.redirect(
      new URL(`/admin/google-setup?error=${encodeURIComponent(message)}`, request.url),
    );
  }
}
