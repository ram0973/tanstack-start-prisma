import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI, admin } from 'better-auth/plugins';
import { reactStartCookies } from 'better-auth/react-start';
import { prisma } from './prisma';

export const auth = betterAuth({
  plugins: [reactStartCookies(), openAPI(), admin()],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    disableSessionRefresh: false,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  emailAndPassword: {
    requireEmailVerification: false,
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID as string,
      clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET as string,
    },
    vk: {
      clientId: import.meta.env.VITE_VK_CLIENT_ID as string,
      clientSecret: import.meta.env.VITE_VK_CLIENT_SECRET as string,
    },
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET as string,
    },
  },
});
