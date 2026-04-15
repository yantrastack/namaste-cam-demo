'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'
import { useCart } from '@/lib/cart/store'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  time: string
  dietary?: string[]
  isVegetarian: boolean
  discount?: string
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Old Delhi Butter Chicken',
    description: 'Tandoori-grilled chicken thighs simmered in a rich, creamy tomato and fenugreek sauce.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600',
    category: 'Tandoori',
    rating: 4.8,
    time: '25-35 min',
    dietary: ['Dairy', 'Nuts'],
    isVegetarian: false
  },
  {
    id: '2',
    name: 'Royal Hyderabadi Biryani',
    description: 'Slow-cooked tender lamb chunks layered with aromatic long-grain basmati rice and spices.',
    price: 12.75,
    originalPrice: 15.00,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
    category: 'Biryani',
    rating: 4.9,
    time: '30-40 min',
    dietary: ['Gluten Free'],
    isVegetarian: false,
    discount: "Chef's Choice • 15% OFF"
  },
  {
    id: '3',
    name: 'Paneer Tikka Salad',
    description: 'Chargrilled paneer cubes tossed with garden fresh greens and zesty mint vinaigrette.',
    price: 10.95,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    category: 'Sides',
    rating: 4.6,
    time: '15-20 min',
    dietary: [],
    isVegetarian: true
  },
  {
    id: '4',
    name: 'Garlic & Cilantro Naan',
    description: 'Freshly baked in our clay oven, brushed with garlic butter and fresh cilantro.',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600',
    category: 'Sides',
    rating: 4.7,
    time: '10-15 min',
    dietary: ['Dairy'],
    isVegetarian: true
  }
]

const categories = ['All Dishes', 'Tandoori', 'Curries', 'Biryani', 'Sides']

export default function MenuPage() {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  const { items, addItem, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart()
  const [activeCategory, setActiveCategory] = useState('All Dishes')

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      isVeg: item.isVegetarian,
      description: item.description,
      discount: item.discount,
    })
  }

  const handleRemoveFromCart = (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1)
    } else {
      removeItem(itemId)
    }
  }

  const getItemQuantity = (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    return item ? item.quantity : 0
  }

  const totalItems = getTotalItems()
  const cartTotal = getTotalPrice()

  const filteredItems = activeCategory === 'All Dishes'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md shadow-sm shadow-black/5 flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-4">
          <button onClick={openDrawer} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200">
            <MaterialIcon name="menu" className="text-secondary" />
          </button>
          <h1 className="text-xl font-extrabold text-primary italic font-headline tracking-tight">
            Namaste Cambridge
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container-high cursor-pointer" onClick={() => router.push('/user/profile')}>
          <img
            className="w-full h-full object-cover"
            alt="User profile avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXFnLzVVhUq11P95jUmmneyhTJd9NUJq2pBpLde_xqLC6NQbiRzX2tVLRFqvzIxJdh5pBXTDfLIX45Gpbg0OaCvG06csqlY9t8bSPQzN4H02qBgd180vz7nJ11EukD-J34N7VHZxgTpwFxnk92FAKPmuBbNE_GyHtpA-fWN6qN717WWfGnQ6IS7LwSfA1PCCmpN1Fc2yFly1j4ihEXkGDwtKlgYzl-xm2nJyBcANt8RLamn2DAiHi55OX9frjhcNHrsbadk1-XJpM"
          />
        </div>
      </header>

      <main className="pt-20 pb-32 px-4">
        {/* Header Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
            Explore Menu
          </h2>
          <p className="text-on-surface-variant text-sm">
            Authentic Indian Flavors Curated for Cambridge
          </p>
        </section>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food List */}
        <div className="space-y-6">
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id)
            return (
              <article
                key={item.id}
                className={`flex gap-4 p-4 bg-surface-container-lowest rounded-xl transition-all ${
                  quantity > 0 ? 'shadow-md border-2 border-primary/10 relative' : 'shadow-sm hover:shadow-md'
                }`}
              >
                {item.discount && (
                  <div className="absolute -top-3 right-4 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm z-10">
                    {item.discount}
                  </div>
                )}
                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover"
                    alt={item.name}
                    src={item.image}
                  />
                  {/* Veg/Non-Veg Indicator */}
                  <div
                    className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10 ${
                      item.isVegetarian ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    title={item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-headline font-bold text-lg text-on-surface leading-tight">
                        {item.name}
                      </h3>
                      {item.dietary && item.dietary.length > 0 && (
                        <MaterialIcon
                          name="info"
                          className="text-secondary text-xl cursor-help"
                          title={item.dietary.join(', ')}
                        />
                      )}
                    </div>
                    <p className="text-on-surface-variant text-sm line-clamp-2 mb-2 font-body">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-primary font-bold text-lg font-headline">
                        £{item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-on-surface-variant text-xs line-through">
                          £{item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  {quantity > 0 ? (
                    <div className="self-end flex h-10 w-32 shrink-0 items-center justify-between rounded-full bg-primary px-1 text-on-primary shadow-lg shadow-primary/20">
                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-on-primary/15 transition-colors active:scale-90"
                      >
                        <MaterialIcon name="remove" className="text-lg" />
                      </button>
                      <span className="min-w-[1.25rem] text-center font-bold text-sm tabular-nums">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-on-primary/15 transition-colors active:scale-90"
                      >
                        <MaterialIcon name="add" className="text-lg" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      aria-label={`Add ${item.name} to cart`}
                      className="self-end flex h-10 w-32 shrink-0 items-center justify-center gap-1 rounded-full bg-primary px-2 text-on-primary text-[11px] font-bold leading-none tracking-tight shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                      <MaterialIcon name="add" className="text-base shrink-0" />
                      Add to cart
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </main>

      {/* Floating Dynamic Cart */}
      {totalItems > 0 && (
        <div
          onClick={() => router.push('/user/cart')}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-surface-container-lowest/80 backdrop-blur-xl rounded-full py-4 px-6 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 cursor-pointer active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary font-bold">
              {totalItems}
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {totalItems} ITEM{totalItems !== 1 ? 'S' : ''} ADDED
              </p>
              <p className="text-sm font-bold text-on-surface">
                £{cartTotal.toFixed(2)} plus taxes
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-full">
            VIEW CART
            <MaterialIcon name="arrow_forward_ios" className="text-sm" />
          </button>
        </div>
      )}

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest/80 backdrop-blur-lg shadow-[0_-8px_24px_rgba(0,0,0,0.04)] z-50 rounded-t-[2rem]">
        <div
          onClick={() => router.push('/user/home')}
          className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-transform active:scale-90 duration-150 cursor-pointer"
        >
          <MaterialIcon name="home" className="text-2xl" />
          <span className="font-headline text-[10px] font-semibold tracking-wide uppercase mt-1">
            Home
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-primary bg-primary/10 rounded-2xl px-4 py-2 transition-transform active:scale-90 duration-150 cursor-pointer">
          <MaterialIcon name="restaurant_menu" className="text-2xl" />
          <span className="font-headline text-[10px] font-semibold tracking-wide uppercase mt-1">
            Menu
          </span>
        </div>
        <div
          onClick={() => router.push('/user/orders')}
          className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-transform active:scale-90 duration-150 cursor-pointer"
        >
          <MaterialIcon name="receipt_long" className="text-2xl" />
          <span className="font-headline text-[10px] font-semibold tracking-wide uppercase mt-1">
            Orders
          </span>
        </div>
        <div
          onClick={() => router.push('/user/notifications')}
          className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-transform active:scale-90 duration-150 cursor-pointer"
        >
          <MaterialIcon name="notifications" className="text-2xl" />
          <span className="font-headline text-[10px] font-semibold tracking-wide uppercase mt-1">
            Notifications
          </span>
        </div>
        <div
          onClick={() => router.push('/user/profile')}
          className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-transform active:scale-90 duration-150 cursor-pointer"
        >
          <MaterialIcon name="person" className="text-2xl" />
          <span className="font-headline text-[10px] font-semibold tracking-wide uppercase mt-1">
            Profile
          </span>
        </div>
      </nav>

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
