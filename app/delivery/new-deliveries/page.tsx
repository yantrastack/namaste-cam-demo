'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'

interface CurrentOrder {
  id: string
  restaurant: string
  customerName: string
  customerAddress: string
  estimatedTime: string
  status: 'assigned' | 'picked' | 'out_for_delivery' | 'delivered'
  earnings: string
  distance: string
}

const dummyCurrentOrder: CurrentOrder = {
  id: 'ORD-88219',
  restaurant: 'The Gilded Fork',
  customerName: 'Sarah Johnson',
  customerAddress: '123 Cambridge Street, Apt 4B',
  estimatedTime: '15-20 min',
  status: 'out_for_delivery',
  earnings: '£12.50',
  distance: '2.3 km'
}

const deliverySteps = [
  { id: 'assigned', label: 'Assigned', icon: 'assignment_turned_in' },
  { id: 'picked', label: 'Picked', icon: 'shopping_bag' },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: 'delivery_dining' },
  { id: 'delivered', label: 'Delivered', icon: 'check_circle' }
]

export default function NewDeliveriesPage() {
  const router = useRouter()
  const [currentOrder, setCurrentOrder] = useState<CurrentOrder>(dummyCurrentOrder)

  const handleMenuClick = () => {
    console.log('Menu clicked')
  }

  const handleProfileClick = () => {
    router.push('/delivery/profile')
  }

  const handleBottomNavClick = (section: string) => {
    switch(section) {
      case 'orders':
        // Already on orders page
        break
      case 'earnings':
        router.push('/delivery/earnings')
        break
      case 'alerts':
        router.push('/delivery/alerts')
        break
      case 'profile':
        router.push('/delivery/profile')
        break
    }
  }

  const handleMarkDelivered = () => {
    setCurrentOrder(prev => ({ ...prev, status: 'delivered' }))
    // In a real app, this would update the backend
    setTimeout(() => {
      alert('Order marked as delivered! ✓')
    }, 500)
  }

  const getStepStatus = (stepId: string) => {
    const currentIndex = deliverySteps.findIndex(step => step.id === currentOrder.status)
    const stepIndex = deliverySteps.findIndex(step => step.id === stepId)
    
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleMenuClick} className="w-8 h-8 flex items-center justify-center">
              <MaterialIcon name="menu" className="text-black text-xl" />
            </button>
            <h1 className="font-bold text-lg text-black">
              Namaste Cam
            </h1>
          </div>
          <button onClick={handleProfileClick} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gray-400"></div>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-6">
        <h2 className="font-bold text-3xl text-black mb-2">Orders</h2>
        <p className="text-gray-600">
          Track your current delivery progress
        </p>
      </div>

      {/* Map Section */}
      <div className="px-4 mb-6">
        <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
          <div className="relative text-center">
            <MaterialIcon name="map" className="text-4xl text-gray-600 mb-2" />
            <p className="text-gray-600 font-medium">Map View</p>
            <p className="text-gray-500 text-sm">Delivery route to customer</p>
          </div>
        </div>
      </div>

      {/* Current Order Card */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-gray-500 text-xs uppercase font-medium mb-1">CURRENT ORDER</h3>
              <p className="font-bold text-xl text-black">{currentOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Est. Time</p>
              <p className="font-bold text-black">{currentOrder.estimatedTime}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <MaterialIcon name="restaurant" className="text-red-600 text-sm" />
              </div>
              <div>
                <p className="font-medium text-black">{currentOrder.restaurant}</p>
                <p className="text-sm text-gray-600">Restaurant</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <MaterialIcon name="person" className="text-blue-600 text-sm" />
              </div>
              <div>
                <p className="font-medium text-black">{currentOrder.customerName}</p>
                <p className="text-sm text-gray-600">{currentOrder.customerAddress}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-600">Earnings</p>
              <p className="font-bold text-green-600">{currentOrder.earnings}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-600">Distance</p>
              <p className="font-bold text-black">{currentOrder.distance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Progress Steps */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg text-black mb-4">Delivery Progress</h3>
          
          <div className="space-y-4">
            {deliverySteps.map((step, index) => {
              const status = getStepStatus(step.id)
              const isActive = status === 'active'
              const isCompleted = status === 'completed'
              
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' : 
                    isActive ? 'bg-red-500' : 
                    'bg-gray-300'
                  }`}>
                    <MaterialIcon 
                      name={step.icon} 
                      className="text-white text-sm" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      isCompleted ? 'text-green-600' : 
                      isActive ? 'text-red-600' : 
                      'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {isCompleted && (
                    <MaterialIcon name="check" className="text-green-500" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mark Delivered Button */}
      <div className="px-4 pb-20">
        <button
          onClick={handleMarkDelivered}
          disabled={currentOrder.status === 'delivered'}
          className={`w-full py-4 font-bold rounded-full flex items-center justify-center gap-3 shadow-lg ${
            currentOrder.status === 'delivered' 
              ? 'bg-gray-300 text-gray-500' 
              : 'bg-gradient-to-r from-[#bc000a] to-[#e2241f] text-white'
          }`}
          style={{ boxShadow: '0 8px 24px rgba(25, 28, 29, 0.04)' }}
        >
          <MaterialIcon name="check_circle" className="text-xl" />
          {currentOrder.status === 'delivered' ? 'Order Delivered ✓' : 'Mark Delivered'}
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <button onClick={() => handleBottomNavClick('orders')} className="flex flex-col items-center gap-1 p-2">
            <MaterialIcon name="list" className="text-red-500 text-xl" />
            <span className="text-xs font-medium text-red-500">ORDERS</span>
          </button>
          <button onClick={() => handleBottomNavClick('earnings')} className="flex flex-col items-center gap-1 p-2">
            <MaterialIcon name="payments" className="text-gray-400 text-xl" />
            <span className="text-xs font-medium text-gray-400">EARNINGS</span>
          </button>
          <button onClick={() => handleBottomNavClick('alerts')} className="flex flex-col items-center gap-1 p-2">
            <MaterialIcon name="notifications" className="text-gray-400 text-xl" />
            <span className="text-xs font-medium text-gray-400">ALERTS</span>
          </button>
          <button onClick={() => handleBottomNavClick('profile')} className="flex flex-col items-center gap-1 p-2">
            <MaterialIcon name="person" className="text-gray-400 text-xl" />
            <span className="text-xs font-medium text-gray-400">PROFILE</span>
          </button>
        </div>
      </div>
    </div>
  )
}
