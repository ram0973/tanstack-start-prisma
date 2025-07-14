import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(8),
		BETTER_AUTH_URL: z.string().url(),
		DATABASE_URL: z.string().url(),
		RESEND_API_KEY: z.string(),
		GMAIL_HOST: z.string(),
    GMAIL_PORT: z.string(),
    GMAIL_USER: z.string(),
    GMAIL_KEY: z.string(),
  },
  // biome-ignore lint/style/noProcessEnv: <explanation>
  runtimeEnv: process.env,
});