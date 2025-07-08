import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteUser } from '@/server/users'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { CircleAlert } from 'lucide-react'
import { toast } from 'sonner'

export const DeleteUserDialog = ({ id }: { id: string }) => {
  const deleteUserMutation = useMutation({
		mutationFn: useServerFn(deleteUser),
	})

	const router = useRouter()
	const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync({ data: id })
      toast.success('User deleted successfully')
      router.invalidate()
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
			queryClient.invalidateQueries({
			 	queryKey: ['users', id],
			})
    } catch (error) {
      toast('Error while deleting user', {
        description: error instanceof Error ? error.message : 'Unknown error',
        style: { color: 'red' },
        icon: <CircleAlert />,
      })
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure to delete user?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
