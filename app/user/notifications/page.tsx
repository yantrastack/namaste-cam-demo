'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'
import { useToast } from '@/components/ui/Toast'
import { useCart } from '@/lib/cart/store'

export default function NotificationsPage() {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  const { showToast } = useToast()
  const { addItem } = useCart()
  const [activeFilter, setActiveFilter] = useState<'all' | 'order' | 'promotion'>('all')
  const [filterOpen, setFilterOpen] = useState(false)

  const handleTrackLive = () => {
    router.push('/user/orders/ORD-88219')
  }

  const handleViewDetails = () => {
    router.push('/user/orders/ORD-88219/details')
  }

  const handleRateOrder = () => {
    showToast('Rating modal would open here (Demo mode)', 'info')
  }

  const handleRateMeal = handleRateOrder

  const handleReorder = () => {
    addItem({
      id: 'reorder-1',
      name: 'Rigatoni Carbonara',
      price: 18.50,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDZK3tdQTZotJ_jiwyi1FE0lWmrSoNlpbsjF_QfzbIpIsSj3qfheRwjWdNIb3OC6Wze4kL6xmuQuia3OXj0jb3WZeYigdASjQwvhu5khgEylKbKbrQvlsn329yENOlEB2TJYQp7xZFPxOzQAZTMwgwVR0CUYrTuzazRSE-KJ1Tn9tfEM6EXM64qF0WAq6T3VynWFjcn03R-uuQEXuCenzfrDWCUBLldsPpkuksUtqL4fP9ZxTtZbqn0zBt4XLdmNNZqrTbXG5kG3o',
    })
    router.push('/user/cart')
  }

  const notifications = [
    {
      id: '1',
      type: 'order' as const,
      title: 'Your order is being prepared',
      description: "Chef Antonio is hand-crafting your Rigatoni Carbonara. Expected arrival in 25 mins.",
      time: 'Just Now',
      unread: true,
      icon: 'restaurant',
      actions: [
        { label: 'Track Live', onClick: handleTrackLive, primary: true },
        { label: 'View Details', onClick: handleViewDetails, primary: false },
      ],
    },
    {
      id: '2',
      type: 'promotion' as const,
      title: "Editorial Pick: 30% Off",
      description: "Try our curated 'Summer Truffle' collection at Le Bernardin with an exclusive editor's discount.",
      time: '2 hours ago',
      unread: false,
      icon: 'star',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDZK3tdQTZotJ_jiwyi1FE0lWmrSoNlpbsjF_QfzbIpIsSj3qfheRwjWdNIb3OC6Wze4kL6xmuQuia3OXj0jb3WZeYigdASjQwvhu5khgEylKbKbrQvlsn329yENOlEB2TJYQp7xZFPxOzQAZTMwgwVR0CUYrTuzazRSE-KJ1Tn9tfEM6EXM64qF0WAq6T3VynWFjcn03R-uuQEXuCenzfrDWCUBLldsPpkuksUtqL4fP9ZxTtZbqn0zBt4XLdmNNZqrTbXG5kG3o',
      badge: 'LIMITED TIME OFFER',
    },
    {
      id: '3',
      type: 'order' as const,
      title: 'Order Delivered',
      description: "Hope you enjoyed your meal from 'The Parisian Bistro'. Would you like to leave a review?",
      time: 'Yesterday',
      unread: false,
      icon: 'receipt_long',
      actions: [
        { label: 'Rate Meal', onClick: handleRateMeal, primary: false },
        { label: 'Reorder', onClick: handleReorder, primary: false },
      ],
    },
    {
      id: '4',
      type: 'promotion' as const,
      title: 'New Restaurant Near You',
      description: "'Sakura Sushi' just joined Culinary Editorial. Be among the first to taste their signature Wagyu rolls.",
      time: '2 days ago',
      unread: false,
      icon: 'notifications',
    },
  ]

  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeFilter)

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-32 md:pb-8">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button onClick={openDrawer} className="text-zinc-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <MaterialIcon name="menu" className="text-2xl" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-lg sm:text-xl text-primary">
              Namaste Cam
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden cursor-pointer" onClick={() => router.push('/user/profile')}>
            <img
              className="w-full h-full object-cover"
              alt="User Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2G8Ya3DmG_DvNSfqzOFyJKNuwrC6ntbFiniUI5_ivsRxy6CunMgZvBNexcclbB33IAaiW8gBFUffMqXEfcHTEQZmRvrTcWS8q-975Jf4M1p5_Faw6dET-5uSE6BYYALD3fBLvj-DxXzDE0TYByXH3e7ZOkz5A03nM_Hh4WNwXRmuIyEiYeXWIhY_lFfnOrlD04sGKtavhX_a6VJylOHpDmm_YEuB4eBd1cwDlQqEHpg8ai7QTyECLEB85lABSHZkg9502Zw4Y1yY"
            />
          </div>
        </div>
      </header>

      <main className="pt-24 px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="font-headline font-extrabold text-3xl tracking-tight mb-2">Notifications</h2>
          <p className="text-on-surface-variant text-sm">Stay updated with your latest culinary experiences.</p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            All updates
          </button>
          <button
            onClick={() => setActiveFilter('order')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === 'order'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveFilter('promotion')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === 'promotion'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            Promotions
          </button>
        </div>

        {/* Notifications Feed */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 sm:p-5 rounded-xl transition-all hover:shadow-md ${
                notification.unread ? 'border-l-4 border-primary bg-surface-container-lowest' : 'bg-surface-container-low'
              }`}
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 ${
                  notification.type === 'promotion' && notification.badge ? 'rounded-xl' : 'rounded-full'
                } ${
                  notification.type === 'promotion'
                    ? 'bg-tertiary-fixed flex items-center justify-center'
                    : notification.icon === 'restaurant'
                    ? 'bg-primary-fixed flex items-center justify-center'
                    : 'bg-secondary-container flex items-center justify-center'
                }`}>
                  <MaterialIcon
                    name={notification.icon}
                    className={`text-xl ${
                      notification.type === 'promotion'
                        ? 'text-on-tertiary-fixed'
                        : notification.icon === 'restaurant'
                        ? 'text-primary'
                        : 'text-secondary'
                    }`}
                    filled={notification.type === 'promotion'}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-headline font-bold text-base leading-tight">{notification.title}</h3>
                    <span className={`text-[10px] ${
                      notification.unread ? 'font-semibold text-primary uppercase tracking-wider' : 'font-medium text-on-secondary-container'
                    }`}>
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-3">{notification.description}</p>
                  
                  {notification.image && (
                    <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                      <img
                        className="w-full h-full object-cover"
                        alt="Promotional image"
                        src={notification.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <span className="text-white text-xs font-bold">{notification.badge}</span>
                      </div>
                    </div>
                  )}

                  {notification.actions && (
                    <div className="flex gap-3 mt-3">
                      {notification.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.onClick}
                          className={`text-xs font-semibold hover:opacity-80 transition-opacity ${
                            action.primary ? 'text-primary' : 'text-on-surface-variant'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View Archive */}
        <div className="mt-12 text-center pb-8">
          <button className="font-headline font-bold text-primary text-sm tracking-wide uppercase">
            View Older Notifications
          </button>
        </div>
      </main>

      {/* Floating Filter Button */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform duration-200 z-40"
      >
        <MaterialIcon name="tune" className="text-xl" />
      </button>

      {/* BottomNavBar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-xl flex justify-around items-center px-4 pb-6 pt-3 z-50 rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.04)] md:hidden">
        <div
          onClick={() => router.push('/user/home')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="home" className="text-2xl mb-1" />
          <span className="font-body text-[10px] font-medium tracking-wide">Home</span>
        </div>
        <div
          onClick={() => router.push('/user/menu')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="restaurant_menu" className="text-2xl mb-1" />
          <span className="font-body text-[10px] font-medium tracking-wide">Menu</span>
        </div>
        <div
          onClick={() => router.push('/user/orders')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="receipt_long" className="text-2xl mb-1" />
          <span className="font-body text-[10px] font-medium tracking-wide">Orders</span>
        </div>
        <div className="flex flex-col items-center justify-center text-primary font-bold scale-110 transition-transform cursor-pointer">
          <MaterialIcon name="notifications" className="text-2xl mb-1" filled />
          <span className="font-body text-[10px] font-medium tracking-wide">Notifications</span>
        </div>
        <div
          onClick={() => router.push('/user/profile')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="person_outline" className="text-2xl mb-1" />
          <span className="font-body text-[10px] font-medium tracking-wide">Profile</span>
        </div>
      </nav>
    </div>
  )
}
