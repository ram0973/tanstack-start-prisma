import { PageLoader } from '@/components/PageLoader'
import { authClient } from '@/lib/auth-client'
import { createContext, type ReactNode, useContext } from 'react'

type User = {
  me:
    | {
        id: string
        name: string
        emailVerified: boolean
        email: string
        createdAt: Date
        updatedAt: Date
        image?: string | null | undefined
        banned: boolean | null | undefined
        role?: string | null | undefined
        banReason?: string | null | undefined
        banExpires?: Date | null | undefined
      }
    | null
    | undefined
}

const appReactContext = createContext<User>({ me: null })

export const useAppContext = () => {
  return useContext(appReactContext)
}

export const useMe = () => {
  const { me } = useAppContext()
  return me
}

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { data, error, isPending } = authClient.useSession()
  return (
    <appReactContext.Provider value={{ me: data?.user || null }}>
      {isPending ? <PageLoader type="page"/> : error ? <p>Error: {error?.message}</p> : children}
    </appReactContext.Provider>
  )
}