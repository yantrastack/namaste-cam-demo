'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MaterialIcon } from '@/components/MaterialIcon'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'
import { useToast } from '@/components/ui/Toast'

export default function SubscriptionDetailsPage() {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  const { showToast } = useToast()

  const handlePauseSubscription = () => {
    showToast('Pause subscription functionality coming soon!', 'info')
  }

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      showToast('Subscription cancelled successfully!', 'success')
      router.push('/user/home')
    }
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-32 md:pb-8">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-zinc-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <MaterialIcon name="arrow_back" className="text-2xl" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-lg sm:text-xl text-primary">
              Namaste Cam
            </h1>
          </div>
          <button
            onClick={() => router.push('/user/profile')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-zinc-500 hover:text-primary transition-colors"
          >
            <MaterialIcon name="person" className="text-xl" />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-8 max-w-md mx-auto px-4 sm:px-6">
        {/* Subscription Details Header */}
        <section className="mb-6">
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">
            Subscription Details
          </h2>
          <p className="text-secondary text-sm mb-3">
            Royal Mughal Feast • Weekly Plan
          </p>
          <span className="inline-block px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-full uppercase tracking-wider">
            ACUVA
          </span>
        </section>

        {/* Delivery Info Cards */}
        <section className="mb-6 space-y-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                <MaterialIcon name="calendar_today" className="text-lg text-on-primary-container" />
              </div>
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider">Next Delivery</p>
                <p className="font-semibold text-on-surface">Monday, Oct 23</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                <MaterialIcon name="schedule" className="text-lg text-on-secondary-container" />
              </div>
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider">Timing</p>
                <p className="font-semibold text-on-surface">12:30 PM Slot</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Included in your box */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Included in your box</h3>
          <Card className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 mt-1">
                <MaterialIcon name="rice_bowl" className="text-sm text-secondary" />
              </div>
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">Rice Base</p>
                <p className="font-medium text-on-surface">Saffron-Infused Basmati</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 mt-1">
                <MaterialIcon name="restaurant" className="text-sm text-secondary" />
              </div>
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">Chef's Curries</p>
                <p className="font-medium text-on-surface">Smoked Butter Chicken & Dal Makhani</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 mt-1">
                <MaterialIcon name="bakery_dining" className="text-sm text-secondary" />
              </div>
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">Daily Add-on</p>
                <p className="font-medium text-on-surface">Garlic Butter Naan (2pc)</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Delivery Note */}
        <section className="mb-6">
          <Card className="p-4 bg-surface-container-low">
            <p className="text-sm text-on-surface-variant">
              "Delivering Monday - Friday, 12:30 PM to your workspace."
            </p>
          </Card>
        </section>

        {/* Plan Info */}
        <section className="mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">Plan Duration</p>
                <p className="font-semibold text-on-surface">30 Days (22 Deliveries)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-headline font-bold text-primary">$249.00</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Action Buttons */}
        <section className="mb-6 space-y-3">
          <Button
            onClick={handlePauseSubscription}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Pause Subscription
          </Button>
          <Button
            onClick={handleCancelSubscription}
            variant="danger"
            size="lg"
            className="w-full"
          >
            Cancel Subscription
          </Button>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-lg border-t border-outline-variant/10">
        <div className="flex items-center justify-around py-3 max-w-md mx-auto">
          <button
            onClick={() => router.push('/user/home')}
            className="flex flex-col items-center gap-1 px-4 py-2 text-secondary hover:text-primary transition-colors"
          >
            <MaterialIcon name="explore" className="text-2xl" />
            <span className="text-xs font-medium">Discover</span>
          </button>
          <button
            onClick={() => router.push('/user/craft-plan')}
            className="flex flex-col items-center gap-1 px-4 py-2 text-primary"
          >
            <MaterialIcon name="restaurant_menu" className="text-2xl" />
            <span className="text-xs font-medium">Plans</span>
          </button>
          <button
            onClick={() => router.push('/user/orders')}
            className="flex flex-col items-center gap-1 px-4 py-2 text-secondary hover:text-primary transition-colors"
          >
            <MaterialIcon name="receipt_long" className="text-2xl" />
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button
            onClick={() => router.push('/user/profile')}
            className="flex flex-col items-center gap-1 px-4 py-2 text-secondary hover:text-primary transition-colors"
          >
            <MaterialIcon name="person" className="text-2xl" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
