'use client'

import { UserNavDrawerProvider } from '@/components/layout/UserNavDrawer'
import { ToastProvider } from '@/components/ui/Toast'
import type { ReactNode } from 'react'

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <UserNavDrawerProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </UserNavDrawerProvider>
  )
}
