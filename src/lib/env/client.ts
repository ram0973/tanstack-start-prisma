import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
		VITE_SITE_URL: z.string().url(),
  },
  // biome-ignore lint/style/noProcessEnv: <explanation>
  runtimeEnv: process.env,
});