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
import { Post } from '@prisma/client';
import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import {
  Column,
  ColumnDef,
  PaginationState,
  Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'

export const fetchPosts = createServerFn({ method: 'GET' })
  //.validator((data: string) => data)
  .handler(async () => {
    const posts = await prisma.post.findMany({
      take: 10,
      skip: 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!posts) {
      throw new Error('Failed to fetch posts');
    }
    return posts;
  });

export const Route = createFileRoute('/dashboard/blog/posts/')({
  loader: async () => fetchPosts(),
  component: PostsLayoutComponent,
});

function PostsLayoutComponent() {
  const search = useSearch({ from: '/dashboard/blog/posts/' });
  const posts = Route.useLoaderData();
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const rerender = React.useReducer(() => ({}), {})[1]
  const columns = React.useMemo<ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: 'id',
        cell: info => info.getValue(),
        header: () => <span>Id</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.title,
        id: 'title',
        cell: info => info.getValue(),
        header: () => <span>Title</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'createdAt',
        header: () => 'Created at',
        footer: props => props.column.id,
      },
    ],
    []
  )
  const table = useReactTable({
    columns,
    posts,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  })

  return (
    <>
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
              <TableCell>{JSON.stringify(search)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
