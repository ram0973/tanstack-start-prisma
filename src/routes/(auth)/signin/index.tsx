import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { CircleAlert, LoaderCircle } from 'lucide-react'

import { FormPasswordInput } from '@/components/FormPasswordInput'
import { Logo } from '@/components/Logo'
import { Switch } from '@/components/ui/switch'
import { useSendPasswordResetEmail, useSignIn } from '@/hooks/auth-hooks'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { FormEmailInput } from '@/components/FormEmailInput'

export const Route = createFileRoute('/(auth)/signin/')({
  component: SignInForm,
})

const zSignInTrpcInput = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean(),
})

function SignInForm() {
  const form = useForm<z.infer<typeof zSignInTrpcInput>>({
    resolver: zodResolver(zSignInTrpcInput),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  })
  const router = useRouter()
  const { signInWithCredentials } = useSignIn()
	const { sendPasswordResetEmail } = useSendPasswordResetEmail()
  async function onSubmit(values: z.infer<typeof zSignInTrpcInput>) {
    try {
      await signInWithCredentials.mutateAsync({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
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
            <h1>Sign in for Acme Inc.</h1>
          </div>
					<FormEmailInput form={form} label="Email" name="email" placeholder='hello@example.com' />
					<FormPasswordInput form={form} label="Password" name="password" placeholder='Enter password'/>
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <FormLabel>Remember me</FormLabel>
                <FormControl>
                  <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
            {form.formState.isSubmitting ? 'Sign in...' : 'Sign in'}
          </Button>
					<p className="underline cursor-pointer" onClick={()=>{sendPasswordResetEmail(values.email)}}>Forget password?</p>
        </form>
      </Form>
    </div>
  )
}
