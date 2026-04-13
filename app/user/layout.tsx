'use client'

import { UserNavDrawerProvider } from '@/components/layout/UserNavDrawer'
import { ToastProvider } from '@/components/ui/Toast'
import { FavoritesProvider } from '@/lib/favorites/store'
import type { ReactNode } from 'react'

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <FavoritesProvider>
      <UserNavDrawerProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </UserNavDrawerProvider>
    </FavoritesProvider>
  )
}
