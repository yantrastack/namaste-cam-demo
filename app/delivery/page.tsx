'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { MaterialIcon } from '@/components/MaterialIcon'

export default function DeliveryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-tertiary-fixed/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md space-y-12">
        {/* Brand Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-3xl mb-2">
            <MaterialIcon name="delivery_dining" className="text-on-primary-container text-3xl" />
          </div>
          <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-primary">
            Namaste Cam
          </h1>
          <p className="text-secondary font-medium tracking-tight">
            Delivery Partner Portal
          </p>
        </header>

        {/* Main Content */}
        <main className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl space-y-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="space-y-6 text-center">
            <h2 className="font-headline font-bold text-2xl text-on-surface">
              Welcome Delivery Partner
            </h2>
            <p className="text-secondary">
              Access your delivery dashboard and manage your orders
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/delivery/login')}
              className="w-full py-4 bg-gradient-to-r from-[#bc000a] to-[#e2241f] text-on-primary font-headline font-bold rounded-full active:scale-95 transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
              style={{ boxShadow: '0 8px 24px rgba(25, 28, 29, 0.04)' }}
            >
              <MaterialIcon name="login" className="text-xl" />
              Sign In
            </button>

            <button
              onClick={() => router.push('/delivery/register')}
              className="w-full py-4 bg-surface-container-high text-on-surface-variant font-headline font-bold rounded-full active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <MaterialIcon name="person_add" className="text-xl" />
              Create Account
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
