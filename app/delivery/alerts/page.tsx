'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'

interface Alert {
  id: string
  type: 'new_order' | 'status_update' | 'payment'
  title: string
  message: string
  time: string
  action?: string
}

const dummyAlerts: Alert[] = [
  {
    id: '1',
    type: 'new_order',
    title: 'New Order Available',
    message: 'Order #ORD-88220 from The Gilded Fork - £12.50 earnings',
    time: '2 min ago',
    action: 'Accept Delivery'
  },
  {
    id: '2',
    type: 'status_update',
    title: 'Order Delivered Successfully',
    message: 'Order #ORD-88219 has been delivered to customer',
    time: '15 min ago'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    message: '£12.50 from order #ORD-88218 has been added to your balance',
    time: '1 hour ago'
  },
  {
    id: '4',
    type: 'new_order',
    title: 'New Order Available',
    message: 'Order #ORD-88221 from Sushiko Premium - £8.00 earnings',
    time: '1 hour ago',
    action: 'Accept Delivery'
  },
  {
    id: '5',
    type: 'status_update',
    title: 'Order Picked Up',
    message: 'You have picked up order #ORD-88217 from restaurant',
    time: '2 hours ago'
  }
]

export default function AlertsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>(dummyAlerts)

  const handleAcceptDelivery = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
    router.push('/delivery/new-deliveries')
  }

  const handleBottomNavClick = (section: string) => {
    switch(section) {
      case 'orders':
        router.push('/delivery/new-deliveries')
        break
      case 'earnings':
        router.push('/delivery/earnings')
        break
      case 'alerts':
        // Already on alerts page
        break
      case 'profile':
        router.push('/delivery/profile')
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center">
              <MaterialIcon name="menu" className="text-black text-xl" />
            </button>
            <h1 className="font-bold text-lg text-black">
              Namaste Cam
            </h1>
          </div>
          <div className="relative">
            <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gray-400"></div>
            </button>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-6">
        <h2 className="font-bold text-3xl text-black mb-2">Alerts</h2>
        <p className="text-gray-600">
          Stay updated with your delivery notifications
        </p>
      </div>

      {/* Alerts List */}
      <div className="px-4 pb-20">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                {/* Alert Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  alert.type === 'new_order' ? 'bg-red-100' :
                  alert.type === 'status_update' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  <MaterialIcon 
                    name={
                      alert.type === 'new_order' ? 'add_shopping_cart' :
                      alert.type === 'status_update' ? 'local_shipping' :
                      'payments'
                    } 
                    className={`text-lg ${
                      alert.type === 'new_order' ? 'text-red-600' :
                      alert.type === 'status_update' ? 'text-blue-600' :
                      'text-green-600'
                    }`}
                  />
                </div>

                {/* Alert Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-black mb-1">{alert.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                  <p className="text-gray-400 text-xs">{alert.time}</p>
                </div>
              </div>

              {/* Action Button */}
              {alert.action && (
                <button
                  onClick={() => handleAcceptDelivery(alert.id)}
                  className="w-full mt-3 py-2 bg-red-600 text-white font-semibold text-sm rounded-lg"
                >
                  {alert.action}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => handleBottomNavClick('orders')} 
            className="flex flex-col items-center gap-1 p-2"
          >
            <MaterialIcon name="list" className="text-gray-400 text-xl" />
            <span className="text-xs font-medium text-gray-400">ORDERS</span>
          </button>
          <button 
            onClick={() => handleBottomNavClick('earnings')} 
            className="flex flex-col items-center gap-1 p-2"
          >
            <MaterialIcon name="payments" className="text-gray-400 text-xl" />
            <span className="text-xs font-medium text-gray-400">EARNINGS</span>
          </button>
          <button 
            onClick={() => handleBottomNavClick('alerts')} 
            className="flex flex-col items-center gap-1 p-2"
          >
            <MaterialIcon name="notifications" className="text-red-500 text-xl" />
            <span className="text-xs font-medium text-red-500">ALERTS</span>
          </button>
          <button 
            onClick={() => handleBottomNavClick('profile')} 
            className="flex flex-col items-center gap-1 p-2"
          >
            <MaterialIcon name="person" className="text-gray-400 text-xl" />
            <span className="text-xs font-medium text-gray-400">PROFILE</span>
          </button>
        </div>
      </div>
    </div>
  )
}
