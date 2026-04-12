'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MaterialIcon } from '@/components/MaterialIcon'
import { Badge } from '@/components/ui/Badge'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'
import { useCart } from '@/lib/cart/store'
import { mockOrders } from '@/lib/orders/store'

interface OrderListItem {
  id: string
  restaurant: string
  image: string
  items: string[]
  total: number
  status: string
  statusTone: 'success' | 'error' | 'warning' | 'info'
  time: string
  date: string
}

// Transform mockOrders to display format
const transformOrder = (order: typeof mockOrders[0]): OrderListItem => ({
  id: order.id,
  restaurant: order.restaurant,
  image: order.image,
  items: order.items.map(item => item.name),
  total: order.total,
  status: order.status,
  statusTone: order.statusTone as 'success' | 'error' | 'warning' | 'info',
  time: order.time,
  date: order.date,
})

export default function OrdersPage() {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

  const handleTrackOrder = (orderId: string) => {
    router.push(`/user/orders/${orderId}`)
  }

  const handleViewDetails = (orderId: string) => {
    router.push(`/user/orders/${orderId}/details`)
  }

  const handleReorder = (order: OrderListItem) => {
    // Add items from the order to cart
    order.items.forEach((itemName) => {
      // For demo purposes, create a simple cart item
      // In a real app, you'd have proper item IDs and images
      addItem({
        id: `${order.id}-${itemName}`,
        name: itemName,
        price: order.total / order.items.length, // Distribute total evenly
        image: order.image,
      })
    })
    // Navigate to cart after adding
    router.push('/user/cart')
  }

  // Filter orders from mockOrders based on status
  const activeOrders = mockOrders
    .filter(order => order.status === 'Out for Delivery' || order.status === 'Preparing')
    .map(transformOrder)

  const completedOrders = mockOrders
    .filter(order => order.status === 'Delivered' || order.status === 'Cancelled')
    .map(transformOrder)

  const orders = activeTab === 'active' ? activeOrders : completedOrders

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-32 md:pb-8">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={openDrawer} className="text-zinc-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <MaterialIcon name="menu" className="text-2xl" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-lg sm:text-xl text-primary">
              My Orders
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden cursor-pointer" onClick={() => router.push('/user/profile')}>
              <img
                className="w-full h-full object-cover"
                alt="User profile avatar photo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBLTUkPph8lyHdvxM66U8H8_95GCrxcO46WjeUi1MA8D_FLTN_SqQI_uHSLGUH4fRbtI-TWsvVTblcDWvFLs5gV6EzM206c91DoW-Vls_ueYkDqnk7RJTlWExOxMpUrTXveRmq1FXVGud-Gx0U9sZp5lBnZ3pSRAhdVzDiODC0m82H4g1hIcxeYsStCVVUYcmHuodFLRLd3zt3C_ZnQs7PeYRVZ8pQ6sX-a2D11H9-liDxAmBIDHyOgJT5_mbENQgB5M2lZxJdFes"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Editorial Header */}
        <header className="mb-8 sm:mb-10">
          <span className="text-primary font-bold tracking-widest text-[10px] uppercase block mb-2">History &amp; Archives</span>
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl tracking-tight text-on-surface">Your Culinary Timeline</h2>
          <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">Review your curated dining experiences and reorder your favorites with a single tap.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8">
          <Button
            onClick={() => setActiveTab('active')}
            variant={activeTab === 'active' ? 'primary' : 'outline'}
            className="flex-1"
          >
            Active ({activeOrders.length})
          </Button>
          <Button
            onClick={() => setActiveTab('completed')}
            variant={activeTab === 'completed' ? 'primary' : 'outline'}
            className="flex-1"
          >
            Completed ({completedOrders.length})
          </Button>
        </div>

        {/* Orders List - Editorial Style */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className={`p-4 sm:p-5 overflow-hidden group ${order.status === 'Cancelled' ? 'bg-surface-container-low/50 opacity-80' : 'bg-surface-container-lowest'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 sm:gap-4">
                  <div
                    onClick={order.status === 'Delivered' || order.status === 'Cancelled' ? () => handleViewDetails(order.id) : undefined}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0 ${order.status === 'Delivered' || order.status === 'Cancelled' ? 'cursor-pointer active:scale-95 transition-transform' : ''} ${order.status === 'Cancelled' ? 'grayscale' : ''}`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      alt={order.restaurant}
                      src={order.image}
                    />
                  </div>
                  <div>
                    <h3
                      onClick={order.status === 'Delivered' || order.status === 'Cancelled' ? () => handleViewDetails(order.id) : undefined}
                      className={`font-headline font-bold text-base sm:text-lg text-on-surface group-hover:text-primary transition-colors ${order.status === 'Delivered' || order.status === 'Cancelled' ? 'cursor-pointer active:opacity-70' : ''} ${order.status === 'Cancelled' ? '' : ''}`}
                    >
                      {order.restaurant}
                    </h3>
                    <p className="text-on-surface-variant text-xs font-medium">{order.date}</p>
                  </div>
                </div>
                <Badge
                  tone={order.statusTone}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${order.status === 'Delivered' ? 'bg-surface-container-high text-on-surface-variant' : ''}`}
                >
                  {order.status}
                </Badge>
              </div>

              <div className={`p-3 mb-4 ${order.status === 'Cancelled' ? '' : 'bg-surface-container-low rounded-lg'}`}>
                <p className="text-sm text-on-surface-variant leading-snug">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      <span className="font-semibold text-on-surface">1x</span> {item}
                      {index < order.items.length - 1 && ', '}
                    </span>
                  ))}
                </p>
                <div className={`mt-2 flex items-center justify-between ${order.status === 'Cancelled' ? 'border-t border-outline-variant/10 pt-2' : ''}`}>
                  <span className="text-xs text-on-surface-variant">Order #{order.id}</span>
                  <span className="font-headline font-bold text-on-surface">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {activeTab === 'active' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleTrackOrder(order.id)}
                    variant="primary"
                    className="flex-1 py-3 rounded-full font-headline font-bold text-sm tracking-wide shadow-lg shadow-primary/20 active:scale-95 transition-all duration-200"
                  >
                    Track Order
                  </Button>
                  <Button
                    onClick={() => handleViewDetails(order.id)}
                    variant="secondary"
                    className="px-4 py-3 rounded-full font-headline font-bold text-xs active:scale-95 transition-all"
                  >
                    Details
                  </Button>
                </div>
              )}

              {activeTab === 'completed' && order.status !== 'Cancelled' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleReorder(order)}
                    variant="primary"
                    className="flex-1 py-3 rounded-full font-headline font-bold text-sm tracking-wide shadow-lg shadow-primary/20 active:scale-95 transition-all duration-200"
                  >
                    Reorder
                  </Button>
                  <Button
                    onClick={() => handleViewDetails(order.id)}
                    variant="secondary"
                    className="px-4 py-3 rounded-full font-headline font-bold text-xs active:scale-95 transition-all"
                  >
                    Details
                  </Button>
                </div>
              )}

              {activeTab === 'completed' && order.status === 'Cancelled' && (
                <Button
                  variant="outline"
                  className="w-full border border-outline-variant text-on-surface-variant py-3 rounded-full font-headline font-bold text-xs active:scale-95 transition-all"
                >
                  Support Message
                </Button>
              )}
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-16">
            <MaterialIcon name="receipt_long" className="text-6xl text-zinc-300 mb-4" />
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">
              No orders yet
            </h3>
            <p className="text-zinc-500 mb-6">
              {activeTab === 'active' ? 'You have no active orders' : 'You have no completed orders'}
            </p>
            <Button
              onClick={() => router.push('/user/menu')}
              variant="primary"
              size="md"
              className="px-8 py-3"
            >
              Browse Menu
            </Button>
          </div>
        )}
      </main>

      {/* BottomNavBar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-xl flex justify-around items-center px-4 pb-safe z-50 rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.04)] md:hidden">
        <div
          onClick={() => router.push('/user/home')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="home" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Home</span>
        </div>
        <div
          onClick={() => router.push('/user/menu')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="restaurant_menu" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Menu</span>
        </div>
        <div className="flex flex-col items-center justify-center text-primary font-bold scale-110 transition-transform cursor-pointer">
          <MaterialIcon name="receipt_long" className="text-2xl" filled />
          <span className="font-body text-[10px] font-medium tracking-wide">Orders</span>
        </div>
        <div
          onClick={() => router.push('/user/notifications')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="notifications" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Notifications</span>
        </div>
        <div
          onClick={() => router.push('/user/profile')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="person_outline" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Profile</span>
        </div>
      </nav>
    </div>
  )
}
