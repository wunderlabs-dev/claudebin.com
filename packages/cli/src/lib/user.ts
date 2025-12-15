// ABOUTME: User profile management and authentication verification
// ABOUTME: Fetches current user data from Supabase using stored token

import { supabase } from "@/lib/supabase";
import { isNil } from "ramda";

import { readConfig, writeConfig } from "@/helpers/utils";

export const getCurrentUser = async () => {
  const config = await readConfig();
  if (isNil(config?.token)) return null;
  const { data, error } = await supabase.auth.getUser(config.token);

  if (error || isNil(data.user)) return null;
  return data.user;
};

export const authenticateWithToken = async (token: string) => {
  const { data, error } = await supabase.auth.getUser(token);

  if (error || isNil(data.user)) return null;
  // token is valid,
  // save it to config for future use
  await writeConfig({ token });

  return data.user;
};
