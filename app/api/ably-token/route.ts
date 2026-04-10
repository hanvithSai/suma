import { createAblyTokenRequest } from "@/lib/ably";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tokenRequest = await createAblyTokenRequest();
    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("Ably token error:", error);
    return NextResponse.json(
      { error: "Failed to generate Ably token" },
      { status: 500 }
    );
  }
}
