'use client'

import { DeliveryCard } from './DeliveryCard'
import { MaterialIcon } from '@/components/MaterialIcon'
import { Order } from '@/types/delivery'

interface DeliveryListProps {
  orders: Order[]
  onAcceptOrder: (order: Order) => void
  onRejectOrder: (orderId: string) => void
}

export function DeliveryList({ orders, onAcceptOrder, onRejectOrder }: DeliveryListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
          <MaterialIcon name="inventory_2" className="text-on-surface-variant text-2xl" />
        </div>
        <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
          No New Deliveries
        </h3>
        <p className="text-secondary text-center px-8">
          All available orders have been assigned. Check back soon for new deliveries.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-20">
      <div className="mb-6">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">
          New Deliveries
        </h2>
        <p className="text-secondary">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} available for pickup
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <DeliveryCard
            key={order.id}
            order={order}
            onAccept={() => onAcceptOrder(order)}
            onReject={() => onRejectOrder(order.id)}
          />
        ))}
      </div>
    </div>
  )
}
