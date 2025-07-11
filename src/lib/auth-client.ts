import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { env } from './env';

export const authClient = createAuthClient({
  baseURL: env.VITE_BETTER_AUTH_URL,
  redirectTo: '/',
  plugins: [adminClient()],
});
