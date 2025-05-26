import { prisma } from '@/lib/prisma';
import { createAPIFileRoute } from '@tanstack/react-start/api';

export const APIRoute = createAPIFileRoute('/api/posts')({
  GET: async ({page, pageSize}) => {
    const posts = await prisma.post.findMany({
      take: pageSize,
      skip: page * pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await prisma.post.count();
    return { posts, total };
  },
});
