'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'
import { useToast } from '@/components/ui/Toast'
import { useCart } from '@/lib/cart/store'

export default function CartPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { items, updateQuantity, removeItem } = useCart()
  const [upsellAdded, setUpsellAdded] = useState(false)

  const handleQuantityChange = (itemId: string, delta: number) => {
    const item = items.find(i => i.id === itemId)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta)
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
  }

  const handleNavClick = (nav: string) => {
    if (nav === 'home') router.push('/user/home')
    else if (nav === 'menu') router.push('/user/menu')
    else if (nav === 'orders') router.push('/user/orders')
    else if (nav === 'notifications') router.push('/user/notifications')
    else if (nav === 'profile') router.push('/user/profile')
  }

  const handleAddUpsell = () => {
    setUpsellAdded(true)
    showToast('Signature Aperitif added to cart (Demo mode)', 'success')
  }

  const handleCheckout = () => {
    router.push('/user/checkout')
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 4.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="active:scale-95 duration-200 text-secondary">
              <MaterialIcon name="arrow_back" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-xl text-on-surface">
              Your Selection
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant font-medium text-sm">
              {items.length} Items
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-44 px-6 max-w-2xl mx-auto space-y-8">
        {/* Order List Section */}
        <section className="space-y-6">
          <h2 className="font-headline text-2xl font-extrabold tracking-tight">Review Order</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-sm group">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    alt={item.name}
                    className="w-full h-full object-cover"
                    src={item.image}
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline font-bold text-lg leading-tight">{item.name}</h3>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      <MaterialIcon name="close" className="text-xl" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-headline font-bold text-primary">${item.price.toFixed(2)}</span>
                    <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 gap-4">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-secondary active:scale-90 transition-transform"
                      >
                        <MaterialIcon name="remove" className="text-lg" />
                      </button>
                      <span className="font-headline font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-primary active:scale-90 transition-transform"
                      >
                        <MaterialIcon name="add" className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upsell Recommendation */}
        <section className="p-6 bg-secondary-container rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center text-primary shadow-sm">
            <MaterialIcon name="auto_awesome" />
          </div>
          <div className="flex-grow">
            <p className="font-headline font-bold text-sm">Complete the experience?</p>
            <p className="text-on-secondary-container text-xs">Add a Signature Aperitif for only $9.00</p>
          </div>
          <button
            onClick={handleAddUpsell}
            disabled={upsellAdded}
            className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-full active:scale-95 transition-transform disabled:opacity-50"
          >
            {upsellAdded ? 'ADDED' : 'ADD'}
          </button>
        </section>

        {/* Price Breakdown Section */}
        <section className="space-y-4 pt-4">
          <div className="flex justify-between text-on-surface-variant">
            <span className="text-sm">Subtotal</span>
            <span className="font-headline font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span className="text-sm">Delivery Fee</span>
            <span className="font-headline font-medium">${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span className="text-sm">Estimated Tax (8%)</span>
            <span className="font-headline font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="pt-4 mt-2 border-t border-outline-variant/15 flex justify-between items-end">
            <div>
              <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Total Amount</span>
              <p className="font-headline font-extrabold text-3xl text-on-surface mt-1">${total.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-black px-2 py-1 rounded-sm">
                25-35 MINS
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Checkout Footer */}
      <footer className="fixed bottom-0 w-full bg-surface-container-lowest/80 backdrop-blur-xl pt-6 pb-8 px-6 shadow-[0_-8px_24px_rgba(0,0,0,0.04)] z-50">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Delivery Info Hint */}
          <div className="flex items-center gap-2 justify-center text-on-surface-variant text-xs mb-2">
            <MaterialIcon name="location_on" className="text-sm" />
            <span>Delivering to <strong>Home (122 Premier Way)</strong></span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full bg-primary text-on-primary font-headline font-bold text-lg py-4 rounded-full flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-primary-container disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <span>Proceed to Checkout</span>
            <MaterialIcon name="arrow_forward" />
          </button>
        </div>
      </footer>
    </div>
  )
}
