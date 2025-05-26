import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { prisma } from '@/lib/prisma';

import { Input } from '@/components/ui/input';
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { z } from 'zod';
import { columns } from './-columns';

const postSearchSchema = z.object({
  pageIndex: z.number().int().nonnegative().default(0),
  pageSize: z.number().int().nonnegative().default(10),
  sortBy: z.enum(['id', 'title', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  searchQuery: z.string().optional(),
});

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
  async ({ data: search }) => {
    const { pageIndex, pageSize, sortBy, sortOrder, searchQuery } =
      postSearchSchema.parse(search);
    const posts = await prisma.post.findMany({
      where: searchQuery
        ? {
            title: {
              contains: searchQuery,
              mode: 'insensitive', // Регистронезависимый поиск
            },
          }
        : undefined,
      take: pageSize,
      skip: pageIndex * pageSize,
      orderBy: sortBy
        ? {
            [sortBy]: sortOrder || 'asc',
          }
        : { id: 'asc' }, // Сортировка по умолчанию
    });
    const total = await prisma.post.count({
      where: searchQuery
        ? {
            title: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          }
        : undefined,
    });
    return { posts, total };
  },
);

export const Route = createFileRoute('/dashboard/posts/')({
  validateSearch: postSearchSchema.parse,
  loaderDeps: ({ search: { pageIndex, pageSize, sortBy, sortOrder, searchQuery } }) => ({
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    searchQuery,
  }),
  loader: async ({ deps: { pageIndex, pageSize, sortBy, sortOrder, searchQuery } }) =>
    fetchPosts({
      data: {
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        searchQuery,
      },
    }),
  component: PostsLayoutComponent,
  staleTime: 0,
});

function PostsLayoutComponent() {
  const { pageIndex, pageSize, sortBy, sortOrder, searchQuery } = Route.useSearch();
  const paginatedPosts = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const currentSearch = Route.useSearch();

  const table = useReactTable({
    enableMultiSort: false, // disable multi-sorting for the entire table
    data: paginatedPosts.posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    // Используем search вместо локального состояния
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting: sortBy ? [{ id: sortBy, desc: sortOrder === 'desc' }] : [],
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      navigate({
        search: {
          ...currentSearch, // Сохраняем текущие параметры сортировки
          pageIndex: newPagination.pageIndex,
          pageSize: newPagination.pageSize,
        },
        replace: true,
        startTransition: true,
      });
      table.options.data = [...paginatedPosts.posts];
    },

    // Обработчик изменения сортировки (новый)
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function'
          ? updater(sortBy ? [{ id: sortBy, desc: sortOrder === 'desc' }] : [])
          : updater;
      navigate({
        search: {
          ...currentSearch, // Сохраняем текущие параметры пагинации
          pageIndex: 0, // Сбрасываем на первую страницу при сортировке
          sortBy: newSorting[0]?.id as 'id' | 'title' | undefined,
          sortOrder: newSorting[0]?.desc ? 'desc' : 'asc',
        },
        replace: true,
        startTransition: true,
      });
      table.options.data = [...paginatedPosts.posts];
    },
    rowCount: paginatedPosts.total,
  });

  return (
    <>
      <div className="container mx-auto py-10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {`${table.getFilteredRowModel().rows.length}`} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                navigate({
                  search: {
                    pageIndex: 0, // Сбрасываем на первую страницу
                    pageSize: Number(value),
                  },
                });
                //table.setPageSize(Number(value));
                //table.setPageIndex(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 12, 20, 35, 50].map((pageSizeItem) => (
                  <SelectItem key={pageSizeItem} value={`${pageSizeItem}`}>
                    {pageSizeItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm font-medium">Page</p>
          <Input
            type="number"
            min={1}
            max={table.getPageCount()}
            defaultValue={pageIndex + 1}
            className="w-20"
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              if (page >= 0 && page < table.getPageCount()) {
                table.setPageIndex(page);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = e.currentTarget.value
                  ? Number(e.currentTarget.value) - 1
                  : 0;
                table.setPageIndex(Math.min(Math.max(page, 0), table.getPageCount() - 1));
              }
            }}
          />

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {`${table.getPageCount()}`}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
