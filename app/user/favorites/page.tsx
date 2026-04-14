'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MaterialIcon } from '@/components/MaterialIcon'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'
import { useFavorites } from '@/lib/favorites/store'
import { useCart } from '@/lib/cart/store'

export default function FavoritesPage() {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  const { items: favorites, removeFavorite } = useFavorites()
  const { items: cartItems, addItem, removeItem, updateQuantity } = useCart()

  const getItemQuantity = (itemId: string) => {
    const item = cartItems.find(i => i.id === itemId)
    return item ? item.quantity : 0
  }

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      isVeg: item.isVeg,
      description: item.description,
      discount: item.discount,
    })
  }

  const handleRemoveFromCart = (itemId: string) => {
    const item = cartItems.find(i => i.id === itemId)
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1)
    } else {
      removeItem(itemId)
    }
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-32 md:pb-8">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={openDrawer} className="text-zinc-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <MaterialIcon name="menu" className="text-2xl" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-lg sm:text-xl text-primary">
              Favorites
            </h1>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="font-headline font-extrabold text-3xl tracking-tight mb-2">Your Favorites</h2>
          <p className="text-on-surface-variant text-sm">Your saved dishes for quick ordering.</p>
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center">
                <MaterialIcon name="favorite_border" className="text-4xl text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold text-on-surface mb-2">
                  No favorites yet
                </h3>
                <p className="text-zinc-500 mb-6">
                  Start adding your favorite dishes to see them here
                </p>
                <Button
                  onClick={() => router.push('/user/menu')}
                  className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold"
                >
                  Browse Menu
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          /* Favorites List */
          <div className="space-y-4">
            {favorites.map((item) => {
              const quantity = getItemQuantity(item.id)
              return (
                <Card key={item.id} className="p-4 sm:p-5">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-surface-container-low relative">
                      <img
                        className="w-full h-full object-cover"
                        alt={item.name}
                        src={item.image}
                      />
                      {/* Veg/Non-Veg Indicator */}
                      <div
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10 ${
                          item.isVeg ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-headline font-bold text-base text-on-surface leading-tight">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFavorite(item.id)}
                            className="text-error hover:opacity-80 transition-opacity"
                            aria-label="Remove from favorites"
                          >
                            <MaterialIcon name="delete" className="text-xl" />
                          </button>
                        </div>
                        <p className="text-on-surface-variant text-sm line-clamp-2 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-3 text-zinc-500 text-xs">
                          <div className="flex items-center gap-1">
                            <MaterialIcon name="star" className="text-tertiary-container text-base" />
                            <span className="font-bold text-on-surface">{item.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MaterialIcon name="schedule" className="text-base" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-headline font-bold text-primary text-lg">
                          £{item.price.toFixed(2)}
                        </span>
                        {quantity > 0 ? (
                          <div className="flex items-center justify-between bg-primary-container text-on-primary-container rounded-full px-1 py-1 w-32 shadow-inner">
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors active:scale-90"
                            >
                              <MaterialIcon name="remove" className="text-lg" />
                            </button>
                            <span className="font-bold text-sm">{quantity}</span>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors active:scale-90"
                            >
                              <MaterialIcon name="add" className="text-lg" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold"
                          >
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
