'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FavoritesRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/user/favorites')
  }, [router])

  return null
}
