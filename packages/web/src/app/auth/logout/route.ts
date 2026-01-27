import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/supabase/server";

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");

  const response = NextResponse.redirect(new URL("/", request.url));

  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
};
