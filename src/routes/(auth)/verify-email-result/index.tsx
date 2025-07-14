import { Button } from '@/components/ui/button';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/verify-email-result/')({
	validateSearch: (search: Record<string, unknown>) => ({
		error: search.error as "token_expired" | "invalid_token" | undefined,
		status: search.status as "verified" | undefined,
	}),
	component: RouteComponent,
})

function RouteComponent() {
	const { error } = Route.useSearch();
	const router = useRouter()
	if (error) {
		return (
			<div>
				<h1 className="mb-4 text-2xl">Email verification error</h1>
				<p className='mb-4'>
					{error === "token_expired"
						? "Link expired. Get a new link."
						: "Invalid link"}
				</p>
				<Button onClick={() => { router.navigate({ to: "/send-verification-email" }) }}>
					Resend
				</Button>
			</div>
		);
	}

	return (
		<>
			<h1 className="mb-4 text-2xl">
				Email successfully verified!
			</h1>
			<Button onClick={() => { router.navigate({ to: "/" }) }}>Go to home</Button>
		</>
	)
}

// http://localhost:8888/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJhbTA5NzNAZ21haWwuY29tIiwiaWF0IjoxNzUyMTUyMDkyLCJleHAiOjE3NTIxNTIzOTJ9.zZ1QQsSpPpkNMj_Zw7Yw7F9R5w77Xl-2VJART8N-6mc&callbackURL=/verify-email-result
