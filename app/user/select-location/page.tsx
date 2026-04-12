'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'
import { useToast } from '@/components/ui/Toast'
import { MaterialIcon } from '@/components/MaterialIcon'

interface Location {
  id: string
  name: string
  icon: string
  type: 'collection_delivery' | 'delivery_only'
  description?: string
  warning?: string
  badge?: string
}

const locations: Location[] = [
  {
    id: 'cambridge',
    name: 'Cambridge',
    icon: 'location_city',
    type: 'collection_delivery',
    description: 'If you are unsure or your area is not listed, please choose Cambridge (our base location).',
    badge: 'Collection & Delivery'
  },
  {
    id: 'peterborough',
    name: 'Peterborough',
    icon: 'delivery_dining',
    type: 'delivery_only',
    warning: 'Limited menu after 5pm. Order by 5pm for the full menu.',
    badge: 'Delivery Only'
  },
  {
    id: 'hertfordshire',
    name: 'Hertfordshire and Luton',
    icon: 'map',
    type: 'delivery_only',
    description: 'Includes: Luton, Royston, Hitchin, Stevenage, Letchworth, Baldock and nearby towns.',
    warning: 'Limited menu after 5pm. Order by 5pm for the full menu.',
    badge: 'Delivery Only'
  }
]

export default function SelectLocationPage() {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  const { showToast } = useToast()
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLocationSelect = async (locationId: string) => {
    setSelectedLocation(locationId)
    setIsLoading(true)
    
    // Simulate API call with dummy data
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Store selected location (in real app, this would go to localStorage/state)
    console.log('Selected location:', locationId)
    
    router.push('/user/home')
    setIsLoading(false)
  }

  const handleBack = () => {
    router.back()
  }

  const handleContactSupport = () => {
    showToast('Contact support initiated (Demo mode)', 'info')
  }

  const handleBottomNav = (route: string) => {
    if (route === 'menu') {
      showToast('Menu navigation (Demo mode)', 'info')
    } else if (route === 'orders') {
      router.push('/user/orders')
    } else if (route === 'offers') {
      showToast('Offers navigation (Demo mode)', 'info')
    } else if (route === 'profile') {
      router.push('/user/profile')
    }
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pattern-bg pointer-events-none z-0" />
      <div className="fixed top-1/2 -right-24 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 -left-24 w-64 h-64 bg-tertiary-fixed/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm shadow-black/5 flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="hover:bg-surface-container transition-colors active:scale-95 duration-200 p-2 rounded-full"
          >
            <MaterialIcon icon="arrow_back" className="text-primary" />
          </button>
          <h1 className="font-headline font-bold tracking-tight text-xl text-primary">
            Select Location
          </h1>
        </div>
        <button
          onClick={() => router.push('/user/profile')}
          className="hover:bg-surface-container transition-colors active:scale-95 duration-200 p-2 rounded-full"
        >
          <MaterialIcon icon="account_circle" className="text-secondary" />
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 md:px-6 max-w-2xl mx-auto relative min-h-screen">
        {/* Hero Content */}
        <section className="relative z-10 mb-10">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-3 block">
            Welcome to Namaste Cambridge
          </span>
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-background leading-tight">
            Where are you <br />ordering from?
          </h2>
          <p className="text-secondary mt-4 text-base md:text-lg font-medium">
            Select your nearest region to view the local menu and delivery options.
          </p>
        </section>

        {/* Location Cards Grid */}
        <div className="grid gap-6 relative z-10">
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLocationSelect(location.id)}
              disabled={isLoading}
              className={`group w-full text-left bg-surface-container-lowest p-6 rounded-2xl shadow-lg hover:bg-surface-container-low transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedLocation === location.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-2xl transition-colors ${
                    location.type === 'collection_delivery'
                      ? 'bg-primary/5 group-hover:bg-primary/10'
                      : 'bg-secondary-container/30 group-hover:bg-secondary-container/50'
                  }`}
                >
                  <MaterialIcon
                    icon={location.icon}
                    className={`text-3xl ${
                      location.type === 'collection_delivery' ? 'text-primary' : 'text-secondary'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    location.type === 'collection_delivery'
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-highest text-secondary border border-outline-variant/20'
                  }`}
                >
                  {location.badge}
                </span>
              </div>

              <h3 className="font-headline text-xl md:text-2xl font-bold text-on-background mb-2">
                {location.name}
              </h3>

              {location.description && (
                <p className="text-secondary text-sm leading-relaxed mb-4">
                  {location.description}
                </p>
              )}

              {location.warning && (
                <div className="bg-tertiary-fixed/40 p-3 rounded-xl mb-4 flex gap-3 items-start">
                  <MaterialIcon
                    icon="schedule"
                    className="text-on-tertiary-fixed-variant text-lg mt-0.5"
                  />
                  <p className="text-on-tertiary-fixed-variant text-xs font-semibold leading-normal">
                    {location.warning}
                  </p>
                </div>
              )}

              <div className="flex items-center text-primary font-bold text-sm">
                <span>{isLoading && selectedLocation === location.id ? 'Loading...' : 'Explore Menu'}</span>
                <MaterialIcon
                  icon="chevron_right"
                  className="ml-2 text-lg group-hover:translate-x-1 transition-transform"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Help Section */}
        <section className="mt-12 text-center relative z-10 px-4">
          <p className="text-secondary text-sm mb-4 font-medium">Don't see your location?</p>
          <button
            onClick={handleContactSupport}
            className="inline-flex items-center gap-2 text-primary font-bold px-6 py-3 rounded-full hover:bg-primary/5 transition-colors active:scale-95"
          >
            <MaterialIcon icon="contact_support" />
            <span>Contact Support</span>
          </button>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest/80 backdrop-blur-xl z-50 rounded-t-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
        <button
          onClick={() => handleBottomNav('menu')}
          className="flex flex-col items-center justify-center text-secondary px-4 py-2 hover:text-primary active:scale-90 duration-300 ease-out transition-colors"
        >
          <MaterialIcon icon="restaurant_menu" className="mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Menu</span>
        </button>
        <button
          onClick={() => handleBottomNav('orders')}
          className="flex flex-col items-center justify-center text-secondary px-4 py-2 hover:text-primary active:scale-90 duration-300 ease-out transition-colors"
        >
          <MaterialIcon icon="receipt_long" className="mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Orders</span>
        </button>
        <button
          onClick={() => handleBottomNav('offers')}
          className="flex flex-col items-center justify-center text-secondary px-4 py-2 hover:text-primary active:scale-90 duration-300 ease-out transition-colors"
        >
          <MaterialIcon icon="local_offer" className="mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Offers</span>
        </button>
        <button
          onClick={() => handleBottomNav('profile')}
          className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-2xl px-4 py-2 active:scale-90 duration-300 ease-out transition-colors"
        >
          <MaterialIcon icon="person" className="mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Profile</span>
        </button>
      </nav>

      <style jsx>{`
        .pattern-bg {
          background-color: transparent;
          background-image: radial-gradient(var(--color-primary) 0.5px, transparent 0.5px),
            radial-gradient(var(--color-primary) 0.5px, #ffffff 0.5px);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
          opacity: 0.03;
        }
      `}</style>
    </div>
  )
}
