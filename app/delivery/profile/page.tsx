'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'

interface ProfileData {
  name: string
  id: string
  avatar: string
  isOnDuty: boolean
  stats: {
    todayTime: string
    todayDistance: string
    weekTime: string
    weekDistance: string
  }
  vehicle: {
    type: string
    model: string
    plate: string
  }
  performance: {
    rating: number
    deliveries: number
    onTime: string
  }
}

const dummyProfile: ProfileData = {
  name: 'John Smith',
  id: 'DP-2847',
  avatar: '',
  isOnDuty: true,
  stats: {
    todayTime: '6h 24m',
    todayDistance: '42.5 km',
    weekTime: '38h 15m',
    weekDistance: '285.3 km'
  },
  vehicle: {
    type: 'Bicycle',
    model: 'Trek FX 3',
    plate: 'BS-2847'
  },
  performance: {
    rating: 4.8,
    deliveries: 156,
    onTime: '96%'
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData>(dummyProfile)

  const handleDutyToggle = () => {
    setProfile(prev => ({ ...prev, isOnDuty: !prev.isOnDuty }))
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
        router.push('/delivery/alerts')
        break
      case 'profile':
        // Already on profile page
        break
    }
  }

  const handleLogout = () => {
    router.push('/delivery/login')
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
          <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gray-400"></div>
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 py-6 pb-20">
        {/* User Info Section */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-xl text-black">{profile.name}</h2>
              <p className="text-gray-600 text-sm">ID: {profile.id}</p>
            </div>
          </div>

          {/* Duty Status Toggle */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-black">Duty Status</h3>
              <p className="text-gray-600 text-sm">
                {profile.isOnDuty ? 'Currently on duty' : 'Currently off duty'}
              </p>
            </div>
            <button
              onClick={handleDutyToggle}
              className={`w-14 h-8 rounded-full transition-colors ${
                profile.isOnDuty ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                profile.isOnDuty ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <h3 className="font-bold text-lg text-black mb-4">Statistics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Today</p>
              <p className="font-bold text-black">{profile.stats.todayTime}</p>
              <p className="text-gray-500 text-sm">{profile.stats.todayDistance}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">This Week</p>
              <p className="font-bold text-black">{profile.stats.weekTime}</p>
              <p className="text-gray-500 text-sm">{profile.stats.weekDistance}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <h3 className="font-bold text-lg text-black mb-4">Vehicle Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-medium text-black">{profile.vehicle.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Model</span>
              <span className="font-medium text-black">{profile.vehicle.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plate Number</span>
              <span className="font-medium text-black">{profile.vehicle.plate}</span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <h3 className="font-bold text-lg text-black mb-4">Performance</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Rating</span>
              <div className="flex items-center gap-1">
                <MaterialIcon name="star" className="text-yellow-500 text-sm" />
                <span className="font-medium text-black">{profile.performance.rating}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Deliveries</span>
              <span className="font-medium text-black">{profile.performance.deliveries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">On-time Rate</span>
              <span className="font-medium text-black">{profile.performance.onTime}</span>
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <h3 className="font-bold text-lg text-black mb-4">Support</h3>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MaterialIcon name="help" className="text-gray-600 text-xl" />
                <span className="font-medium text-black">Help Center</span>
              </div>
              <MaterialIcon name="chevron_right" className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MaterialIcon name="phone" className="text-gray-600 text-xl" />
                <span className="font-medium text-black">Contact Support</span>
              </div>
              <MaterialIcon name="chevron_right" className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MaterialIcon name="description" className="text-gray-600 text-xl" />
                <span className="font-medium text-black">Terms & Conditions</span>
              </div>
              <MaterialIcon name="chevron_right" className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg"
        >
          Logout
        </button>
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
            <MaterialIcon name="notifications" className="text-gray-400 text-xl" />
            <span className="text-xs font-medium text-gray-400">ALERTS</span>
          </button>
          <button 
            onClick={() => handleBottomNavClick('profile')} 
            className="flex flex-col items-center gap-1 p-2"
          >
            <MaterialIcon name="person" className="text-red-500 text-xl" />
            <span className="text-xs font-medium text-red-500">PROFILE</span>
          </button>
        </div>
      </div>
    </div>
  )
}
