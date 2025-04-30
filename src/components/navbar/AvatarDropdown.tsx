//import { authClient } from "@/lib/auth-client";
import { authClient } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Link, useRouter } from '@tanstack/react-router'
import { useSession } from '@/hooks/auth-hooks'
import { DoorOpen, LayoutIcon, LogOut } from 'lucide-react'

export const AvatarDropdown = () => {
  const { data: me} = useSession()
  const router = useRouter()

  return (
    me && (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={me.user.image ?? '/avatar.jpg'} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{me.user.name}</DropdownMenuLabel>
          <DropdownMenuLabel>{me.user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LayoutIcon /><Link to="/dashboard/users">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault()
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.navigate({"to": '/'})
                  },
                },
              })
            }}
          ><DoorOpen /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  )
}
