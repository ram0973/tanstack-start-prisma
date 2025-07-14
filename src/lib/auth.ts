import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI, admin } from 'better-auth/plugins'
import { reactStartCookies } from 'better-auth/react-start'
import { prisma } from './prisma'
import { VerifyEmail } from '@/components/emails/verify-email'
import { sendEmailByGmail } from './email'
import { toast } from 'sonner'

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
    sendResetPassword: async ({ user, url, token }) => {
      // Send reset password email
    },
    resetPasswordTokenExpiresIn: 300, // 5 minutes
  },
  emailVerification: {
    //  onSuccess: (user) => {
    //   auth.setState({ user });
    //   window.location.href = "/verify-email-result?status=verified";
    // 	toast("Good")
    // },
    // onError: (error) => {
    //   window.location.href = `/verify-email-result?error=${error.code}`;
    // 	toast("Bad")
    // },
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
