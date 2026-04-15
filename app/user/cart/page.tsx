'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'
import { useCart } from '@/lib/cart/store'
import { useFavorites } from '@/lib/favorites/store'
import { Button } from '@/components/ui/Button'
import { dishes } from '../data/dummy-data'

// Suggestions data
const suggestions = [
  {
    id: 's1',
    name: 'Gulab Jamun',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 's2',
    name: 'Coke Zero',
    price: 3.80,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200',
  },
  {
    id: 's3',
    name: "Sparkling Water",
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=200',
  },
]

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [isRecommendedDrawerOpen, setIsRecommendedDrawerOpen] = useState(false)

  const handleQuantityChange = (itemId: string, delta: number) => {
    const item = items.find(i => i.id === itemId)
    if (item) {
      const newQuantity = item.quantity + delta
      if (newQuantity <= 0) {
        removeItem(itemId)
      } else {
        updateQuantity(itemId, newQuantity)
      }
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
  }

  const handleAddSuggestion = (suggestion: typeof suggestions[0]) => {
    addItem({
      id: suggestion.id,
      name: suggestion.name,
      price: suggestion.price,
      image: suggestion.image,
    })
  }

  const openRecommendedDrawer = () => {
    setIsRecommendedDrawerOpen(true)
  }

  const closeRecommendedDrawer = () => {
    setIsRecommendedDrawerOpen(false)
  }

  const handleRecommendedAddToCart = (dish: typeof dishes[0]) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      originalPrice: dish.originalPrice,
      image: dish.image,
      isVeg: dish.isVeg,
      description: dish.description,
      discount: dish.badge,
      mealType: dish.mealType,
    })
  }

  const handleRecommendedToggleFavorite = (dish: typeof dishes[0]) => {
    toggleFavorite({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      originalPrice: dish.originalPrice,
      image: dish.image,
      rating: dish.rating,
      time: dish.time,
      isVeg: dish.isVeg,
      discount: dish.badge,
      mealType: dish.mealType,
    })
  }

  const getCartItemQuantity = (dishId: string) => {
    const cartItem = items.find(item => item.id === dishId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleIncreaseQuantity = (dish: typeof dishes[0]) => {
    const currentQuantity = getCartItemQuantity(dish.id)
    if (currentQuantity === 0) {
      handleRecommendedAddToCart(dish)
    } else {
      updateQuantity(dish.id, currentQuantity + 1)
    }
  }

  const handleDecreaseQuantity = (dishId: string) => {
    const currentQuantity = getCartItemQuantity(dishId)
    if (currentQuantity > 1) {
      updateQuantity(dishId, currentQuantity - 1)
    } else {
      removeItem(dishId)
    }
  }

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.trim().toUpperCase())
    }
  }

  const handleCheckout = () => {
    router.push('/user/checkout')
  }

  // Calculate totals
  const cartTotal = items.reduce((sum, item) => {
    const originalPrice = item.originalPrice || item.price
    return sum + (originalPrice * item.quantity)
  }, 0)
  
  const discountedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const promotionalDiscount = cartTotal - discountedTotal
  
  // Coupon discount (example: 20% off with WELCOME20)
  let couponSavings = 0
  if (appliedCoupon === 'WELCOME20') {
    couponSavings = discountedTotal * 0.20
  }
  
  const subtotalAfterCoupon = discountedTotal - couponSavings
  const deliveryFee = 2.99
  const tax = subtotalAfterCoupon * 0.08
  const totalPayable = subtotalAfterCoupon + deliveryFee + tax
  
  // Calculate progress to next discount
  const progressPercent = Math.min((totalPayable / 70) * 100, 100)
  const remainingForDiscount = Math.max(0, 70 - totalPayable)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-40">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 cursor-pointer"
            >
              <MaterialIcon name="arrow_back" className="text-secondary" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-xl text-on-surface">
              Your Selection
            </h1>
          </div>
          <span className="text-on-surface-variant font-medium text-sm">
            {totalItems} Items
          </span>
        </div>
      </header>

      <main className="pt-20 px-4">
        {/* Review Order Section */}
        <section className="py-4">
          <h2 className="font-headline font-extrabold text-xl tracking-tight mb-4">Review Order</h2>
          
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/10">
                {/* Image */}
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden relative bg-surface-container">
                    <img
                      alt={item.name}
                      className="w-full h-full object-cover"
                      src={item.image}
                    />
                    {/* Veg/Non-Veg Indicator */}
                    {item.isVeg !== undefined && (
                      <div
                        className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full border-2 border-white shadow flex items-center justify-center ${
                          item.isVeg ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={openRecommendedDrawer}
                    className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors text-center underline underline-offset-2 cursor-pointer"
                  >
                    Recommended
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Top Row: Name and Remove Button */}
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-headline font-bold text-sm leading-tight text-on-surface">{item.name}</h3>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-secondary hover:text-error transition-colors p-0.5 shrink-0 cursor-pointer"
                    >
                      <MaterialIcon name="close" className="text-lg" />
                    </button>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-on-surface-variant text-xs mt-0.5">{item.description}</p>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {/* Only show Trending badge, hide Dinner Special / Lunch Special */}
                    {item.discount === 'Trending' && (
                      <span className="text-[10px] font-bold text-white bg-tertiary px-2 py-0.5 rounded-full">
                        Trending
                      </span>
                    )}
                    {(item.discount?.includes('%') || item.discount?.includes('OFF')) && (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        {item.discount}
                      </span>
                    )}
                    {item.couponApplied && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {item.couponApplied}
                      </span>
                    )}
                    {(item.discount?.includes('FREE') || item.price === 0) && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        FREE!
                      </span>
                    )}
                  </div>

                  {/* Bottom Row: Price and Quantity */}
                  <div className="flex justify-between items-center mt-auto pt-3">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-on-surface text-base">
                        £{item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-on-surface-variant text-xs line-through">
                          £{item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center bg-surface-container-high rounded-full px-1 py-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-secondary hover:bg-white active:scale-90 transition-all cursor-pointer"
                      >
                        <MaterialIcon name="remove" className="text-base" />
                      </button>
                      <span className="w-6 text-center font-headline font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-primary hover:bg-white active:scale-90 transition-all cursor-pointer"
                      >
                        <MaterialIcon name="add" className="text-base" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suggestions Section */}
        {items.length > 0 && (
          <section className="py-4 border-t border-outline-variant/20">
            <h3 className="font-headline font-bold text-sm mb-3">Suggestions</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex-shrink-0 w-28">
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-surface-container-low mb-2">
                    <img
                      src={suggestion.image}
                      alt={suggestion.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-headline font-bold text-xs truncate">{suggestion.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-primary text-xs">£{suggestion.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddSuggestion(suggestion)}
                      className="px-2 py-1 bg-primary text-on-primary rounded-full text-[10px] font-bold active:scale-90 transition-transform cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coupon Code Section */}
        <section className="py-4 border-t border-outline-variant/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 h-11 px-4 bg-surface-container-high rounded-full text-sm border-none outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={handleApplyCoupon}
              className="h-11 px-6 bg-primary text-on-primary rounded-full font-bold text-sm active:scale-95 transition-transform cursor-pointer"
            >
              Apply
            </button>
          </div>
          {appliedCoupon && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              Coupon {appliedCoupon} applied successfully!
            </p>
          )}
        </section>

        {/* Price Breakdown */}
        <section className="py-4 border-t border-outline-variant/20 space-y-2">
          <div className="flex justify-between text-on-surface-variant text-sm">
            <span>Cart Total</span>
            <span className="font-headline font-medium">£{cartTotal.toFixed(2)}</span>
          </div>
          
          {promotionalDiscount > 0 && (
            <div className="flex justify-between text-green-600 text-sm">
              <span>Promotional Discounts</span>
              <span className="font-headline font-medium">-£{promotionalDiscount.toFixed(2)}</span>
            </div>
          )}
          
          {couponSavings > 0 && (
            <div className="flex justify-between text-green-600 text-sm">
              <span>Coupon Savings ({appliedCoupon})</span>
              <span className="font-headline font-medium">-£{couponSavings.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-on-surface-variant text-sm">
            <span>Delivery Fee</span>
            <span className="font-headline font-medium">£{deliveryFee.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-on-surface-variant text-sm">
            <span>Taxes</span>
            <span className="font-headline font-medium">£{tax.toFixed(2)}</span>
          </div>
          
          <div className="pt-3 mt-2 border-t border-outline-variant/20 flex justify-between items-end">
            <div>
              <span className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Total Payable</span>
              <p className="font-headline font-extrabold text-2xl text-on-surface mt-1">
                £{totalPayable.toFixed(2)}
              </p>
            </div>
            <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-2 py-1 rounded-full">
              30-45 MINS
            </span>
          </div>
        </section>

        {/* Discount Progress */}
        {remainingForDiscount > 0 && (
          <section className="py-3">
            <div className="bg-secondary-container rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-on-secondary-container">
                  Add £{remainingForDiscount.toFixed(2)} more for extra 5% off
                </span>
              </div>
              <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Fixed Checkout Footer */}
      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl pt-4 pb-6 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
        <Button
          onClick={handleCheckout}
          disabled={items.length === 0}
          className="w-full h-14 bg-error text-on-primary font-headline font-bold text-base rounded-full shadow-lg shadow-error/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <MaterialIcon name="arrow_forward" className="text-lg" />
        </Button>
      </footer>

      {/* Recommended Drawer - Slides from bottom to 80% height */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          isRecommendedDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={closeRecommendedDrawer}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
            isRecommendedDrawerOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ height: '80%', maxHeight: '80vh' }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-surface-variant rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-4 border-b border-outline-variant/20">
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">
                Recommended for You
              </h3>
              <p className="text-secondary text-sm">
                Dishes you might enjoy
              </p>
            </div>
            <button
              onClick={closeRecommendedDrawer}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer"
            >
              <MaterialIcon name="close" className="text-secondary" />
            </button>
          </div>

          {/* Recommended Items - Menu Style (Horizontal List) */}
          <div className="overflow-y-auto px-4 py-4 pb-20" style={{ height: 'calc(100% - 100px)' }}>
            <div className="space-y-4">
              {dishes.slice(0, 16).map((dish) => {
                const quantity = getCartItemQuantity(dish.id)
                return (
                  <article
                    key={dish.id}
                    className={`flex gap-4 p-4 bg-surface-container-lowest rounded-xl transition-all ${
                      quantity > 0 ? 'shadow-md border-2 border-primary/10 relative' : 'shadow-sm'
                    }`}
                  >
                    {/* Image */}
                    <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden relative">
                      <img
                        className="w-full h-full object-cover"
                        alt={dish.name}
                        src={dish.image}
                      />
                      {/* Veg/Non-Veg Indicator */}
                      <div
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10 ${
                          dish.isVeg ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Content - Fixed height flex layout */}
                    <div className="flex-1 flex flex-col min-w-0">
                      {/* Top section - Title and Favorite */}
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-headline font-bold text-base text-on-surface leading-tight truncate pr-2 flex-1">
                          {dish.name}
                        </h4>
                        {/* Favorite Button - Right side of card */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRecommendedToggleFavorite(dish)
                          }}
                          className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-all shrink-0 cursor-pointer"
                        >
                          <MaterialIcon
                            name="favorite"
                            filled={isFavorite(dish.id)}
                            className={`text-lg ${isFavorite(dish.id) ? 'text-orange-600' : 'text-secondary'}`}
                          />
                        </button>
                      </div>

                      {/* Middle section - Description and Price */}
                      <div className="flex-1">
                        <p className="text-on-surface-variant text-xs line-clamp-2 mb-2 font-body">
                          {dish.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-primary font-bold text-base font-headline">
                            £{dish.price.toFixed(2)}
                          </span>
                          {dish.originalPrice && (
                            <span className="text-on-surface-variant text-xs line-through">
                              £{dish.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-zinc-500 text-xs">
                          <div className="flex items-center gap-1">
                            <MaterialIcon name="star" className="text-tertiary-container text-sm" />
                            <span className="font-bold text-on-surface">{dish.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MaterialIcon name="schedule" className="text-sm" />
                            <span>{dish.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom section - Add to Cart / Quantity Controls - Right aligned */}
                      <div className="flex items-end justify-between mt-auto pt-2">
                        <div className="flex-1" />
                        <div className="h-8">
                          {quantity > 0 ? (
                            <div className="flex items-center justify-between bg-primary-container text-on-primary-container rounded-full px-1 py-1 w-28 h-8 shadow-inner">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDecreaseQuantity(dish.id)
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors active:scale-90 cursor-pointer"
                              >
                                <MaterialIcon name="remove" className="text-sm" />
                              </button>
                              <span className="font-bold text-sm">{quantity}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleIncreaseQuantity(dish)
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors active:scale-90 cursor-pointer"
                              >
                                <MaterialIcon name="add" className="text-sm" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                              handleRecommendedAddToCart(dish)
                              }}
                              className="w-28 h-8 px-3 bg-primary text-on-primary rounded-full text-xs font-bold flex items-center justify-center cursor-pointer whitespace-nowrap"
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
