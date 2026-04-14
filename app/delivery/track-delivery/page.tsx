'use client'

import { DeliveryRouteLeafletMap, type DeliveryRouteMapStop } from '@/components/delivery/DeliveryRouteLeafletMap'
import { MaterialIcon } from '@/components/MaterialIcon'

// Mock data for the delivery
const deliveryStops: DeliveryRouteMapStop[] = [
  { sequence: 1, lat: 52.2053, lng: 0.1218 },
  { sequence: 2, lat: 52.2063, lng: 0.1228 },
]

const routeSignature = "priority-batch-292"

export default function TrackDeliveryPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-surface">
      {/* Map Background */}
      <div className="absolute inset-0">
        <DeliveryRouteLeafletMap
          stops={deliveryStops}
          routeSignature={routeSignature}
          className="h-full w-full"
        />
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <MaterialIcon name="menu" className="text-on-surface text-xl" />
          </button>
          <span className="text-[#bc000a] font-bold text-lg">Namaste Cam</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <MaterialIcon name="man" className="text-on-surface text-xl" />
        </div>
      </div>

      {/* Map Control Buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
        <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
          <MaterialIcon name="my_location" className="text-on-surface text-xl" />
        </button>
        <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
          <MaterialIcon name="layers" className="text-on-surface text-xl" />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-2xl">
        <div className="p-6 space-y-4">
          {/* Header with Priority Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#bc000a] text-white text-sm font-bold">
              PRIORITY BATCH #292
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-on-surface">12:45</div>
              <div className="text-sm text-secondary">EST ARRIVAL</div>
            </div>
          </div>

          {/* Restaurant Information */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-on-surface">The Gilded Fork</h3>
            <div className="flex items-center gap-2 text-secondary">
              <MaterialIcon name="location_on" className="text-lg" />
              <span className="text-sm">12 Station Rd, Cambridge CB12RE</span>
            </div>
          </div>

          {/* Delivery Progress */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#bc000a] text-white flex items-center justify-center font-bold text-lg shadow-lg">
              2
            </div>
            <div className="flex-1">
              <div className="font-semibold text-on-surface">Delivering to Sarah K.</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-[#bc000a] rounded-full"></div>
                </div>
                <span className="text-sm text-secondary font-medium">0.8 mi</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full py-4 bg-gradient-to-r from-[#bc000a] to-[#e2241f] text-white font-bold rounded-full flex items-center justify-center gap-3 shadow-lg">
              <MaterialIcon name="map" className="text-xl" />
              Open in Google Maps
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 bg-white border border-gray-300 text-on-surface-variant font-semibold rounded-full flex items-center justify-center gap-2 shadow-sm">
                <MaterialIcon name="phone" className="text-lg" />
                Call Customer
              </button>
              <button className="py-3 bg-white border border-gray-300 text-on-surface-variant font-semibold rounded-full flex items-center justify-center gap-2 shadow-sm">
                <MaterialIcon name="phone" className="text-lg" />
                Call Vendor
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <MaterialIcon name="shopping_bag" className="text-on-surface text-xl" />
              </div>
              <div>
                <div className="font-semibold text-on-surface">3 Items + £84.20</div>
                <div className="text-sm text-secondary">Spicy Lobster, 2x Truffle Pasta</div>
              </div>
            </div>
            <button className="text-primary font-semibold text-sm">
              DETAILS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
