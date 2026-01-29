"use server";

import { isNil } from "ramda";
import { redirect } from "next/navigation";

import { createClient } from "@/supabase/server";

export const deleteAccount = async (): Promise<{ error: string } | never> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ deletedAt: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { error: "Failed to delete account" };
  }

  await supabase.auth.signOut();

  redirect("/");
};
