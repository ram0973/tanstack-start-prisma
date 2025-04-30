import { DataTable } from '@/components/DataTable'
import { getUsers } from '@/server/users'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { columns } from './-columns'

const usersQueryOptions = () =>
	queryOptions({
		queryKey: ['users'],
		queryFn: getUsers,
	})

export const Route = createFileRoute('/dashboard/users/')({
	component: Users,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(usersQueryOptions())
	},
	head: () => ({
		meta: [{ title: 'Dashboard | Users' }],
	}),
})

function Users() {
	const { data: users } = useSuspenseQuery(usersQueryOptions())

	return (
		<DataTable data={users ?? []} columns={columns} findByField="name" />
	)
}
