'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'

interface Payment {
  id: string
  date: string
  orderNumber: string
  amount: number
  status: 'completed' | 'pending'
}

interface EarningsData {
  availableBalance: number
  weeklyEarnings: number
  completedJobs: number
  cashAmount: number
  recentPayments: Payment[]
}

const dummyEarnings: EarningsData = {
  availableBalance: 245.80,
  weeklyEarnings: 412.50,
  completedJobs: 28,
  cashAmount: 45.00,
  recentPayments: [
    {
      id: '1',
      date: 'Today, 2:30 PM',
      orderNumber: '#ORD-88219',
      amount: 12.50,
      status: 'completed'
    },
    {
      id: '2',
      date: 'Today, 11:45 AM',
      orderNumber: '#ORD-88218',
      amount: 8.00,
      status: 'completed'
    },
    {
      id: '3',
      date: 'Yesterday, 6:20 PM',
      orderNumber: '#ORD-88217',
      amount: 15.75,
      status: 'completed'
    },
    {
      id: '4',
      date: 'Yesterday, 3:15 PM',
      orderNumber: '#ORD-88216',
      amount: 10.25,
      status: 'completed'
    },
    {
      id: '5',
      date: '2 days ago',
      orderNumber: '#ORD-88215',
      amount: 18.00,
      status: 'pending'
    }
  ]
}

export default function EarningsPage() {
  const router = useRouter()
  const [earnings, setEarnings] = useState<EarningsData>(dummyEarnings)

  const handleBottomNavClick = (section: string) => {
    switch(section) {
      case 'orders':
        router.push('/delivery/new-deliveries')
        break
      case 'earnings':
        // Already on earnings page
        break
      case 'alerts':
        router.push('/delivery/alerts')
        break
      case 'profile':
        router.push('/delivery/profile')
        break
    }
  }

  const handleWithdraw = () => {
    // Handle withdrawal logic
    console.log('Withdraw clicked')
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

      {/* Header */}
      <div className="px-4 py-6">
        <h2 className="font-bold text-3xl text-black mb-2">Earnings</h2>
        <p className="text-gray-600">
          Track your delivery earnings and payments
        </p>
      </div>

      {/* Earnings Overview Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Available Balance */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MaterialIcon name="account_balance_wallet" className="text-green-600 text-xl" />
              <span className="text-gray-600 text-sm">Available Balance</span>
            </div>
            <p className="font-bold text-2xl text-black">£{earnings.availableBalance.toFixed(2)}</p>
            <button
              onClick={handleWithdraw}
              className="mt-2 w-full py-2 bg-green-600 text-white text-sm font-semibold rounded-lg"
            >
              Withdraw
            </button>
          </div>

          {/* Cash Amount */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MaterialIcon name="payments" className="text-blue-600 text-xl" />
              <span className="text-gray-600 text-sm">Cash Amount</span>
            </div>
            <p className="font-bold text-2xl text-black">£{earnings.cashAmount.toFixed(2)}</p>
            <p className="text-gray-500 text-xs mt-2">From cash orders</p>
          </div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg text-black mb-4">This Week</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
              <p className="font-bold text-xl text-black">£{earnings.weeklyEarnings.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Completed Jobs</p>
              <p className="font-bold text-xl text-black">{earnings.completedJobs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="px-4 pb-20">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg text-black mb-4">Recent Payments</h3>
          
          <div className="space-y-3">
            {earnings.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-black">{payment.orderNumber}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">+£{payment.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
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
            <MaterialIcon name="payments" className="text-red-500 text-xl" />
            <span className="text-xs font-medium text-red-500">EARNINGS</span>
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
            <MaterialIcon name="person" className="text-gray-400 text-xl" />
            <span className="text-xs font-medium text-gray-400">PROFILE</span>
          </button>
        </div>
      </div>
    </div>
  )
}
