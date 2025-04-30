import { VerifyEmail } from '@/components/emails/verify-email'
import { env } from '@/lib/env/server'
import { render } from '@react-email/render'
import nodeMailer from 'nodemailer'
import type { SentMessageInfo } from 'nodemailer'

const transporter = nodeMailer.createTransport({
  host: env.GMAIL_HOST,
  port: +env.GMAIL_PORT,
  secure: true,
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_KEY,
  },
})

export const sendEmailByGmail = async ({
  subject,
  template,
  to,
}: {
  subject: string,
  template: typeof VerifyEmail,
  to: string,
}) => {
  const html = await render(template)
  const info: SentMessageInfo = await transporter
    .sendMail({
      from: 'noreply@example.com', // sender address //TODO: update
      to, // list of receivers
      subject, // Subject
      html, // html text body
      sender: 'noreply@example.com',
    })
    .catch((error) => {
      console.error('error', error)
      throw error
    })
  return info || null
}
