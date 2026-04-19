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

/**
 * Updates the PDF URL for a room.
 */
export async function updateRoomPDFAction(code: string, url: string | null) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("rooms")
      .update({ current_pdf_url: url, current_pdf_page: 1 })
      .eq("code", code);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating room PDF:", error);
    return { error: "Failed to update PDF info." };
  }
}

/**
 * Updates the current page of a room's PDF.
 */
export async function updateRoomPageAction(code: string, page: number) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("rooms")
      .update({ current_pdf_page: page })
      .eq("code", code);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating room page:", error);
    return { error: "Failed to update page info." };
  }
}
