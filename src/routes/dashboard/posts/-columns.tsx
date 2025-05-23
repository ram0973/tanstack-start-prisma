import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Post } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    //cell: (info) => info.getValue(),
    //header: () => <span>Id</span>,
    //footer: (props) => props.column.id,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    //accessorFn: (row) => row.title,
    //id: 'title',
    //cell: (info) => info.getValue(),
    //header: () => <span>Title</span>,
    //footer: (props) => props.column.id,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    //accessorKey: 'createdAt',
    //header: () => 'Created at',
    //footer: (props) => props.column.id,
  },
  {
    id: "actions",
    header: 'Actions',
    cell: ({ row }) => {
      const post = row.original
 
      return (
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
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
