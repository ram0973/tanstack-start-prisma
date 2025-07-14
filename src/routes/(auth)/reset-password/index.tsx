import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { CircleAlert, LoaderCircle } from 'lucide-react'

import { Logo } from '@/components/Logo'
import { useResetPassword, useSignUp } from '@/hooks/auth-hooks'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { FormPasswordInput } from '@/components/FormPasswordInput'
import { FormEmailInput } from '@/components/FormEmailInput'
import { FormInput } from '@/components/FormInput'

export const Route = createFileRoute('/(auth)/reset-password/')({
	validateSearch: (search: Record<string, unknown>) => ({
		token: search.token as "token_expired" | "invalid_token" | undefined,
	}),
  component: ResetPasswordForm,
})

const zSignUpTrpcInput = z
  .object({
		oldPassword: z.string().min(1),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords not match',
    path: ['confirmPassword'],
  })

function ResetPasswordForm() {
  const form = useForm<z.infer<typeof zSignUpTrpcInput>>({
    resolver: zodResolver(zSignUpTrpcInput),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  })
  const router = useRouter()
  const resetPassword = useResetPassword()
	const { token } = Route.useSearch();
	if (!token) {
  	throw Error('Bad or missing password reset token')
	}
  async function onSubmit(values: z.infer<typeof zSignUpTrpcInput>) {
    try {
      await resetPassword.mutateAsync({
        newPassword: values.password,
        token,
      })
      router.navigate({ to: '/' })
    } catch (error) {
			console.error(error)
      toast(`${error}`, {
        style: { color: 'red' },
        icon: <CircleAlert />,
      })
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex justify-center">
            <Logo className="h-12 w-12" />
          </div>
          <div className={'text-center font-bold text-lg'}>
            <h1>Reset password</h1>
          </div>
					<FormPasswordInput form={form} label="Old password" name="password" placeholder='Enter old password'/>
					<FormPasswordInput form={form} label="Password" name="password" placeholder='Enter new password'/>
					<FormPasswordInput form={form} label="Confirm password" name="confirmPassword" placeholder='Repeat password'/>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
            {form.formState.isSubmitting ? 'Reset...' : 'Reset'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
