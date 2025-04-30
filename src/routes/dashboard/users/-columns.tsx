import type { User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { DeleteUserDialog } from './-DeleteUserDialog'

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    meta: 'Name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <div className="">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Name
            {!isSorted && <ArrowUpDown className="h-4 w-4" />}
            {isSorted === 'asc' && <ArrowUp className="h-4 w-4" />}
            {isSorted === 'desc' && <ArrowDown className="h-4 w-4" />}
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('name')}</div>
    },
  },
  {
    accessorKey: 'email',
    meta: 'Email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <div className="">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Email
            {!isSorted && <ArrowUpDown className="h-4 w-4" />}
            {isSorted === 'asc' && <ArrowUp className="h-4 w-4" />}
            {isSorted === 'desc' && <ArrowDown className="h-4 w-4" />}
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('email')}</div>
    },
  },
  {
    accessorKey: 'createdAt',
    meta: 'Created',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <div className="">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Created
            {!isSorted && <ArrowUpDown className="h-4 w-4" />}
            {isSorted === 'asc' && <ArrowUp className="h-4 w-4" />}
            {isSorted === 'desc' && <ArrowDown className="h-4 w-4" />}
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const createdAt = format(Date.parse(row.getValue('createdAt')), 'dd.MM.yyyy')
      return <div className="font-medium">{createdAt}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const userId = row.original.id
      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link to={`/dashboard/users/update/$userId`} params={{ userId: userId }}>
                  Update user
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger className="w-full">
                <DropdownMenuItem variant="destructive">
                  Delete User
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteUserDialog id={userId} />
        </AlertDialog>
      )
    },
  },
]
