'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'
import { dishes } from '../../data/dummy-data'
import { useCart } from '@/lib/cart/store'
import { cn } from '@/lib/cn'

const SPICY_LABELS = ['Mild', 'Warm', 'Medium', 'Hot', 'Extra hot'] as const

const sizeOptions = [
  { id: 'small', name: 'Small', description: 'Light portion', price: 0 },
  { id: 'medium', name: 'Medium', description: 'Regular portion', price: 2.00 },
  { id: 'large', name: 'Large', description: 'Extra hungry', price: 4.50 }
] as const

const addonOptions = [
  { id: 'salmon', name: 'Extra Smoked Salmon', price: 8.00 },
  { id: 'avocado', name: 'Avocado Mousse', price: 3.50 },
  { id: 'egg', name: 'Poached Organic Egg', price: 3.00 },
  { id: 'cheese', name: 'Feta Cheese Crumble', price: 2.00 }
]

/** Layer_1 chilli SVG (asset colours); size via `className` (e.g. size-7). */
function ChilliIcon({ active, className }: { active: boolean; className?: string }) {
  return (
    <svg
      className={cn('shrink-0 transition-opacity duration-300', !active && 'opacity-40', className)}
      viewBox="0 0 122.88 96.06"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <style>
          {`
            .product-detail-chilli-asset__a { fill: #1a1a1a; }
            .product-detail-chilli-asset__0 { fill: #84d10f; }
            .product-detail-chilli-asset__1 { fill: #50ac25; }
            .product-detail-chilli-asset__2 { fill: #d60606; }
            .product-detail-chilli-asset__3 { fill: #ba0808; }
          `}
        </style>
      </defs>
      <g>
        <path
          className="product-detail-chilli-asset__a"
          d="M108.12,40.6c-4.15,19.28-20.03,35.73-38.39,45.57c-9.26,4.97-19.16,8.27-28.51,9.43c-9.46,1.17-18.4,0.16-25.61-3.54 C7.95,88.13,2.28,81.24,0.03,70.8l0,0c-0.08-0.38-0.02-0.78,0.19-1.14c0.45-0.76,1.43-1.02,2.19-0.57 c29.93,17.64,47.03-0.12,57.67-18.17c3.07-5.22,5.64-10.51,7.83-15.01c2.48-5.12,4.48-9.24,6.36-11.37 c-2.29-1.21-4.35-2.83-6.23-4.79c-0.61-0.64-0.58-1.66,0.06-2.27c0.51-0.49,1.26-0.57,1.85-0.26c2.23,1.15,4.25,1.63,6.08,1.55 c1.79-0.08,3.43-0.71,4.96-1.79c1.35-0.95,2.49-1.92,3.5-2.78c4.15-3.51,6.26-5.3,14.35-1.81c3.44-4.97,6.96-8.85,10.62-10.85 c4.21-2.3,8.48-2.19,12.84,1.39c0.68,0.56,0.78,1.57,0.22,2.25c-0.56,0.68-1.57,0.78-2.25,0.22c-3.18-2.61-6.26-2.7-9.28-1.05 c-3.05,1.67-6.12,5.04-9.2,9.42c5.82,3.02,7.09,8.39,8.2,13.08c0.55,2.33,1.06,4.47,2.07,5.74c0.34,0.43,0.73,0.74,1.17,0.94 c0.46,0.2,1,0.29,1.62,0.25c0.88-0.05,1.64,0.62,1.69,1.51c0.03,0.54-0.21,1.04-0.61,1.36C113.2,39.08,110.59,40.44,108.12,40.6 L108.12,40.6L108.12,40.6z"
        />
        <path
          className="product-detail-chilli-asset__0"
          d="M78.4,22.83c3.03,1.03,6.48,1.3,10.42,0.65c0.07-0.02,0.14-0.03,0.22-0.03c0.88-0.08,1.66,0.58,1.74,1.46 c0.24,2.82-0.21,5.13-1.28,6.98c-0.41,0.7-0.9,1.33-1.47,1.89c1.45,0.12,2.78-0.02,4.02-0.42c2.2-0.7,4.12-2.2,5.8-4.45l0,0 c0.18-0.24,0.43-0.44,0.73-0.55c0.83-0.3,1.75,0.12,2.06,0.95c1.73,4.71,3.69,7.24,5.84,7.9c1.42,0.43,3.04,0.04,4.85-1.09 c-0.68-0.4-1.27-0.92-1.79-1.57c-1.46-1.83-2.04-4.3-2.68-6.99c-0.97-4.1-2.08-8.8-6.83-11.11c-8.41-4.11-10-2.76-13.47,0.17 c-1.02,0.86-2.18,1.84-3.73,2.94c-1.99,1.41-4.16,2.24-6.54,2.38C76.96,22.29,77.67,22.59,78.4,22.83L78.4,22.83L78.4,22.83z"
        />
        <path
          className="product-detail-chilli-asset__1"
          d="M100.03,28.54c0.27,0.18,0.48,0.44,0.61,0.77c1.73,4.71,3.69,7.24,5.84,7.9c1.42,0.43,3.04,0.04,4.85-1.09 c-0.68-0.4-1.27-0.92-1.79-1.57c-1.46-1.83-2.04-4.3-2.68-6.99c-0.97-4.1-2.08-8.8-6.82-11.11V28.54L100.03,28.54z"
        />
        <path
          className="product-detail-chilli-asset__2"
          d="M77.47,25.9c-0.08,0.09-0.17,0.17-0.27,0.25c-1.54,1.12-3.66,5.48-6.41,11.14c-2.2,4.53-4.79,9.87-7.95,15.24 c-11,18.66-28.49,37-58.71,21.17c2.43,7.42,7.02,12.48,12.94,15.52c6.6,3.39,14.9,4.3,23.76,3.2c8.97-1.11,18.48-4.29,27.38-9.07 c17.57-9.43,32.76-25.05,36.73-43.26c-2.41-0.97-4.53-3.31-6.31-7.17c-1.67,1.68-3.54,2.86-5.63,3.52c-2.85,0.9-6.05,0.8-9.63-0.38 c-0.84-0.28-1.29-1.18-1.02-2.02c0.15-0.47,0.51-0.82,0.93-0.99v-0.01c1.56-0.62,2.72-1.52,3.43-2.75c0.53-0.92,0.84-2.05,0.9-3.41 C83.88,27.28,80.51,26.92,77.47,25.9L77.47,25.9L77.47,25.9z"
        />
        <path
          className="product-detail-chilli-asset__3"
          d="M58.64,67.63c0.39-0.79,1.35-1.12,2.14-0.73c0.79,0.39,1.12,1.35,0.73,2.14C59.86,72.4,55,76.63,49.65,79.92 c-5.14,3.15-10.84,5.51-14.74,5.46c-0.88-0.01-1.59-0.74-1.58-1.62c0.01-0.88,0.74-1.59,1.62-1.58c3.27,0.04,8.34-2.11,13.03-4.99 C52.89,74.18,57.26,70.44,58.64,67.63L58.64,67.63L58.64,67.63z"
        />
      </g>
    </svg>
  )
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const product = dishes.find(d => d.id === productId) || dishes[0]

  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>('medium')
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
  const [spicyLevel, setSpicyLevel] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [spiceAnimKey, setSpiceAnimKey] = useState(0)

  const selectSpicyLevel = (level: number) => {
    if (level === spicyLevel) return
    setSpicyLevel(level)
    setSpiceAnimKey((k) => k + 1)
  }

  const basePrice = product.price
  const sizeOptionPrice = sizeOptions.find(opt => opt.id === selectedSize)?.price ?? 0
  const addonsPrice = addonOptions
    .filter(opt => selectedAddons.has(opt.id))
    .reduce((sum, opt) => sum + opt.price, 0)

  const totalPrice = (basePrice + sizeOptionPrice + addonsPrice) * quantity

  const { addItem } = useCart()

  const handleAddToCart = () => {
    const sizeLabel = sizeOptions.find(opt => opt.id === selectedSize)?.name || ''
    const addonNames = addonOptions
      .filter(opt => selectedAddons.has(opt.id))
      .map(opt => opt.name)
      .join(', ')

    const spiceLabel = SPICY_LABELS[spicyLevel - 1]
    const spicePart = `Spice: ${spiceLabel}`
    const itemName = addonNames
      ? `${product.name} (${sizeLabel}, ${spicePart}, ${addonNames})`
      : `${product.name} (${sizeLabel}, ${spicePart})`

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
              <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Curator&apos;s Note</h2>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* Customization Sections */}
            <div className="mt-10 space-y-6">
              {/* Variant Selection */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <h2 className="font-headline font-bold text-base text-on-surface">Choose size</h2>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-surface-container-low px-2 py-0.5 rounded">
                    Required
                  </span>
                </div>
                <div className="space-y-2">
                  {sizeOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors border ${
                        selectedSize === option.id
                          ? 'border-primary/20 bg-white'
                          : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="radio"
                          name="size"
                          checked={selectedSize === option.id}
                          onChange={() => setSelectedSize(option.id)}
                          className="h-4 w-4 shrink-0 accent-primary border-outline-variant bg-white focus:ring-2 focus:ring-primary/30 focus:ring-offset-0"
                        />
                        <div className="min-w-0 leading-tight">
                          <span className="font-medium text-on-surface block text-sm">{option.name}</span>
                          <span className="text-secondary font-medium text-xs">{option.description}</span>
                        </div>
                      </div>
                      <span className="text-secondary font-medium shrink-0 tabular-nums text-xs">
                        {option.price > 0 ? `+ £${option.price.toFixed(2)}` : '+ £0.00'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add-ons Selection */}
              <div>
                <h2 className="font-headline font-bold text-base text-on-surface mb-3">Enhance Your Bowl</h2>
                <div className="grid grid-cols-1 gap-3">
                  {addonOptions.map((option) => {
                    const checked = selectedAddons.has(option.id)
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          'flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors',
                          checked
                            ? 'border-primary/25 bg-white shadow-sm'
                            : 'border-transparent bg-surface-container-low hover:bg-surface-container-high'
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center">
                            <input
                              type="checkbox"
                              className="peer absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                              checked={checked}
                              onChange={() => toggleAddon(option.id)}
                            />
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-0 rounded-md border-2 border-outline-variant bg-white transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary"
                            />
                            <MaterialIcon
                              name="check"
                              filled
                              className="pointer-events-none relative z-10 text-lg leading-none text-on-primary opacity-0 scale-50 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100"
                            />
                          </div>
                          <span className="truncate font-medium text-on-surface text-base">{option.name}</span>
                        </div>
                        <span className="shrink-0 font-bold text-primary tabular-nums text-sm">
                          {`+ £${option.price.toFixed(2)}`}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Spice level */}
              <div>
                <h2 className="font-headline font-bold text-base text-on-surface mb-1">Spice level</h2>
                <p className="mb-3 text-secondary text-xs">Tap a chilli to set heat (1 is mildest, 5 is hottest).</p>
                <div
                  key={spiceAnimKey}
                  className={cn(
                    'rounded-xl border border-transparent bg-surface-container-low px-3 py-3 sm:px-4',
                    spiceAnimKey > 0 && 'product-detail-spice-row-anim'
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center justify-center gap-0.5 sm:justify-start sm:gap-1">
                      {[1, 2, 3, 4, 5].map((level) => {
                        const active = level <= spicyLevel
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => selectSpicyLevel(level)}
                            aria-pressed={spicyLevel === level}
                            aria-label={`Spice level ${level} of 5, ${SPICY_LABELS[level - 1]}`}
                            className={cn(
                              'product-detail-chilli-btn flex flex-col items-center rounded-lg p-1.5 transition-transform active:scale-95',
                              spicyLevel === level && 'bg-primary/5 ring-1 ring-primary/15'
                            )}
                          >
                            <span
                              className={cn(
                                'product-detail-chilli-icon flex items-center justify-center transition-all duration-300',
                                active ? 'text-primary' : 'text-outline-variant',
                                spicyLevel === level && 'scale-110'
                              )}
                              aria-hidden
                            >
                              <ChilliIcon className="size-7 sm:size-8" active={active} />
                            </span>
                            <span className="mt-0.5 font-medium text-secondary text-[10px] tabular-nums">
                              {level}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex justify-center sm:justify-end">
                      <span className="rounded-full bg-primary/10 px-3 py-1.5 font-headline font-semibold text-primary text-sm">
                        {SPICY_LABELS[spicyLevel - 1]}
                      </span>
                    </div>
                  </div>
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

        @keyframes product-detail-spice-row {
          0% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-3px);
          }
          55% {
            transform: translateY(1px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .product-detail-spice-row-anim {
          animation: product-detail-spice-row 0.48s ease-out;
        }

        @keyframes product-detail-chilli-wiggle {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          22% {
            transform: rotate(-9deg) scale(1.06);
          }
          55% {
            transform: rotate(8deg) scale(1.04);
          }
        }

        .product-detail-chilli-btn:hover .product-detail-chilli-icon {
          animation: product-detail-chilli-wiggle 0.45s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .product-detail-spice-row-anim,
          .product-detail-chilli-btn:hover .product-detail-chilli-icon {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
