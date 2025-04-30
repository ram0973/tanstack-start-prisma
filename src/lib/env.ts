import { z } from 'zod'

const zEnv = z.object({
  VITE_BETTER_AUTH_URL: z.string().trim().min(1),
  VITE_BETTER_AUTH_SECRET: z.string().trim().min(1),
})

export const env = zEnv.parse(import.meta.env)
