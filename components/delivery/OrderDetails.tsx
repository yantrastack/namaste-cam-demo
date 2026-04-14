'use client'

import { MaterialIcon } from '@/components/MaterialIcon'
import { Order } from '@/types/delivery'

interface OrderDetailsProps {
  order: Order
  onMarkPickedUp: () => void
}

export function OrderDetails({ order, onMarkPickedUp }: OrderDetailsProps) {
  const getItemDescription = (itemName: string) => {
    const descriptions: { [key: string]: string } = {
      "Chicken Biryani": "Extra Fluffy, Medium Spice",
      "Butter Chicken": "Classic Creamy Curry", 
      "Paneer Tikka": "Mild Chutney, Grilled Onion",
      "Salmon Roll": "Fresh Salmon, Wasabi",
      "Miso Soup": "Traditional Japanese",
      "Ribeye Steak": "Grilled to Perfection",
      "Caesar Salad": "Fresh Crispy Lettuce"
    }
    return descriptions[itemName] || "Special Item"
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Order Header */}
      <div className="bg-white px-4 py-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-bold text-2xl text-black">
            #{order.id}
          </h1>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
            IN PROGRESS
          </span>
        </div>
      </div>

      {/* PICKUP LOCATION Section */}
      <div className="px-4 py-3">
        <div className="bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm">
          <h3 className="font-bold text-lg text-black mb-3">
            Pickup Location
          </h3>
          
          <div className="space-y-3">
            <p className="font-bold text-lg text-black">{order.restaurant}</p>
            <p className="text-sm text-gray-600">{order.pickupAddress}</p>
            
            <button className="flex items-center gap-2 text-red-600 text-sm font-medium">
              <MaterialIcon name="phone" className="text-sm" />
              Contact Merchant
            </button>
          </div>
        </div>
      </div>

      {/* DROP-OFF DESTINATION Section */}
      <div className="px-4 py-3">
        <div className="bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm">
          <h3 className="font-bold text-lg text-black mb-3">
            Drop-off Destination
          </h3>
          
          <div className="space-y-3">
            <p className="font-bold text-lg text-black">{order.customerName || 'Eleanor Vance'}</p>
            <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
            
            <button className="flex items-center gap-2 text-red-600 text-sm font-medium">
              <MaterialIcon name="phone" className="text-sm" />
              Contact Customer
            </button>
          </div>
        </div>
      </div>

      {/* ORDER MANIFEST Section */}
      <div className="px-4 py-3">
        <div className="bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-black">
              Order Manifest
            </h3>
            <span className="text-sm text-gray-600 font-medium">
              {order.items.length} ITEMS TOTAL
            </span>
          </div>
          
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium">
                      {item.quantity}x {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getItemDescription(item.name)}
                    </p>
                  </div>
                  <span className="text-sm text-black font-medium">
                    £{item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAYMENT STATUS Section */}
      <div className="px-4 py-3">
        <div className="bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <MaterialIcon name="check" className="text-white text-sm" />
              </div>
              <div>
                <p className="font-bold text-black">PAID</p>
                <p className="text-sm text-gray-600">Digital Wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
        <div className="flex gap-3 mb-3">
          <button className="flex-1 py-3 bg-gray-100 rounded-full flex items-center justify-center gap-2">
            <MaterialIcon name="store" className="text-lg text-gray-600" />
            <span className="text-sm font-medium text-gray-600">RESTAURANT</span>
          </button>
          
          <button className="flex-1 py-3 bg-gray-100 rounded-full flex items-center justify-center gap-2">
            <MaterialIcon name="location_on" className="text-lg text-gray-600" />
            <span className="text-sm font-medium text-gray-600">CUSTOMER</span>
          </button>
        </div>
        
        <button
          onClick={onMarkPickedUp}
          className="w-full py-4 bg-red-600 text-white rounded-full flex items-center justify-center gap-3 font-bold"
        >
          <MaterialIcon name="shopping_basket" className="text-xl" />
          MARK PICKED UP
        </button>
      </div>
    </div>
  )
}
