'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'
import { Drawer } from '@/components/ui/Drawer'

interface UserNavDrawerContextType {
  openDrawer: () => void
  closeDrawer: () => void
  isDrawerOpen: boolean
}

const UserNavDrawerContext = createContext<UserNavDrawerContextType | undefined>(undefined)

export function useUserNavDrawer() {
  const context = useContext(UserNavDrawerContext)
  if (!context) {
    throw new Error('useUserNavDrawer must be used within UserNavDrawerProvider')
  }
  return context
}

export function UserNavDrawerProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  const handleNavClick = (nav: string) => {
    closeDrawer()
    if (nav === 'home') {
      router.push('/user/home')
    } else if (nav === 'menu') {
      router.push('/user/menu')
    } else if (nav === 'orders') {
      router.push('/user/orders')
    } else if (nav === 'cart') {
      router.push('/user/cart')
    } else if (nav === 'notifications') {
      router.push('/user/notifications')
    } else if (nav === 'profile') {
      router.push('/user/profile')
    } else if (nav === 'favorites') {
      router.push('/user/favorites')
    }
  }

  return (
    <UserNavDrawerContext.Provider value={{ openDrawer, closeDrawer, isDrawerOpen }}>
      {children}
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-surface-container">
            <h2 className="font-headline text-xl font-bold text-primary">Menu</h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-left ${
                pathname === '/user/home' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-low'
              }`}
            >
              <MaterialIcon name="home" className="text-xl" />
              <span className="font-medium">Home</span>
            </button>
            <button
              onClick={() => handleNavClick('menu')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-left ${
                pathname === '/user/menu' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-low'
              }`}
            >
              <MaterialIcon name="restaurant_menu" className="text-xl" />
              <span className="font-medium">Menu</span>
            </button>
            <button
              onClick={() => handleNavClick('orders')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-left ${
                pathname === '/user/orders' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-low'
              }`}
            >
              <MaterialIcon name="receipt_long" className="text-xl" />
              <span className="font-medium">Orders</span>
            </button>
            <button
              onClick={() => handleNavClick('cart')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-left ${
                pathname === '/user/cart' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-low'
              }`}
            >
              <MaterialIcon name="shopping_cart" className="text-xl" />
              <span className="font-medium">Cart</span>
            </button>
            <button
              onClick={() => handleNavClick('favorites')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-left ${
                pathname === '/user/favorites' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-low'
              }`}
            >
              <MaterialIcon name="favorite" className="text-xl" />
              <span className="font-medium">Favorites</span>
            </button>
            <button
              onClick={() => handleNavClick('notifications')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-left ${
                pathname === '/user/notifications' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-low'
              }`}
            >
              <MaterialIcon name="notifications" className="text-xl" />
              <span className="font-medium">Notifications</span>
            </button>
            <button
              onClick={() => handleNavClick('profile')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-left ${
                pathname === '/user/profile' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-low'
              }`}
            >
              <MaterialIcon name="person" className="text-xl" />
              <span className="font-medium">Profile</span>
            </button>
          </nav>
          <div className="p-4 border-t border-surface-container">
            <button
              onClick={closeDrawer}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container-highest transition-colors"
            >
              <MaterialIcon name="close" className="text-xl" />
              <span className="font-medium">Close</span>
            </button>
          </div>
        </div>
      </Drawer>
    </UserNavDrawerContext.Provider>
  )
}
