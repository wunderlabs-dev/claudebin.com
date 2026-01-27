import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  const redirectTo = new URL("/", request.url);

  await supabase.auth.signOut();

  return NextResponse.redirect(redirectTo);
};
