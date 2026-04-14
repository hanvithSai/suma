import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getURL } from "@/utils/url";

/**
 * app/auth/callback/route.ts
 * 
 * Handles the redirect from external auth providers (like Google).
 * It exchanges the code for a session and redirects the user to the homepage.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in search params, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${getURL()}${next.startsWith("/") ? next.slice(1) : next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${getURL()}auth/auth-error`);
}
