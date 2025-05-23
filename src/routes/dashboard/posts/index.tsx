import { Post } from "@prisma/client"
import { columns } from "./-columns"
import { DataTable } from "./-data-table"
import { prisma } from "@/lib/prisma";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";


const postSearchSchema = z.object({
  page: z.number().int().nonnegative().default(0),
  pageSize: z.number().int().nonnegative().default(10),
  //sort: z.enum(['asc', 'desc']).default('desc'),
});

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
  async ({ data: search }) => {
    const { page, pageSize } = postSearchSchema.parse(search);
    const posts = await prisma.post.findMany({
      take: pageSize,
      skip: page * pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await prisma.post.count();
    return posts;
  },
);

export const Route = createFileRoute('/dashboard/posts/')({
  validateSearch: postSearchSchema.parse,
  loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
  loader: ({ deps: { page, pageSize } }) =>
    fetchPosts({
      data: {
        page,
        pageSize,
      },
    }),
  component: PostsLayoutComponent,
});
 
function PostsLayoutComponent() {
  //const { page, pageSize } = Route.useSearch();
  const posts = Route.useLoaderData();
  const navigate = Route.useNavigate();
 
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={posts} navigate={navigate} />
    </div>
  )
}
