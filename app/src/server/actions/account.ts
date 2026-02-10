"use server";

import { isNil } from "ramda";
import { redirect } from "next/navigation";

import { createClient } from "@/server/supabase/server";

export const deleteAccount = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ deletedAt: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    throw new Error("Failed to delete account");
  }

  await supabase.auth.signOut();

  redirect("/");
};
