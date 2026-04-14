'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MaterialIcon } from '@/components/MaterialIcon'
import { Input } from '@/components/ui/Input'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'
import { categories, dishes, featuredBanner } from '../data/dummy-data'
import { useCart } from '@/lib/cart/store'
import { useFavorites } from '@/lib/favorites/store'

export default function HomePage() {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeMealType, setActiveMealType] = useState<'lunch' | 'dinner'>('lunch')
  const { items: favorites, toggleFavorite, isFavorite } = useFavorites()
  const { items: cartItems, addItem, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart()

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  const handleToggleFavorite = (dish: typeof dishes[0]) => {
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

  const handleAddToCart = (dish: typeof dishes[0]) => {
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

  const getCartItemQuantity = (dishId: string) => {
    const cartItem = cartItems.find(item => item.id === dishId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleIncreaseQuantity = (dish: typeof dishes[0]) => {
    const currentQuantity = getCartItemQuantity(dish.id)
    if (currentQuantity === 0) {
      handleAddToCart(dish)
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

  const handleOrderNow = () => {
    router.push('/user/checkout')
  }

  const handleCartClick = () => {
    router.push('/user/cart')
  }

  const handleProductClick = (dishId: string) => {
    router.push(`/user/product/${dishId}`)
  }

  // Filter dishes based on search query, category, and meal type
  const filteredDishes = dishes.filter(dish => {
    // Meal type filter - show dishes that include the active meal type
    const mealTypeMatch = !dish.mealType || dish.mealType.includes(activeMealType)
    
    // Category filter - if "all" is selected, show all dishes
    const selectedCategory = categories.find(c => c.id === activeCategory)
    const categoryMatch = activeCategory === 'all'
      ? true
      : (selectedCategory ? dish.category === selectedCategory.name : true)

    // Search filter
    const searchMatch = !searchQuery.trim() || 
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase())

    return mealTypeMatch && categoryMatch && searchMatch
  })

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 w-full">
          <div className="flex items-center gap-4">
            <button onClick={openDrawer} className="text-zinc-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <MaterialIcon name="menu" className="text-2xl" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-lg text-primary">
              Namaste Cam
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden cursor-pointer" onClick={() => router.push('/user/profile')}>
              <img
                className="w-full h-full object-cover"
                alt="User profile avatar photo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBLTUkPph8lyHdvxM66U8H8_95GCrxcO46WjeUi1MA8D_FLTN_SqQI_uHSLGUH4fRbtI-TWsvVTblcDWvFLs5gV6EzM206c91DoW-Vls_ueYkDqnk7RJTlWExOxMpUrTXveRmq1FXVGud-Gx0U9sZp5lBnZ3pSRAhdVzDiODC0m82H4g1hIcxeYsStCVVUYcmHuodFLRLd3zt3C_ZnQs7PeYRVZ8pQ6sX-a2D11H9-liDxAmBIDHyOgJT5_mbENQgB5M2lZxJdFes"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        {/* Search Bar Section */}
        <section className="mb-8">
          <div className="relative group [&_label]:sr-only">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <MaterialIcon name="search" className="text-outline text-xl" />
            </div>
            <Input
              label="Search"
              type="text"
              placeholder="Search for flavors, cuisines, or restaurants"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-6 bg-surface-container-highest border-none rounded-full text-base focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </section>

        {/* Lunch/Dinner Toggle */}
        <section className="mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveMealType('lunch')}
              className={`flex-1 h-12 rounded-full font-headline font-bold text-sm transition-all active:scale-95 ${
                activeMealType === 'lunch'
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              Lunch
            </button>
            <button
              onClick={() => setActiveMealType('dinner')}
              className={`flex-1 h-12 rounded-full font-headline font-bold text-sm transition-all active:scale-95 ${
                activeMealType === 'dinner'
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              Dinner
            </button>
          </div>
        </section>

        {/* Categories horizontal scrolling */}
        <section className="mb-10">
          <div className="flex overflow-x-auto gap-4 py-2 hide-scrollbar">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex flex-col items-center gap-2 shrink-0 group cursor-pointer transition-all ${
                  activeCategory === category.id ? 'scale-105' : ''
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-active:scale-90 ${
                    activeCategory === category.id
                      ? 'bg-primary shadow-xl shadow-primary/10'
                      : 'bg-surface-container-low'
                  }`}
                >
                  <MaterialIcon
                    name={category.icon}
                    className={`text-2xl ${
                      activeCategory === category.id ? 'text-on-primary' : 'text-zinc-600'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-wider ${
                    activeCategory === category.id ? 'text-primary' : 'text-zinc-500'
                  }`}
                >
                  {category.name.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Banner - Only show when All is selected */}
        {activeCategory === 'all' && (
        <section className="mb-12">
          <div className="relative h-[300px] w-full rounded-2xl overflow-hidden bg-zinc-900 group">
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
              alt="Artistic overhead shot of gourmet roasted meats and vegetables"
              src={featuredBanner.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-4 right-4 flex flex-col items-start gap-3">
              <div className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-black tracking-widest rounded-full uppercase">
                {featuredBanner.badge}
              </div>
              <h2 className="text-2xl font-headline font-extrabold text-white leading-tight max-w-lg tracking-tighter">
                {featuredBanner.title}
              </h2>
              <p className="text-zinc-300 text-sm max-w-md font-body">
                {featuredBanner.description}
              </p>
              <Button
                onClick={handleOrderNow}
                className="mt-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
              >
                Order Now
              </Button>
            </div>
          </div>
        </section>
        )}

        {/* Popular Dishes Grid */}
        <section className="mb-12">
          <div className="flex flex-col mb-6 gap-4">
            <div>
              <span className="text-primary font-bold text-sm tracking-widest uppercase">
                Popular Now
              </span>
              <h3 className="text-2xl font-headline font-bold tracking-tighter mt-1">
                Curated Masterpieces
              </h3>
            </div>
            <button className="text-zinc-500 font-medium text-sm flex items-center gap-1 hover:text-primary transition-colors self-start">
              View gallery
              <MaterialIcon name="arrow_forward" className="text-lg" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {filteredDishes.length > 0 ? (
              filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="group relative flex flex-col"
                >
                  <div
                    onClick={() => handleProductClick(dish.id)}
                    className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-surface-container-low shadow-sm relative cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={dish.name}
                      src={dish.image}
                    />
                    {dish.trending && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-tertiary text-on-tertiary text-[10px] font-black tracking-widest rounded-full uppercase">
                        Trending
                      </div>
                    )}
                    {/* Veg/Non-Veg Indicator */}
                    <div
                      className={`absolute top-4 left-4 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10 ${
                        dish.isVeg ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleFavorite(dish)
                      }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-zinc-900 active:scale-90 transition-all z-10"
                    >
                      <MaterialIcon
                        name="favorite"
                        filled={isFavorite(dish.id)}
                        className={`text-xl ${isFavorite(dish.id) ? 'text-orange-600' : 'text-zinc-900'}`}
                      />
                    </button>
                  </div>
                  <div className="px-2 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4
                        onClick={() => handleProductClick(dish.id)}
                        className="text-lg font-headline font-bold text-on-surface tracking-tight cursor-pointer"
                      >
                        {dish.name}
                      </h4>
                      <span className="text-primary font-bold">£{dish.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500 text-xs">
                      <div className="flex items-center gap-1">
                        <MaterialIcon name="star" className="text-tertiary-container text-base" />
                        <span className="font-bold text-on-surface">{dish.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MaterialIcon name="schedule" className="text-base" />
                        <span>{dish.time}</span>
                      </div>
                    </div>
                    {getCartItemQuantity(dish.id) > 0 ? (
                      <div className="flex items-center justify-between bg-primary-container text-on-primary-container rounded-full px-1 py-1 w-36 shadow-inner mt-3 mx-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDecreaseQuantity(dish.id)
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors active:scale-90"
                        >
                          <MaterialIcon name="remove" className="text-lg" />
                        </button>
                        <span className="font-bold text-sm">{getCartItemQuantity(dish.id)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleIncreaseQuantity(dish)
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors active:scale-90"
                        >
                          <MaterialIcon name="add" className="text-lg" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(dish)
                        }}
                        className="w-full mt-3 bg-primary text-on-primary py-2 rounded-full font-bold text-sm active:scale-95 transition-all"
                      >
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
                  <MaterialIcon name="search_off" className="text-3xl text-secondary" />
                </div>
                <h4 className="text-lg font-headline font-bold text-on-surface mb-2">
                  No dishes found
                </h4>
                <p className="text-on-surface-variant text-sm">
                  {searchQuery.trim()
                    ? 'Try searching with different keywords'
                    : 'No items available in this category'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Bento Featured Section */}
        <section className="mt-20 grid grid-cols-1 gap-4">
          <div className="bg-secondary-container rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <span className="text-[10px] font-black tracking-widest text-on-secondary-container/60 uppercase">
                Chef's Special
              </span>
              <h3 className="text-2xl font-headline font-bold text-on-secondary-container mt-2 leading-tight tracking-tighter">
                Artisanal Sourdough Series
              </h3>
              <p className="text-on-secondary-container/80 mt-2 max-w-xs font-medium text-sm">
                Hand-kneaded, 48-hour fermented loaves from the valley's finest bakery.
              </p>
            </div>
            <img
              className="absolute -right-10 -bottom-10 w-48 h-48 object-cover rotate-12 opacity-80 group-hover:rotate-0 transition-transform duration-700"
              alt="Close up of rustic sourdough bread crust"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDteiGImM2XjHSAvoRnsK5PLu_-84nI9BMMQ-_WHygDLhZrYVD99BhzPZQ45Mpb2sF7Eb0FqJ86aJEnOVBFJ5Cyl_KL1437YU8rwwsgI4VamxuA9k0ReIiYCQo3uFZtHB_nQgQJD49UMPQcazZkrF-XaKb445xzSIlJa7qscHwk7gXojzPuU5x3CUF4YXADSqlWLoRoueSrUw9lDltUufnjNVOy1zGyc7jt1PuxAnwxxk6tU3eOWoAUxpnn4getKAmgrYF35GK6I7Y"
            />
            <Button className="relative z-10 self-start mt-4 bg-white text-secondary font-bold px-4 py-2 rounded-full shadow-sm text-sm">
              Explore Collection
            </Button>
          </div>
          <div className="bg-tertiary-fixed rounded-2xl p-6 flex items-center justify-between group overflow-hidden">
            <div className="flex-1">
              <h3 className="text-xl font-headline font-bold text-on-tertiary-fixed tracking-tight">
                Zero Waste Initiative
              </h3>
              <p className="text-on-tertiary-fixed/70 mt-2 text-xs">
                Every order helps plant a tree in the Amazon.
              </p>
            </div>
            <MaterialIcon name="eco" className="text-4xl text-on-tertiary-fixed/20 group-hover:scale-125 transition-transform" />
          </div>
          <div className="bg-surface-container-highest rounded-2xl p-6 flex flex-col justify-center items-center text-center gap-2">
            <MaterialIcon name="redeem" className="text-primary text-2xl" />
            <span className="font-bold text-on-surface text-sm">Gift a Meal</span>
            <p className="text-zinc-500 text-[10px] font-medium">
              Share the joy of food.
            </p>
          </div>
          <div className="bg-primary rounded-2xl p-6 flex flex-col justify-center items-center text-center gap-2 text-on-primary shadow-xl shadow-primary/20">
            <span className="text-2xl font-black font-headline">50%</span>
            <span className="font-bold text-[10px] tracking-widest uppercase">
              First Order
            </span>
            <p className="text-on-primary/80 text-[10px]">CODE: CULINARY</p>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-xl flex justify-around items-center px-4 pb-safe z-50 rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
        <div
          onClick={() => router.push('/user/home')}
          className="flex flex-col items-center justify-center text-primary font-bold scale-110 transition-transform cursor-pointer"
        >
          <MaterialIcon name="home" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Home</span>
        </div>
        <div
          onClick={() => router.push('/user/menu')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="shopping_bag" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Shop</span>
        </div>
        <div
          onClick={() => router.push('/user/orders')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="receipt_long" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Orders</span>
        </div>
        <div
          onClick={() => router.push('/user/notifications')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="notifications" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Notifications</span>
        </div>
        <div
          onClick={() => router.push('/user/profile')}
          className="flex flex-col items-center justify-center text-zinc-400 hover:text-primary active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <MaterialIcon name="person_outline" className="text-2xl" />
          <span className="font-body text-[10px] font-medium tracking-wide">Profile</span>
        </div>
      </nav>

      {/* Floating Dynamic Cart */}
      <div
        onClick={handleCartClick}
        className="fixed bottom-24 right-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 flex items-center justify-between group cursor-pointer active:scale-95 transition-all z-40"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary-container shadow-lg shadow-primary/20">
            <MaterialIcon name="shopping_basket" className="text-xl" />
          </div>
          <div>
            <p className="font-headline font-bold text-on-surface text-sm">
              {getTotalItems()} items added
            </p>
            <p className="text-zinc-500 text-[10px] font-medium">
              Checkout from Harvest Kitchen
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-headline font-bold text-primary text-sm">
            £{getTotalPrice().toFixed(2)}
          </span>
          <MaterialIcon name="chevron_right" className="text-zinc-400 text-xl" />
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
