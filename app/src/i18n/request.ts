import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "en";

  return {
    locale,
    messages: (await import("@/copy/en-EN.json")).default,
  };
});
