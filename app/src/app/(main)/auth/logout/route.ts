import { createClient } from "@/supabase/server";

export const POST = async () => {
  const supabase = await createClient();

  await supabase.auth.signOut();

  return new Response(null, { status: 200 });
};
