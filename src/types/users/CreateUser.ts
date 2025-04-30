import z from 'zod'

export const CreateUser = z
	.object({
		name: z.string().trim().min(1),
		email: z.string().trim().email(),
		password: z.string().min(1),
		confirmPassword: z.string().min(1),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords not match',
		path: ['confirmPassword'],
	})
