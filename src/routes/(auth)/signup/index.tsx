import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { CircleAlert, LoaderCircle } from 'lucide-react'

import { Logo } from '@/components/Logo'
import { useSignUp } from '@/hooks/auth-hooks'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { FormPasswordInput } from '@/components/FormPasswordInput'
import { FormEmailInput } from '@/components/FormEmailInput'
import { FormInput } from '@/components/FormInput'

export const Route = createFileRoute('/(auth)/signup/')({
  component: SignUpForm,
})

const zSignUpTrpcInput = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords not match',
    path: ['confirmPassword'],
  })

function SignUpForm() {
  const form = useForm<z.infer<typeof zSignUpTrpcInput>>({
    resolver: zodResolver(zSignUpTrpcInput),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const router = useRouter()
  const signUp = useSignUp()
  async function onSubmit(values: z.infer<typeof zSignUpTrpcInput>) {
    try {
      await signUp.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
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
            <h1>Sign up for Acme Inc.</h1>
          </div>
					<FormInput form={form} label="Name" name="name" placeholder='John Doe'/>
					<FormEmailInput form={form} label="Email" name="email" placeholder='hello@example.com'/>
					<FormPasswordInput form={form} label="Password" name="password" placeholder='Enter password'/>
					<FormPasswordInput form={form} label="Confirm password" name="confirmPassword" placeholder='Repeat password'/>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
            {form.formState.isSubmitting ? 'Sign up...' : 'Sign up'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
