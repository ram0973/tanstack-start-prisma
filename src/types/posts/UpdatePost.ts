import z from 'zod'

export const UpdatePost = z.object({
  id: z.string(),
  slug: z
    .string()
		.trim()
    .max(254, 'Slug must be less than 254 characters.')
    .regex(/^[a-z0-9-]*$/, 'Slug may contain only lowercase letters, numbers and dashes'),
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters.')
    .max(254, 'Title must be less than 254 characters.'),
  excerpt: z
    .string()
    .min(2, 'Excerpt must be at least 2 characters.')
    .max(254, 'Excerpt must be less than 254 characters.'),
  content: z.string(),
	contentJson: z.string(),

})
