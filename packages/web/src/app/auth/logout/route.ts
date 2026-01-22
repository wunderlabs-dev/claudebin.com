import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", request.url));
};
