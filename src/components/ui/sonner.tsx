'use client'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { useEffect, useState } from 'react'

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Логика определения темы только на клиенте
    const isDark =
      document.documentElement.classList.contains('dark') ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)

    setTheme(isDark ? 'dark' : 'light')
  }, [])

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        style: {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties,
      }}
      {...props}
    />
  )
}

export { Toaster }