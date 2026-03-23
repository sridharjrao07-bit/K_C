"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to send a message." };
  }

  const recipientId = formData.get("recipientId") as string;
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  if (!recipientId || !subject || !content) {
    return { error: "Missing required fields." };
  }

  const { error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      subject,
      content
    });

  if (error) {
    console.error("Server Action Error sending message:", error);
    return { error: error.message };
  }

  return { success: true };
}
