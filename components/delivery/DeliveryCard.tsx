'use client'

import { MaterialIcon } from '@/components/MaterialIcon'
import { Order } from '@/types/delivery'

interface DeliveryCardProps {
  order: Order
  onAccept: () => void
  onReject: () => void
}

export function DeliveryCard({ order, onAccept, onReject }: DeliveryCardProps) {
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Priority':
        return 'bg-error-container text-on-error-container'
      case 'Elite':
        return 'bg-tertiary-container text-on-tertiary-container'
      default:
        return 'bg-secondary-container text-on-secondary-container'
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-headline font-bold text-lg text-on-surface">
            Order #{order.id}
          </h3>
          <p className="text-secondary text-sm font-medium">{order.restaurant}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTagColor(order.tag)}`}>
          {order.tag}
        </span>
      </div>

      {/* Addresses */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 mt-0.5">
            <MaterialIcon name="location_on" className="text-on-primary-container text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Pickup</p>
            <p className="text-sm text-on-surface">{order.pickupAddress}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center flex-shrink-0 mt-0.5">
            <MaterialIcon name="flag" className="text-on-tertiary-container text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Delivery</p>
            <p className="text-sm text-on-surface">{order.deliveryAddress}</p>
          </div>
        </div>
      </div>

      {/* Time and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-secondary">
          <MaterialIcon name="schedule" className="text-sm" />
          <span className="text-sm">{order.estimatedTime}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onReject}
            className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-headline font-bold text-sm active:scale-95 transition-all"
          >
            Reject
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#bc000a] to-[#e2241f] text-on-primary font-headline font-bold text-sm shadow-md active:scale-95 transition-all"
            style={{ boxShadow: '0 4px 12px rgba(188, 0, 10, 0.3)' }}
          >
            Accept Order
          </button>
        </div>
      </div>
    </div>
  )
}
