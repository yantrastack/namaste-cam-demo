'use client'

interface OrderItemProps {
  name: string
  quantity: number
  price: number
}

export function OrderItem({ name, quantity, price }: OrderItemProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-outline-variant/20 last:border-b-0">
      <div className="flex-1">
        <h4 className="font-headline font-medium text-on-surface">
          {name}
        </h4>
        <p className="text-sm text-secondary">Quantity: {quantity}</p>
      </div>
      <div className="text-right">
        <p className="font-headline font-bold text-on-surface">
          ${(price * quantity).toFixed(2)}
        </p>
        <p className="text-xs text-secondary">${price.toFixed(2)} each</p>
      </div>
    </div>
  )
}
