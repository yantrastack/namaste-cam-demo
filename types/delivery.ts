export interface Order {
  id: string
  restaurant: string
  pickupAddress: string
  deliveryAddress: string
  customerName?: string
  tag: 'Priority' | 'Standard' | 'Elite'
  estimatedTime: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  paymentStatus: string
  totalAmount: number
  status?: string
  earnings?: string
  distance?: string
}
