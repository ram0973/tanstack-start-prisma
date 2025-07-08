import { FormInput } from '@/components/FormInput'
import { NotFound } from '@/components/NotFound'
import { PageLoader } from '@/components/PageLoader'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getUser, updateUser } from '@/server/users'
import { UpdateUser } from '@/types/users/UpdateUser'
import { zodResolver } from '@hookform/resolvers/zod'
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, ErrorComponent, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { CircleAlert, LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

const userQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["users", id],
		queryFn: () => getUser({ data: id }),
	})

export const Route = createFileRoute('/dashboard/users/update/$userId')({
	loader: async ({ context, params: { userId } }) => {
		await context.queryClient.ensureQueryData(userQueryOptions(userId))
	},
	errorComponent: UserErrorComponent,
	notFoundComponent: () => {
		return <NotFound>User not found</NotFound>
	},
	component: UpdateUserComponent,
})

function UserErrorComponent({ error }: ErrorComponentProps) {
	return <ErrorComponent error={error} />
}

function UpdateUserComponent() {
	const params = Route.useParams()
	const { data: user, isLoading, isFetching, isError, error } = useSuspenseQuery(userQueryOptions(params.userId))

	if (isLoading || isFetching) {
		return <PageLoader type='page' />
	}

	if (isError) {
		return (<span>Error: {error.message}</span>)
	}

	if (!user) {
		return (<span>User not found</span>)
	}
	return <UpdateUserForm user={user} />
}

const UpdateUserForm = ({ user }: { user: z.infer<typeof UpdateUser> }) => {

	const form = useForm<z.infer<typeof UpdateUser>>({
		resolver: zodResolver(UpdateUser),
		defaultValues: {
			id: user.id,
			name: user.name,
			email: user.email,
		},
	})

	const updateUserMutation = useMutation({
		mutationFn: useServerFn(updateUser),
	})

	const router = useRouter()
	const queryClient = useQueryClient();

	async function onSubmit(values: z.infer<typeof UpdateUser>) {
		try {
			await updateUserMutation.mutateAsync({ data: values })
			toast('User has been updated')
			router.invalidate()
			queryClient.invalidateQueries({
				queryKey: ['users'],
			})
			queryClient.invalidateQueries({
				queryKey: ['users', values.id],
			})
			router.navigate({ to: '/dashboard/users' })
		} catch (error: unknown) {
			toast(`Error while updating user: ${error}`, {
				style: {
					color: 'red',
				},
				icon: <CircleAlert />,
			})
		}
	}

	return (
		<div className='mt-6'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9">
					<FormInput form={form} name="name" label="Name" placeholder="Enter user name" />
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Enter user email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
						{form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
					</Button>
				</form>
			</Form>
		</div>
	)
}
