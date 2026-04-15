"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { generateRoomCode } from "@/utils/room";

/**
 * Creates a new room for the authenticated host.
 * @returns An object containing the room code or an error message.
 */
export async function createRoomAction() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Authentication required to create a room." };
    }

    // Generate a unique room code
    const code = generateRoomCode();

    // Insert the room into the database
    const { error: insertError } = await supabase
      .from("rooms")
      .insert([
        {
          code: code,
          host_id: user.id,
          // created_at and status are handled by default values in DB
        },
      ]);

    if (insertError) {
      console.error("Error inserting room:", insertError);
      return { error: "Failed to create room. Please try again." };
    }

    return { code };
  } catch (error) {
    console.error("Unexpected error in createRoomAction:", error);
    return { error: "An unexpected error occurred." };
  }
}
