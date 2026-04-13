'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface FavoriteItem {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  time: string
  isVeg: boolean
  discount?: string
  mealType?: string[]
}

interface FavoritesContextType {
  items: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  toggleFavorite: (item: FavoriteItem) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setItems(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(items))
  }, [items])

  const addFavorite = (item: FavoriteItem) => {
    const existingItem = items.find((i) => i.id === item.id)
    if (!existingItem) {
      setItems([...items, item])
    }
  }

  const removeFavorite = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const toggleFavorite = (item: FavoriteItem) => {
    const existingItem = items.find((i) => i.id === item.id)
    if (existingItem) {
      removeFavorite(item.id)
    } else {
      addFavorite(item)
    }
  }

  const isFavorite = (id: string) => {
    return items.some((i) => i.id === id)
  }

  const clearFavorites = () => {
    setItems([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        items,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
