'use client'

import { UserNavDrawerProvider } from '@/components/layout/UserNavDrawer'
import { ToastProvider } from '@/components/ui/Toast'
import { FavoritesProvider } from '@/lib/favorites/store'
import type { ReactNode } from 'react'

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <FavoritesProvider>
      <UserNavDrawerProvider>
        <ToastProvider userAppFrame>
          <div
            className="min-h-screen w-full flex justify-center bg-cover bg-center bg-no-repeat"
            style={{
              // backgroundImage: [
              //   'linear-gradient(165deg, rgb(188 0 10 / 0.55) 0%, rgb(37 43 49 / 0.35) 42%, rgb(248 249 250 / 0.92) 78%, rgb(248 249 250) 100%)',
              //   'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80)',
              // ].join(', '),
            }}
          >
            {/* No backdrop-blur here: it creates a fixed-position containing block and breaks
                `user-app-fixed-frame` footers/nav (they would scroll with this column). */}
            <div className="w-full max-w-[430px] min-h-screen bg-surface/95 shadow-sm ring-1 ring-black/[0.06]">
              {children}
            </div>
          </div>
        </ToastProvider>
      </UserNavDrawerProvider>
    </FavoritesProvider>
  )
}
