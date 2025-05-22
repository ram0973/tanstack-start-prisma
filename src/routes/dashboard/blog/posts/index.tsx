import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { prisma } from '@/lib/prisma';
import { createRouter } from '@/router';
import { Post } from '@prisma/client';
import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { z } from 'zod';

const postSearchSchema = z.object({
  page: z.number().int().nonnegative().default(0),
  pageSize: z.number().int().nonnegative().default(10),
  //sort: z.enum(['asc', 'desc']).default('desc'),
});

export const fetchPosts = createServerFn({ method: 'GET' })
.handler(async ({data: search}) => {
  console.log('fetchPosts', search)
  const { page, pageSize } = postSearchSchema.parse(search);
  console.info('Server function: ', page, pageSize)
  const posts = await prisma.post.findMany({
    take: pageSize,
    skip: page * pageSize,
    orderBy: {
      createdAt: 'desc',
    },
  });
  const total = await prisma.post.count();
  return posts;
});

export const Route = createFileRoute('/dashboard/blog/posts/')({
  validateSearch: postSearchSchema.parse,
  loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
  loader: ({ deps: { page, pageSize } }) =>
    fetchPosts({data: {
      page,
      pageSize,
    }}),
  component: PostsLayoutComponent,
})

function PostsLayoutComponent() {
  const { page, pageSize } = Route.useSearch();
  const posts = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const router = createRouter()

  const handlePageSizeChange = (newSize: number) => {
  navigate({
    search: {
      pageSize: newSize,
      page: 0
    },
  }).then(() => {
router.invalidate();
  });
};

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const rerender = React.useReducer(() => ({}), {})[1];
  const columns = React.useMemo<ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: 'id',
        cell: (info) => info.getValue(),
        header: () => <span>Id</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.title,
        id: 'title',
        cell: (info) => info.getValue(),
        header: () => <span>Title</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'createdAt',
        header: () => 'Created at',
        footer: (props) => props.column.id,
      },
    ],
    [],
  );
  // const table = useReactTable({
  //   columns,
  //   posts,
  //   debugTable: true,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   onPaginationChange: setPagination,
  //   //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
  //   state: {
  //     pagination,
  //   },
  //   // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  // });

  return (
    <>
      <div>
        <button onClick={() => handlePageSizeChange(5)}>5 posts</button>
        <button onClick={() => handlePageSizeChange(10)}>10 posts</button>
        <button onClick={() => handlePageSizeChange(20)}>20 posts</button>
      </div>
      <div className="p-10">
        <h3 className="text-2l mb-4 font-semibold">Posts</h3>
        <Table>
          <TableCaption>A list of recent posts</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell">Id</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden text-right md:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Link to="/blog/$postId" params={{ postId: post.id }}>
                    {post.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to="/blog/$postId" params={{ postId: post.id }}>
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell className="hidden text-right md:table-cell">
                  {post.createdAt?.toDateString()}
                </TableCell>
                <TableCell>
                  <Link to={`/dashboard/blog/edit/${post.id}`}>
                    <Button type="button" className="cursor-pointer">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>{}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
