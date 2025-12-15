// ABOUTME: Publish command for sharing Claude Code sessions
// ABOUTME: Handles session discovery and upload to Vibebin
import { isNil } from "ramda";

import { getCurrentUser, authenticateWithToken } from "@/lib/user";

export const publish = async (options: { private: boolean }) => {
  const user = await getCurrentUser();

  console.log(user);
};
