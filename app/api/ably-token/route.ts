import { createAblyTokenRequest } from "@/lib/ably";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    const tokenRequest = await createAblyTokenRequest(user?.id);
    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("Ably token error:", error);
    return NextResponse.json(
      { error: "Failed to generate Ably token" },
      { status: 500 }
    );
  }
}
