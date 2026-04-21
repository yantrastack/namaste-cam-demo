'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Playfair_Display } from 'next/font/google'
import { MaterialIcon } from '@/components/MaterialIcon'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'
import { useCart } from '@/lib/cart/store'
import { heritageCategories, heritageMenuItems, type HeritageMenuItem } from './menuData'
import styles from './HeritageMenuExperience.module.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400'],
  variable: '--font-hj-playfair',
})

type GridColumns = 1 | 2

export default function HeritageMenuExperience({ gridColumns }: { gridColumns: GridColumns }) {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  const { items, addItem, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart()
  const [activeCategory, setActiveCategory] = useState<string>('All Dishes')
  const [meal, setMeal] = useState<'lunch' | 'dinner'>('lunch')

  const handleAddToCart = (item: HeritageMenuItem) => {
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
    const row = items.find((i) => i.id === itemId)
    if (row && row.quantity > 1) {
      updateQuantity(itemId, row.quantity - 1)
    } else {
      removeItem(itemId)
    }
  }

  const getItemQuantity = (itemId: string) => {
    const row = items.find((i) => i.id === itemId)
    return row ? row.quantity : 0
  }

  const totalItems = getTotalItems()
  const cartTotal = getTotalPrice()

  const filteredItems =
    activeCategory === 'All Dishes'
      ? heritageMenuItems
      : heritageMenuItems.filter((item) => item.category === activeCategory)

  const isCompact = gridColumns === 2

  return (
    <div className={`${styles.root} ${playfair.variable}`}>
      <header className={`user-app-fixed-frame ${styles.headerBar}`}>
        <button type="button" className={styles.menuBtn} onClick={openDrawer} aria-label="Open menu">
          <MaterialIcon name="menu" className="!text-xl" style={{ color: 'var(--hj-ink)' }} />
        </button>
        <div className="flex flex-col items-center text-center">
          <span className={styles.wordmarkNamaste}>Namaste</span>
          <span className={styles.wordmarkCambridge}>Cambridge</span>
        </div>
        <button
          type="button"
          className={styles.avatarWrap}
          onClick={() => router.push('/user/profile')}
          aria-label="Profile"
        >
          <img
            className={styles.avatar}
            alt=""
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXFnLzVVhUq11P95jUmmneyhTJd9NUJq2pBpLde_xqLC6NQbiRzX2tVLRFqvzIxJdh5pBXTDfLIX45Gpbg0OaCvG06csqlY9t8bSPQzN4H02qBgd180vz7nJ11EukD-J34N7VHZxgTpwFxnk92FAKPmuBbNE_GyHtpA-fWN6qN717WWfGnQ6IS7LwSfA1PCCmpN1Fc2yFly1j4ihEXkGDwtKlgYzl-xm2nJyBcANt8RLamn2DAiHi55OX9frjhcNHrsbadk1-XJpM"
          />
          <span className={styles.avatarBadge} aria-hidden />
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.heroSketch} aria-hidden="true">
          <img
            className={styles.heroSketchImg}
            alt=""
            src="/menu-bg.png"
          />
          <img
            className={styles.heroSketchSmoke}
            alt=""
            src="/heritage-smoke-overlay.svg"
          />
          <div className={styles.heroSketchOverlay} />
          <div className={styles.heroSketchCaption}>
            <span className={styles.heroSketchEyebrow}>A Taste of</span>
            <span className={styles.heroSketchTitle}>Cambridge Sketched in Spice</span>
          </div>
        </div>

        <h1 className={styles.pageTitle}>Explore Menu</h1>
        <p className={styles.tagline}>Authentic Indian Flavors Curated for Cambridge</p>

        <div className={styles.mealRow}>
          <button
            type="button"
            className={`${styles.mealTile} ${styles.mealTileLunch} ${meal === 'lunch' ? styles.mealTileActive : styles.mealTileInactive}`}
            onClick={() => setMeal('lunch')}
          >
            <span className={styles.mealTileInner}>
              <span className={styles.mealLabelSide}>
                <span className={styles.mealLabel}>Lunch</span>
              </span>
              <img
                className={styles.mealPhoto}
                alt=""
                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&q=80"
              />
            </span>
          </button>
          <button
            type="button"
            className={`${styles.mealTile} ${styles.mealTileDinner} ${meal === 'dinner' ? styles.mealTileActive : styles.mealTileInactive}`}
            onClick={() => setMeal('dinner')}
          >
            <span className={styles.mealTileInner}>
              <span className={styles.mealLabelSide}>
                <span className={styles.mealLabel}>Dinner</span>
              </span>
              <img
                className={styles.mealPhoto}
                alt=""
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80"
              />
            </span>
          </button>
        </div>

        <div className={styles.pillStrip}>
          {heritageCategories.map((cat) => {
            const active = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryPill} ${active ? styles.categoryPillActive : styles.categoryPillInactive}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <img className={styles.pillThumb} alt="" src={cat.thumb} />
                {cat.label}
              </button>
            )
          })}
        </div>

        <div className={gridColumns === 1 ? styles.grid1 : styles.grid2}>
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id)
            return (
              <article
                key={item.id}
                className={`${styles.card} ${quantity > 0 ? styles.cardInCart : ''}`}
              >
                {item.discount ? <div className={styles.discountRibbon}>{item.discount}</div> : null}
                {isCompact ? (
                  <div className={styles.cardCol}>
                    <div className={`${styles.imageBlock} ${styles.imageBlockGrid2}`}>
                      <img className={styles.productImg} alt="" src={item.image} />
                      <span
                        className={`${styles.dietSquare} ${item.isVegetarian ? styles.dietVeg : styles.dietNonVeg}`}
                        title={item.isVegetarian ? 'Vegetarian' : 'Non-vegetarian'}
                      />
                      {item.dietary && item.dietary.length > 0 ? (
                        <span className={styles.infoBtn} title={item.dietary.join(', ')}>
                          <MaterialIcon name="info" className="!text-base" />
                        </span>
                      ) : null}
                    </div>
                    <div className={`${styles.cardBody} ${styles.cardBodyGrid2}`}>
                      <h2 className={`${styles.productTitle} ${styles.productTitleSm}`}>{item.name}</h2>
                      <p className={`${styles.desc} ${styles.descSm}`}>{item.description}</p>
                      <div className={styles.priceRow}>
                        <span className={`${styles.price} ${styles.priceSm}`}>£{item.price.toFixed(2)}</span>
                        {item.originalPrice ? (
                          <span className={styles.wasPrice}>£{item.originalPrice.toFixed(2)}</span>
                        ) : null}
                      </div>
                      {quantity > 0 ? (
                        <div className={styles.qtyPill}>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => handleRemoveFromCart(item.id)}
                            aria-label="Decrease quantity"
                          >
                            <MaterialIcon name="remove" className="!text-lg" />
                          </button>
                          <span className={styles.qtyNum}>{quantity}</span>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => handleAddToCart(item)}
                            aria-label="Increase quantity"
                          >
                            <MaterialIcon name="add" className="!text-lg" />
                          </button>
                        </div>
                      ) : (
                        <button type="button" className={styles.addPill} onClick={() => handleAddToCart(item)}>
                          <MaterialIcon name="add" className="!text-lg" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.cardRow}>
                    <div className={styles.imageBlock}>
                      <img className={styles.productImg} alt="" src={item.image} />
                      <span
                        className={`${styles.dietSquare} ${item.isVegetarian ? styles.dietVeg : styles.dietNonVeg}`}
                        title={item.isVegetarian ? 'Vegetarian' : 'Non-vegetarian'}
                      />
                    </div>
                    <div className={styles.cardBody}>
                      <div className="flex items-start justify-between gap-2">
                        <h2 className={styles.productTitle}>{item.name}</h2>
                        {item.dietary && item.dietary.length > 0 ? (
                          <span className="shrink-0 pt-0.5" title={item.dietary.join(', ')}>
                            <MaterialIcon
                              name="info"
                              className={`!text-xl cursor-help ${styles.cardRowInfoIcon}`}
                            />
                          </span>
                        ) : null}
                      </div>
                      <p className={styles.desc}>{item.description}</p>
                      <div className={styles.priceRow}>
                        <span className={styles.price}>£{item.price.toFixed(2)}</span>
                        {item.originalPrice ? (
                          <span className={styles.wasPrice}>£{item.originalPrice.toFixed(2)}</span>
                        ) : null}
                      </div>
                      {quantity > 0 ? (
                        <div className={styles.qtyPill}>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => handleRemoveFromCart(item.id)}
                            aria-label="Decrease quantity"
                          >
                            <MaterialIcon name="remove" className="!text-lg" />
                          </button>
                          <span className={styles.qtyNum}>{quantity}</span>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => handleAddToCart(item)}
                            aria-label="Increase quantity"
                          >
                            <MaterialIcon name="add" className="!text-lg" />
                          </button>
                        </div>
                      ) : (
                        <button type="button" className={styles.addPill} onClick={() => handleAddToCart(item)}>
                          <MaterialIcon name="add" className="!text-lg" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </main>

      {totalItems > 0 ? (
        <div
          className={`user-app-fixed-frame ${styles.floatingCart}`}
          onClick={() => router.push('/user/cart')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              router.push('/user/cart')
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-3">
            <div className={styles.cartBadge}>{totalItems}</div>
            <div>
              <p className={styles.cartMetaLabel}>
                {totalItems} item{totalItems !== 1 ? 's' : ''} added
              </p>
              <p className={styles.cartMetaPrice}>£{cartTotal.toFixed(2)} plus taxes</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.viewCartBtn}
            onClick={(e) => {
              e.stopPropagation()
              router.push('/user/cart')
            }}
          >
            VIEW CART
            <MaterialIcon name="arrow_forward_ios" className="!text-xs" />
          </button>
        </div>
      ) : null}

      <nav className={`user-app-fixed-frame ${styles.bottomNav}`}>
        <button type="button" className={styles.navItem} onClick={() => router.push('/user/home')}>
          <MaterialIcon name="home" className="!text-2xl" />
          <span className={styles.navLabel}>Home</span>
        </button>
        <button type="button" className={`${styles.navItem} ${styles.navPill} ${styles.navItemActive}`}>
          <MaterialIcon name="restaurant_menu" className="!text-2xl" filled />
          <span className={styles.navLabel}>Menu</span>
        </button>
        <button type="button" className={styles.navItem} onClick={() => router.push('/user/orders')}>
          <MaterialIcon name="receipt_long" className="!text-2xl" />
          <span className={styles.navLabel}>Orders</span>
        </button>
        <button type="button" className={styles.navItem} onClick={() => router.push('/user/notifications')}>
          <MaterialIcon name="notifications" className="!text-2xl" />
          <span className={styles.navLabel}>Alerts</span>
        </button>
        <button type="button" className={styles.navItem} onClick={() => router.push('/user/profile')}>
          <MaterialIcon name="person" className="!text-2xl" />
          <span className={styles.navLabel}>Profile</span>
        </button>
      </nav>
    </div>
  )
}
