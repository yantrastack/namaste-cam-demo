'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MaterialIcon } from '@/components/MaterialIcon'
import { useCart } from '@/lib/cart/store'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const [orderMethod, setOrderMethod] = useState<'delivery' | 'pickup'>('delivery')
  const [selectedAddress, setSelectedAddress] = useState('home')
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online')
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [addresses, setAddresses] = useState([
    { id: 'home', label: 'Home', icon: 'home', address: '452 High Street, Kensington\nLondon, W8 7AS' },
    { id: 'office', label: 'Office', icon: 'work', address: 'The Shard, 32 London Bridge St\nLondon, SE1 9SG' },
  ])
  const [newAddress, setNewAddress] = useState({ label: '', postcode: '', street: '' })

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

  const handlePlaceOrder = () => {
    // Clear cart and navigate to order tracking
    clearCart()
    router.push('/user/orders/ORD-88219')
  }

  const subtotal = items.reduce((sum: number, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = orderMethod === 'delivery' ? 2.50 : 0
  const serviceFee = 1.20
  const total = subtotal + deliveryFee + serviceFee

  const handleSaveAddress = () => {
    if (newAddress.label && newAddress.postcode && newAddress.street) {
      const id = Date.now().toString()
      setAddresses([...addresses, {
        id,
        label: newAddress.label,
        icon: 'location_on',
        address: `${newAddress.street}\n${newAddress.postcode}`
      }])
      setNewAddress({ label: '', postcode: '', street: '' })
      setShowAddAddress(false)
      setSelectedAddress(id)
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
              Checkout
            </h1>
          </div>
          <div className="h-10 w-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => handleNavClick('profile')}>
            <img
              className="w-full h-full object-cover"
              alt="User profile avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFWo0e3myXniYIYaPeq5xQBKxD6BjZAhgG-Zc4mj8ykbvsET9nOlX5ozZ_wlotPIUVkdom6WfbSkWw7EXENRVJuDUE4rP8K_VC8nbxo9z8z0IT1HJvvFpe9NeICFIRQkf77HU3iqe9ot4nh_IRHXRQVQuUtSlBakt38g1KXIM3RI3Uzh6R27vfph8qjo1nTeJZrcotKaSdeXCRGrW3C-o7iqqFJ5W0xeeT_BwUJj1zlJ5Ep1Bi6mtE22RWqSCkA70NagEabwu-jKk"
            />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4 sm:px-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Order Method */}
          <section className="space-y-4">
            <h2 className="font-headline text-xl sm:text-2xl font-bold tracking-tight">Order Method</h2>
            <div className="bg-surface-container-low p-1.5 rounded-full flex gap-1">
              <Button
                onClick={() => setOrderMethod('delivery')}
                variant={orderMethod === 'delivery' ? 'primary' : 'ghost'}
                className="flex-1 rounded-full font-semibold text-sm"
              >
                Delivery
              </Button>
              <Button
                onClick={() => setOrderMethod('pickup')}
                variant={orderMethod === 'pickup' ? 'primary' : 'ghost'}
                className="flex-1 rounded-full font-semibold text-sm"
              >
                Pickup
              </Button>
            </div>
          </section>

          {/* Delivery Address */}
          {orderMethod === 'delivery' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-xl sm:text-2xl font-bold tracking-tight">Delivery Address</h2>
                <button onClick={() => setShowAddAddress(!showAddAddress)} className="text-primary font-semibold text-sm hover:opacity-80 transition-opacity">
                  {showAddAddress ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <Card
                    key={addr.id}
                    className={`p-4 sm:p-6 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-2 border-primary shadow-sm' : 'border-2 border-transparent hover:border-outline-variant'}`}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${selectedAddress === addr.id ? 'bg-primary-fixed' : 'bg-surface-container-high'}`}>
                        <MaterialIcon name={addr.icon} className={`text-xl ${selectedAddress === addr.id ? 'text-primary' : 'text-secondary'}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg mb-1">{addr.label}</h3>
                        <p className="text-secondary text-xs sm:text-sm leading-relaxed whitespace-pre-line">{addr.address}</p>
                      </div>
                      {selectedAddress === addr.id && (
                        <div className="absolute top-4 right-4 text-primary">
                          <MaterialIcon name="check_circle" className="text-xl" filled />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {showAddAddress && (
                <Card className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MaterialIcon name="add_location_alt" className="text-primary text-xl" />
                    <h3 className="font-bold">Add New Address</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-secondary px-1">Address Label (e.g. Gym)</label>
                      <input 
                        className="w-full bg-surface-container-lowest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/20 text-sm" 
                        placeholder="Work, Home, etc." 
                        type="text" 
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-secondary px-1">Postcode</label>
                      <input 
                        className="w-full bg-surface-container-lowest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/20 text-sm" 
                        placeholder="SW1A 1AA" 
                        type="text" 
                        value={newAddress.postcode}
                        onChange={(e) => setNewAddress({ ...newAddress, postcode: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-secondary px-1">Street Address</label>
                      <input 
                        className="w-full bg-surface-container-lowest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/20 text-sm" 
                        placeholder="Enter your full street address" 
                        type="text" 
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button variant="primary" className="w-full" onClick={handleSaveAddress}>
                        Save Address
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </section>
          )}

          {/* Payment Method */}
          <section className="space-y-4">
            <h2 className="font-headline text-xl sm:text-2xl font-bold tracking-tight">Payment Method</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Card
                className={`flex-1 min-w-40 flex items-center gap-3 p-4 cursor-pointer transition-all active:scale-95 ${paymentMethod === 'online' ? 'border-2 border-primary shadow-sm' : 'border-2 border-transparent hover:border-outline-variant'}`}
                onClick={() => setPaymentMethod('online')}
              >
                <MaterialIcon name="account_balance_wallet" className={`text-2xl ${paymentMethod === 'online' ? 'text-primary' : 'text-secondary'}`} filled={paymentMethod === 'online'} />
                <div className="text-left">
                  <p className="text-sm font-bold">Online Payment</p>
                  <p className="text-[10px] text-secondary">Visa, Master, GPay</p>
                </div>
              </Card>
              <Card
                className={`flex-1 min-w-40 flex items-center gap-3 p-4 cursor-pointer transition-all active:scale-95 ${paymentMethod === 'cash' ? 'border-2 border-primary shadow-sm' : 'border-2 border-transparent hover:border-outline-variant'}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <MaterialIcon name="payments" className={`text-2xl ${paymentMethod === 'cash' ? 'text-primary' : 'text-secondary'}`} filled={paymentMethod === 'cash'} />
                <div className="text-left">
                  <p className="text-sm font-bold">Cash on Delivery</p>
                  <p className="text-[10px] text-secondary">Pay at your door</p>
                </div>
              </Card>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6 shadow-sm border border-surface-container-high/50">
              <h3 className="font-headline font-bold text-base sm:text-lg mb-4 sm:mb-6">Order Summary</h3>
              <div className="space-y-4 mb-4 sm:mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-surface-container">
                        <img
                          className="w-full h-full object-cover"
                          alt={item.name}
                          src={item.image}
                        />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold">{item.name}</p>
                        <p className="text-[10px] sm:text-xs text-secondary">{item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-4 sm:pt-6 border-t border-surface-container">
                <div className="flex justify-between text-xs sm:text-sm text-secondary">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-secondary">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-secondary">
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 sm:pt-4 mt-2 border-t border-surface-container">
                  <span className="font-bold text-base sm:text-lg">Total</span>
                  <span className="font-headline font-extrabold text-xl sm:text-2xl text-primary tracking-tight">${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Card className="bg-tertiary-fixed/20 p-4 flex items-start gap-3">
              <MaterialIcon name="info" className="text-tertiary text-xl" />
              <p className="text-[10px] sm:text-xs text-on-tertiary-fixed-variant leading-relaxed">
                By placing your order, you agree to Namaste Cam's terms of service and privacy policy.
              </p>
            </Card>

            <Button
              onClick={handlePlaceOrder}
              variant="primary"
              className="w-full py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Place Order
              <MaterialIcon name="arrow_forward" />
            </Button>
          </div>
        </aside>
      </main>

      {/* BottomNavBar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-xl flex justify-around items-center px-4 pb-safe z-50 rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.04)] md:hidden">
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
