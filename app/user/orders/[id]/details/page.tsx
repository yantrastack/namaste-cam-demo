'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MaterialIcon } from '@/components/MaterialIcon'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/lib/cart/store'
import { useToast } from '@/components/ui/Toast'
import { getOrderById } from '@/lib/orders/store'

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [rating, setRating] = useState(0)
  const { id } = use(params)
  const [orderData, setOrderData] = useState(getOrderById(id))

  useEffect(() => {
    const order = getOrderById(id)
    if (order) {
      setOrderData(order)
    } else {
      showToast('Order not found', 'error')
      router.push('/user/orders')
    }
  }, [id, showToast, router])

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

  const handleReorder = () => {
    if (!orderData) return
    
    orderData.items.forEach((item) => {
      addItem({
        id: `${orderData.id}-${item.name}`,
        name: item.name,
        price: item.price,
        image: orderData.image,
      })
    })
    showToast(`${orderData.items.length} items added to cart!`, 'success')
    router.push('/user/cart')
  }

  const handleDownloadInvoice = () => {
    showToast('Invoice download started (Demo mode)', 'info')
  }

  const handleNeedHelp = () => {
    showToast('Support contact: support@namastecam.com or call +44 123 456 7890 (Demo mode)', 'info')
  }

  const handleRateOrder = (stars: number) => {
    setRating(stars)
    if (stars > 0) {
      showToast(`Thanks for rating ${stars} stars!`, 'success')
    }
  }

  const getTimelineSteps = () => {
    if (!orderData) return []
    
    const baseSteps = [
      { status: 'Order Placed', description: 'We have received your order', completed: true },
      { status: 'Preparing Food', description: 'Chef is crafting your meal', completed: orderData.status !== 'Out for Delivery' && orderData.status !== 'Delivered' },
      { status: 'Out for Delivery', description: 'On the way to your doorstep', completed: orderData.status === 'Delivered' },
      { status: 'Delivered', description: 'Enjoy your delicious food!', completed: orderData.status === 'Delivered' },
    ]
    
    if (orderData.status === 'Cancelled') {
      return [
        { status: 'Order Placed', description: 'We have received your order', completed: true },
        { status: 'Cancelled', description: 'Order was cancelled', completed: true },
      ]
    }
    
    return baseSteps
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-surface font-body text-on-surface flex items-center justify-center">
        <div className="text-center">
          <MaterialIcon name="error" className="text-6xl text-secondary mb-4" />
          <h2 className="text-xl font-headline font-bold text-on-surface mb-2">Order Not Found</h2>
          <Button onClick={() => router.push('/user/orders')} variant="primary">
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  const timelineSteps = getTimelineSteps()

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-32 md:pb-8">
      {/* Top App Bar */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16 w-full">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="active:scale-95 transition-transform text-zinc-500 hover:opacity-80">
            <MaterialIcon name="arrow_back" className="text-2xl" />
          </button>
          <h1 className="font-headline font-extrabold tracking-tight text-base sm:text-xl text-on-surface">Order #{orderData.id}</h1>
        </div>
        <Badge 
          tone={orderData.statusTone === 'success' ? 'success' : orderData.statusTone === 'error' ? 'error' : orderData.statusTone === 'warning' ? 'warning' : 'info'}
          className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        >
          {orderData.status}
        </Badge>
      </header>

      <main className="pt-24 px-4 sm:px-6 max-w-md mx-auto space-y-4 sm:space-y-6">
        {/* Order Summary Card */}
        <Card className="p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              alt={orderData.restaurant}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
              src={orderData.image}
            />
            <div>
              <h2 className="font-headline font-bold text-base sm:text-lg text-on-surface">{orderData.restaurant}</h2>
              <p className="text-xs sm:text-sm text-secondary">{orderData.location}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">{orderData.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-headline font-extrabold text-primary text-base sm:text-lg">${orderData.total.toFixed(2)}</p>
            <p className="text-[10px] text-secondary uppercase font-bold tracking-tighter">Paid ({orderData.paymentMethod})</p>
          </div>
        </Card>

        {/* Order Status Timeline */}
        <Card className="p-4 sm:p-6 shadow-sm">
          <h3 className="font-headline font-bold mb-4 sm:mb-6 text-on-surface text-sm sm:text-base">Order Timeline</h3>
          <div className="space-y-0 relative">
            {/* Timeline Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-primary"></div>
            {timelineSteps.map((step, index) => (
              <div key={index} className="relative flex items-center gap-4 pb-4 sm:pb-6 last:pb-0">
                <div className="z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <MaterialIcon name="check" className="text-[14px] text-white" filled />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-on-surface">{step.status}</p>
                  <p className="text-[10px] sm:text-xs text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Details */}
        <section className="grid grid-cols-1 gap-4">
          <Card className="p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Delivery Address</p>
                <p className="text-sm font-bold">{orderData.address}</p>
                <p className="text-sm text-secondary">{orderData.city}</p>
                <p className="text-sm text-on-surface mt-2 font-medium">{orderData.contactName} • {orderData.contactPhone}</p>
              </div>
              <div className="bg-surface-container-high p-2 rounded-lg">
                <MaterialIcon name="location_on" className="text-primary text-xl" />
              </div>
            </div>
            <hr className="border-surface-variant opacity-50" />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                  <img
                    alt="Delivery Partner"
                    className="w-full h-full object-cover"
                    src={orderData.deliveryPerson.image}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold">{orderData.deliveryPerson.name}</p>
                  <div className="flex items-center gap-1">
                    <MaterialIcon name="star" className="text-[12px] text-tertiary" filled />
                    <span className="text-xs text-secondary">{orderData.deliveryPerson.rating} • {orderData.deliveryPerson.vehicle}</span>
                  </div>
                </div>
              </div>
              <Button variant="primary" className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform p-0">
                <MaterialIcon name="call" className="text-xl" />
              </Button>
            </div>
          </Card>
        </section>

        {/* Order Items List */}
        <Card className="p-4 sm:p-5 shadow-sm">
          <h3 className="font-headline font-bold mb-3 sm:mb-4 text-on-surface text-sm sm:text-base border-b border-surface-variant pb-2">Order Summary</h3>
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">{item.quantity}x</span>
                  <p className="text-xs sm:text-sm font-medium">{item.name}</p>
                </div>
                <p className="text-xs sm:text-sm font-bold">£{item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-4 border-t border-surface-variant border-dashed">
            <div className="flex justify-between text-xs text-secondary">
              <span>Subtotal</span>
              <span>£{orderData.fees.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-secondary">
              <span>Delivery Fee</span>
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-[9px]">Free</span>
            </div>
            <div className="flex justify-between text-xs text-secondary">
              <span>Service Fee</span>
              <span>£{orderData.fees.service.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-secondary">
              <span>Taxes</span>
              <span>£{orderData.fees.taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-headline font-extrabold text-on-surface pt-2">
              <span>Total</span>
              <span>£{orderData.fees.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Review Section */}
        <Card className="p-4 sm:p-6 shadow-sm text-center">
          <h3 className="font-headline font-bold mb-1 sm:mb-2 text-sm sm:text-base">Rate your order</h3>
          <p className="text-[10px] sm:text-xs text-secondary mb-3 sm:mb-4">How was the food and delivery?</p>
          <div className="flex justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRateOrder(star)}
                className="active:scale-90 transition-transform"
              >
                <MaterialIcon
                  name="star"
                  className={`text-2xl sm:text-3xl cursor-pointer transition-colors ${star <= rating ? 'text-tertiary' : 'text-zinc-300'}`}
                  filled={star <= rating}
                />
              </button>
            ))}
          </div>
          <Button variant="ghost" className="text-primary font-bold text-xs sm:text-sm hover:underline active:scale-95 transition-transform p-0">
            Write a review
          </Button>
        </Card>

        {/* Action Buttons */}
        <section className="flex flex-col gap-3 pb-8 sm:pb-12">
          <Button
            onClick={handleReorder}
            variant="primary"
            className="w-full text-white font-headline font-bold py-3 sm:py-4 rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-transform text-sm sm:text-base"
          >
            Reorder
          </Button>
          <Button
            onClick={handleDownloadInvoice}
            variant="outline"
            className="w-full bg-transparent border-2 border-outline-variant text-on-surface font-headline font-bold py-3 sm:py-4 rounded-full active:scale-95 transition-transform text-sm sm:text-base"
          >
            Download Invoice
          </Button>
          <button
            onClick={handleNeedHelp}
            className="text-zinc-500 font-medium text-xs sm:text-sm text-center mt-2 active:opacity-60 transition-opacity"
          >
            Need Help?
          </button>
        </section>
      </main>

      {/* BottomNavBar - Mobile Only */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 z-50 rounded-t-2xl md:hidden">
        <div
          onClick={() => handleNavClick('home')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary transition-opacity cursor-pointer"
        >
          <MaterialIcon name="home" className="text-xl" />
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest">Home</span>
        </div>
        <div
          onClick={() => handleNavClick('menu')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary transition-opacity cursor-pointer"
        >
          <MaterialIcon name="restaurant_menu" className="text-xl" />
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest">Menu</span>
        </div>
        <div className="flex flex-col items-center justify-center text-primary bg-red-50 rounded-full px-3 sm:px-4 py-1 active:scale-90 transition-transform cursor-pointer">
          <MaterialIcon name="receipt_long" className="text-xl" />
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest">Orders</span>
        </div>
        <div
          onClick={() => handleNavClick('notifications')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary transition-opacity cursor-pointer"
        >
          <MaterialIcon name="notifications" className="text-xl" />
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest">Notifications</span>
        </div>
        <div
          onClick={() => handleNavClick('profile')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary transition-opacity cursor-pointer"
        >
          <MaterialIcon name="person" className="text-xl" />
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest">Profile</span>
        </div>
      </nav>
    </div>
  )
}
