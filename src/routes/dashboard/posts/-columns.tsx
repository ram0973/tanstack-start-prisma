import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Post } from '@prisma/client';
import { DialogTrigger } from '@/components/ui/dialog';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale'; // для русской локализации
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react';

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Id
          {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
          {isSorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
          {isSorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    //cell: (info) => info.getValue(),
    //header: () => <span>Id</span>,
    //footer: (props) => props.column.id,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Title
          {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
          {isSorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
          {isSorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    //accessorFn: (row) => row.title,
    //id: 'title',
    //cell: (info) => info.getValue(),
    //header: () => <span>Title</span>,
    //footer: (props) => props.column.id,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Created
          {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
          {isSorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
          {isSorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      // TODO: auto locale
      return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
    },
    //accessorKey: 'createdAt',
    //header: () => 'Created at',
    //footer: (props) => props.column.id,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const postId = row.original.id;

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/dashboard/posts/edit/$postId" params={{ postId }}>
                  <Button variant="outline">Edit post</Button>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DialogTrigger asChild>
                  <Button variant="outline">Delete post</Button>
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete post</DialogTitle>
              <DialogDescription>
                
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              Are you sure?
            </div>
            <DialogFooter>
              <Button type="submit" variant={"destructive"}>Delete</Button>
              <Button type="button">Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
