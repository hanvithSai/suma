"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { generateRoomCode } from "@/utils/room";

/**
 * Creates a new room for the authenticated host.
 */
export async function createRoomAction() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Authentication required to create a room." };
    }

    const code = generateRoomCode();

    const { error: insertError } = await supabase
      .from("rooms")
      .insert([
        {
          code: code,
          host_id: user.id,
        },
      ]);

    if (insertError) {
      console.error("Error inserting room:", insertError);
      return { error: `Failed to create room: ${insertError.message || JSON.stringify(insertError)}` };
    }

    return { code };
  } catch (error: unknown) {
    console.error("Catch Error:", error);
    return { error: "An unexpected error occurred." };
  }
}
