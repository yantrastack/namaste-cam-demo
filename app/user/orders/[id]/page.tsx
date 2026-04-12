'use client'

import { useRouter } from 'next/navigation'
import { use } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MaterialIcon } from '@/components/MaterialIcon'
import { Badge } from '@/components/ui/Badge'

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)

  const handleNavClick = (nav: string) => {
    if (nav === 'home') {
      router.push('/user/home')
    } else if (nav === 'menu') {
      router.push('/user/menu')
    } else if (nav === 'orders') {
      router.push('/user/orders')
    } else if (nav === 'notifications') {
      router.push('/user/notifications')
    } else if (nav === 'profile') {
      router.push('/user/profile')
    }
  }

  const orderData = {
    id: resolvedParams.id,
    estimatedDelivery: '12:45 PM',
    etaMinutes: '15-20',
    status: 'Out for Delivery',
    restaurant: 'Namaste Cambridge',
    items: ['Truffle Mushroom Risotto', 'Garlic Naan', 'Mango Lassi'],
    total: 54.20,
    address: '1042 Market St, Apt 4B',
    instructions: 'Leave at the front door',
    paymentMethod: 'Apple Pay',
  }

  const timelineSteps = [
    { status: 'Order Confirmed', time: '12:15 PM', completed: true, icon: 'check' },
    { status: 'Preparing Your Meal', time: '12:25 PM', completed: true, icon: 'check' },
    { status: 'Out for Delivery', time: '12:35 PM', completed: true, icon: 'delivery_dining', filled: true, current: true },
    { status: 'Delivered', time: '12:45 PM', completed: false, icon: 'home' },
  ]

  const deliveryPerson = {
    name: 'Aiden Marshall',
    rating: 4.9,
    deliveries: '1.2k+',
    vehicle: 'Electric Scooter',
    plateNumber: 'SF-2921',
    badge: 'Top Rated',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYkxrzH5tzODRszzjoeHvEDzOn3SdnW_xZ2zTb2XwaBUf_yA3lJ8o1A6R1TfivGWPsom44HGnGgAcKboAqt3J0ZLP1_BaW1AowX7g9DTGakixo2IhwKrsFk5BAg4Y1nCOIFCtT53PsVTBmZvQI7KBWyqzZxZ_EJovyNO3wagZqhdud0a2HxP17CmJepOGjLzRZZfZZnptzLlsHpYHc88AUbov-tVSL6ONdfQFa-S7eJqLvajUV_IuY6gg38Jvk2UfglIuANXh_wmU',
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-24 md:pb-8">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-zinc-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <MaterialIcon name="arrow_back" className="text-2xl" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-lg sm:text-xl text-on-surface">
              Order #{orderData.id}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer" onClick={() => handleNavClick('profile')}>
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9lVXcCi7qdwMMPGJtDyYgA6mgdwEucaps4IHnzLhmNncDmOIfvvt8gPJIJtCJgLWta9si_KnkmTUVM790igEC4LWofPINUXdrtdN5myxbryZ5KzoORmGYvmSWkgWY3PxWsF9ix8kZErr5caU_awABuRd5WgkUEfH9KHY0xd3oCQQPn-2pZLnq8_Oozj1dnZZa4j5rBnO0EF6J4i6Cu634VUTPesMj0lO3CIo2iCZVl1rELym3HFOkKRIRJ39GyANL0_0_dnJSeus"
            />
          </div>
        </div>
      </header>

      <main className="pt-24 px-4 sm:px-6 max-w-2xl mx-auto space-y-6 sm:space-y-8">
        {/* Animated Progress Hero */}
        <section className="relative overflow-hidden bg-primary-container rounded-xl p-6 sm:p-8 text-on-primary-container shadow-lg">
          <div className="relative z-10">
            <span className="text-white/80 font-medium tracking-wider text-[10px] sm:text-xs uppercase">Est. Delivery</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl sm:text-4xl font-headline font-extrabold">{orderData.estimatedDelivery}</h2>
            </div>
            <p className="mt-4 text-xs sm:text-sm font-medium opacity-90 flex items-center gap-2">
              <MaterialIcon name="timer" className="text-[16px] sm:text-[18px]" />
              Arriving in approximately {orderData.etaMinutes} mins
            </p>
          </div>
          {/* Decorative circle */}
          <div className="absolute -right-12 -top-12 w-40 sm:w-48 h-40 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        {/* Live Map Section */}
        <section className="h-56 sm:h-64 w-full rounded-xl overflow-hidden relative shadow-sm bg-surface-container-low">
          <img
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
            alt="Map showing delivery route"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVl9uvI46FqhyhoB_tyIPEFFemLmI_u1SYBtdIft0nHOhcgGT0aM15I6JleWQdFVl38ZjEK0fDGLb31LM4JMjQELmsEars13VZ4hb3H5F2NEBXaS_iNGqnM6HfeJ9rWYR77Zw9NROcuhgLApiIK9L4Gspgvw1hs5IszSvF8qXXwDbkbShnELh_CJ2XwaNL2wMnGMfNYFr0vC21j55AsMwAP1uGN4pXxN_xlB4BbSERLlMQ7t4XIfcLR1Eh27dFKlbhn-pWntB3wIs"
          />
          {/* Delivery Pin Overlay */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-primary text-white p-2 rounded-full shadow-lg animate-bounce">
              <MaterialIcon name="delivery_dining" className="text-xl" filled />
            </div>
            <div className="w-2 h-2 bg-primary/20 rounded-full mt-1"></div>
          </div>
          {/* Recipient Pin */}
          <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
            <div className="bg-zinc-900 text-white p-2 rounded-full shadow-lg">
              <MaterialIcon name="home" className="text-xl" filled />
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="space-y-6">
          <h3 className="font-headline text-base sm:text-lg font-bold text-on-surface">Order Progress</h3>
          <div className="relative pl-8 space-y-8 sm:space-y-10">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-surface-container-highest"></div>
            <div className="absolute left-[11px] top-2 h-1/2 w-[2px] bg-primary"></div>

            {timelineSteps.map((step, index) => (
              <div key={index} className={`relative flex items-start gap-4 ${!step.completed ? 'opacity-40' : ''}`}>
                <div className={`absolute -left-[31px] w-6 h-6 rounded-full ${step.current ? 'bg-primary' : step.completed ? 'bg-primary' : 'bg-surface-container-highest'} flex items-center justify-center ring-4 ring-white`}>
                  <MaterialIcon name={step.icon} className="text-white text-[14px] font-bold" filled={step.filled || step.completed} />
                </div>
                <div>
                  <h4 className={`font-bold leading-none ${step.current ? 'text-primary' : 'text-on-surface'}`}>{step.status}</h4>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">{step.completed ? `Completed at ${step.time}` : step.current ? `Started at ${step.time}` : `Expected at ${step.time}`}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery Person Card */}
        <Card className="p-4 sm:p-5 shadow-sm border border-black/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden">
                <img
                  alt="Delivery Driver"
                  className="w-full h-full object-cover"
                  src={deliveryPerson.image}
                />
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm sm:text-base">{deliveryPerson.name}</h4>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-zinc-500 mt-0.5">
                  <MaterialIcon name="star" className="text-tertiary-container text-[14px] sm:text-[16px]" filled />
                  <span className="font-semibold text-on-surface">{deliveryPerson.rating}</span>
                  <span>({deliveryPerson.deliveries} deliveries)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform p-0">
                <MaterialIcon name="chat_bubble" className="text-xl" />
              </Button>
              <Button variant="primary" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-md shadow-primary/20 p-0">
                <MaterialIcon name="call" className="text-xl" filled />
              </Button>
            </div>
          </div>
          {/* Vehicle Info */}
          <div className="pt-4 border-t border-surface-container flex justify-between text-xs sm:text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <MaterialIcon name="electric_scooter" className="text-[16px] sm:text-[18px]" />
              <span>{deliveryPerson.vehicle} • <span className="text-on-surface font-medium">{deliveryPerson.plateNumber}</span></span>
            </div>
            <Badge tone="tertiary" className="bg-tertiary-fixed px-2 py-0.5 rounded text-[10px] font-bold text-on-tertiary-fixed uppercase tracking-tighter self-center">
              {deliveryPerson.badge}
            </Badge>
          </div>
        </Card>

        {/* Order Summary Mini Bento */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Your Order</p>
            <p className="text-xs sm:text-sm font-bold text-on-surface truncate">{orderData.items.join(' + ')}</p>
            <p className="text-xs text-zinc-500 mt-1">${orderData.total.toFixed(2)} • Paid via {orderData.paymentMethod}</p>
          </Card>
          <Card className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Delivery To</p>
            <p className="text-xs sm:text-sm font-bold text-on-surface truncate">{orderData.address}</p>
            <p className="text-xs text-zinc-500 mt-1">{orderData.instructions}</p>
          </Card>
        </section>
      </main>

      {/* BottomNavBar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-xl shadow-[0_-8px_24px_rgba(0,0,0,0.04)] rounded-t-2xl z-50 flex justify-around items-center px-4 pb-safe md:hidden">
        <div
          onClick={() => handleNavClick('home')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="home" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Home</span>
        </div>
        <div
          onClick={() => handleNavClick('menu')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="restaurant_menu" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Menu</span>
        </div>
        <div className="flex flex-col items-center justify-center text-primary font-bold scale-110 transition-transform cursor-pointer">
          <MaterialIcon name="receipt_long" className="text-2xl" filled />
          <span className="font-body text-[10px] font-medium tracking-wide">Orders</span>
        </div>
        <div
          onClick={() => handleNavClick('notifications')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="notifications" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Notifications</span>
        </div>
        <div
          onClick={() => handleNavClick('profile')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="person_outline" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Profile</span>
        </div>
      </nav>
    </div>
  )
}
