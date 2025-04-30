import z from "zod";

export const UpdateUser = z.object({
	id: z.string().trim(),
  name: z.string().trim().min(1, 'Name must be at least 1 character').max(254, 'Name must be less than 255 characters'),
  email: z.string().trim().email(),
})