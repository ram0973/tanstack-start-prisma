/// <reference types="vite/client" />
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary'
import { NotFound } from '@/components/NotFound'
import { useTheme } from '@/components/ThemeProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { seo } from '@/lib/seo'
import { getThemeServerFn } from '@/server/themes'
import appCss from '@/styles/app.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet, ScriptOnce, Scripts } from '@tanstack/react-router'
import * as React from 'react'
import { Suspense } from 'react'

const OptionalTanStackRouterDevtools =
  // biome-ignore lint/style/noProcessEnv: NODE_ENV
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/react-router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      )

const OptionalReactQueryDevtools =
  // biome-ignore lint/style/noProcessEnv: NODE_ENV
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/react-query-devtools').then((res) => ({
          default: res.ReactQueryDevtools,
        }))
      )

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {

  return (
        <RootDocument>
          <Outlet />
        </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  //const { theme } = useTheme()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
				<ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce>
        {children}
        <Toaster />
        {/* <OptionalTanStackRouterDevtools /> */}
        <OptionalReactQueryDevtools />
        <Scripts />
        {/* <ScriptOnce>
          {`document.documentElement.classList
					  .toggle('dark', localStorage.theme === 'dark' || (!('theme' in localStorage) &&
						window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce> */}
      </body>
    </html>
  )
}
