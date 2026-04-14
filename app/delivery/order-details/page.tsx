'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { OrderDetails } from '@/components/delivery/OrderDetails'
import { MaterialIcon } from '@/components/MaterialIcon'
import { Order } from '@/types/delivery'

function OrderDetailsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderData = searchParams.get('data')
    if (orderData) {
      try {
        const parsedOrder = JSON.parse(decodeURIComponent(orderData))
        setOrder({ ...parsedOrder, status: 'In Progress' })
      } catch (error) {
        console.error('Failed to parse order data:', error)
      }
    }
    setLoading(false)
  }, [searchParams])

  const handleMarkPickedUp = () => {
    // In a real app, this would update the order status in the backend
    if (order) {
      const updatedOrder = { ...order, status: 'Picked Up' }
      setOrder(updatedOrder)
      
      // Navigate to track-delivery page after a short delay
      setTimeout(() => {
        router.push('/delivery/track-delivery')
      }, 1500)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
            <MaterialIcon name="refresh" className="text-on-primary-container animate-spin" />
          </div>
          <p className="text-secondary">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mb-4 mx-auto">
            <MaterialIcon name="error" className="text-on-error-container text-2xl" />
          </div>
          <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
            Order Not Found
          </h2>
          <p className="text-secondary mb-6">
            The order details you're looking for could not be found.
          </p>
          <button
            onClick={() => router.push('/delivery/new-deliveries')}
            className="px-6 py-3 rounded-full bg-primary text-on-primary font-headline font-bold active:scale-95 transition-all"
          >
            Back to Deliveries
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Navigation */}
      <div className="bg-surface-container-lowest px-4 py-4 border-b border-outline-variant/20 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/delivery/new-deliveries')}
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center active:scale-95 transition-all"
          >
            <MaterialIcon name="arrow_back" className="text-on-surface-variant" />
          </button>
          <h1 className="font-headline font-bold text-xl text-on-surface">
            Order Details
          </h1>
        </div>
      </div>

      {/* Order Details Component */}
      <OrderDetails
        order={order}
        onMarkPickedUp={handleMarkPickedUp}
      />
    </div>
  )
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
            <MaterialIcon name="refresh" className="text-on-primary-container animate-spin" />
          </div>
          <p className="text-secondary">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  )
}
