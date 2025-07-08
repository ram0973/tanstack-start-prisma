import { cn } from '@/lib/utils' // Убедитесь, что у вас есть cn-утилита для объединения классов

type LoaderProps = {
  type?: 'page' | 'section'
  className?: string
}

export const PageLoader = ({ type = 'page', className }: LoaderProps) => {
  const baseClasses = 'relative block rounded-full animate-spin border-solid border-gray-400 border-t-transparent'

  const sizeClasses = {
    page: 'h-16 w-16 border-[6px]', // 60px (примерно) с border-width 6px
    section: 'h-14 w-14 border-[5px]' // 56px с border-width 5px
  }

  const containerClasses = {
    page: 'w-full min-h-screen h-full flex items-center justify-center',
    section: 'w-full h-20 flex items-center justify-center' // 80px высота контейнера
  }

  return (
    <div className={cn(containerClasses[type], className)}>
      <div className={cn(baseClasses, sizeClasses[type])} />
    </div>
  )
}
