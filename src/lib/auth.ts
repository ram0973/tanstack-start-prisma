import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI, admin } from 'better-auth/plugins'
import { reactStartCookies } from 'better-auth/react-start'
import { prisma } from './prisma'
import { VerifyEmail } from '@/components/emails/verify-email'
import { sendEmailByGmail } from './email'
import { toast } from 'sonner'
import { ResetPasswordEmail } from '@/components/emails/reset-password-email'

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
      disable: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: true,
    minPasswordLength: 1,
    maxPasswordLength: 128,
    autoSignIn: false,
    sendResetPassword: async ({user, url, token}, request) => {
      await sendEmailByGmail({
        to: user.email,
        subject: "Reset your password",
				template: ResetPasswordEmail({
          resetLink: url,
          username: user.email,
        }),
      });
    },
    resetPasswordTokenExpiresIn: 300, // 5 minutes
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24 hours
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailByGmail({
        sendOnSignUp: true,
        subject: 'Verify your email',
        template: VerifyEmail({
          url: url,
          username: user.email,
        }),
        to: user.email,
      })
    },
  },
})
