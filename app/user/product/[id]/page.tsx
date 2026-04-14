'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'
import { dishes } from '../../data/dummy-data'
import { useCart } from '@/lib/cart/store'

const baseOptions = [
  { id: 'quinoa', name: 'Tri-Color Quinoa', price: 0 },
  { id: 'rice', name: 'Wild Forbidden Rice', price: 2.50 },
  { id: 'couscous', name: 'Pearl Couscous', price: 1.50 }
]

const addonOptions = [
  { id: 'salmon', name: 'Extra Smoked Salmon', price: 8.00 },
  { id: 'avocado', name: 'Avocado Mousse', price: 3.50 },
  { id: 'egg', name: 'Poached Organic Egg', price: 3.00 },
  { id: 'cheese', name: 'Feta Cheese Crumble', price: 2.00 }
]

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const product = dishes.find(d => d.id === productId) || dishes[0]
  
  const [quantity, setQuantity] = useState(1)
  const [selectedBase, setSelectedBase] = useState('quinoa')
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)

  const basePrice = product.price
  const baseOptionPrice = baseOptions.find(opt => opt.id === selectedBase)?.price || 0
  const addonsPrice = addonOptions
    .filter(opt => selectedAddons.has(opt.id))
    .reduce((sum, opt) => sum + opt.price, 0)
  
  const totalPrice = (basePrice + baseOptionPrice + addonsPrice) * quantity

  const { addItem } = useCart()

  const handleAddToCart = () => {
    const baseOptionName = baseOptions.find(opt => opt.id === selectedBase)?.name || ''
    const addonNames = addonOptions
      .filter(opt => selectedAddons.has(opt.id))
      .map(opt => opt.name)
      .join(', ')
    
    const itemName = addonNames 
      ? `${product.name} (${baseOptionName}, ${addonNames})`
      : `${product.name} (${baseOptionName})`

    addItem({
      id: product.id,
      name: itemName,
      price: totalPrice / quantity,
      image: product.image,
    })

    router.push('/user/cart')
  }

  const toggleAddon = (addonId: string) => {
    const newAddons = new Set(selectedAddons)
    if (newAddons.has(addonId)) {
      newAddons.delete(addonId)
    } else {
      newAddons.add(addonId)
    }
    setSelectedAddons(newAddons)
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-transparent">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest/80 backdrop-blur shadow-sm active:scale-95 transition-all text-on-surface"
          >
            <MaterialIcon name="arrow_back" />
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest/80 backdrop-blur shadow-sm active:scale-95 transition-all text-on-surface"
            >
              <MaterialIcon
                name="favorite"
                filled={isFavorite}
                className={`${isFavorite ? 'text-orange-600' : 'text-on-surface'}`}
              />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest/80 backdrop-blur shadow-sm active:scale-95 transition-all text-on-surface">
              <MaterialIcon name="share" />
            </button>
          </div>
        </div>
      </header>

      <main className="pb-32">
        {/* Hero Section */}
        <section className="relative h-[397px] w-full overflow-hidden">
          <img
            alt={product.name}
            className="w-full h-full object-cover"
            src={product.image}
          />
          {/* Veg/Non-Veg Indicator */}
          <div
            className={`absolute top-20 right-6 w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10 ${
              product.isVeg ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        </section>

        {/* Product Details Canvas */}
        <article className="px-6 -mt-12 relative z-10">
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 shadow-sm">
            {/* Header Info */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {product.badge && (
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {product.badge}
                    </span>
                  )}
                  <div className="flex items-center text-primary font-bold text-sm">
                    <MaterialIcon name="star" className="text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }} />
                    {product.rating}
                  </div>
                </div>
                <h1 className="font-headline font-extrabold text-2xl md:text-3xl tracking-tight text-on-surface leading-none mb-2">
                  {product.name}
                </h1>
                <p className="text-secondary font-medium text-sm">
                  {product.category} • {product.time}
                </p>
              </div>
              <div className="text-right">
                <span className="font-headline font-bold text-2xl text-primary">
                  £{basePrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Curator's Note</h2>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* Customization Sections */}
            <div className="mt-10 space-y-8">
              {/* Variant Selection */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="font-headline font-bold text-lg text-on-surface">Choose Base</h2>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-surface-container-low px-2 py-1 rounded">
                    Required
                  </span>
                </div>
                <div className="space-y-3">
                  {baseOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors border ${
                        selectedBase === option.id
                          ? 'border-primary/20 bg-white'
                          : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="base"
                          checked={selectedBase === option.id}
                          onChange={() => setSelectedBase(option.id)}
                          className="w-5 h-5 text-primary focus:ring-primary border-outline-variant bg-white"
                        />
                        <span className="font-medium text-on-surface">{option.name}</span>
                      </div>
                      <span className="text-xs text-secondary font-medium">
                        {option.price > 0 ? `+ £{option.price.toFixed(2)}` : '+ £0.00'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add-ons Selection */}
              <div>
                <h2 className="font-headline font-bold text-lg text-on-surface mb-4">Enhance Your Bowl</h2>
                <div className="grid grid-cols-1 gap-3">
                  {addonOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddons.has(option.id)}
                          onChange={() => toggleAddon(option.id)}
                          className="w-5 h-5 rounded-md text-primary focus:ring-primary border-outline-variant bg-white"
                        />
                        <span className="font-medium text-on-surface">{option.name}</span>
                      </div>
                      <span className="text-xs font-bold text-primary">
                        + £{option.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <h2 className="font-headline font-bold text-lg text-on-surface mb-4">Special Requests</h2>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 min-h-[100px] placeholder:text-zinc-400 outline-none resize-none"
                  placeholder="Any allergies or dietary preferences?"
                />
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full p-6 z-50">
        <div className="max-w-2xl mx-auto bg-surface-container-lowest/80 backdrop-blur-xl rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center bg-surface-container-high rounded-full p-1 h-14">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 flex items-center justify-center rounded-full text-on-surface active:scale-90 transition-transform"
            >
              <MaterialIcon name="remove" />
            </button>
            <span className="w-8 text-center font-headline font-bold text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 flex items-center justify-center rounded-full text-on-surface active:scale-90 transition-transform"
            >
              <MaterialIcon name="add" />
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 h-14 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-headline font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          >
            Add to Cart
            <span className="w-1 h-1 rounded-full bg-white/30" />
            £{totalPrice.toFixed(2)}
          </button>
        </div>
      </footer>

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
