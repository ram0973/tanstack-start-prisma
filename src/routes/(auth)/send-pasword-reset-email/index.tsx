import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import { CircleAlert, LoaderCircle } from 'lucide-react'

import { FormEmailInput } from '@/components/FormEmailInput'
import { Logo } from '@/components/Logo'
import { useSendVerificationEmail } from '@/hooks/auth-hooks'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/(auth)/send-pasword-reset-email/')({
	component: SendPasswordResetForm,
})

const zSignInTrpcInput = z.object({
	email: z.string().email(),
})

function SendPasswordResetForm() {
	const form = useForm<z.infer<typeof zSignInTrpcInput>>({
		resolver: zodResolver(zSignInTrpcInput),
		defaultValues: {
			email: '',
		},
	})
	const router = useRouter()
	const sendVerificationEmail = useSendVerificationEmail()
	async function onSubmit(values: z.infer<typeof zSignInTrpcInput>) {
		try {
			await sendVerificationEmail.mutateAsync({
				email: values.email,
			})
			router.navigate({ to: '/' })
		} catch (error: unknown) {
			toast(`${error}`, {
				style: {
					color: 'red',
				},
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
						<h1>Resend verification email</h1>
					</div>
					<FormEmailInput form={form} label="Email" name="email" placeholder='hello@example.com' />
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
						{form.formState.isSubmitting ? 'Sending...' : 'Send'}
					</Button>
				</form>
			</Form>
		</div>
	)
}
