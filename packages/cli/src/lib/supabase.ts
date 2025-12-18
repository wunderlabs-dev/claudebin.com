import { createClient } from "@supabase/supabase-js";
import { isNil } from "ramda";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (isNil(supabaseUrl) || isNil(supabaseAnonKey)) {
  throw new Error("[ERROR]: Supabase credentials must be set");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
