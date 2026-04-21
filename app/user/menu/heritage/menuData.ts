export interface HeritageMenuItem {
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

export const heritageMenuItems: HeritageMenuItem[] = [
  {
    id: '1',
    name: 'Old Delhi Butter Chicken',
    description:
      'Tandoori-grilled chicken thighs simmered in a rich, creamy tomato and fenugreek sauce.',
    price: 14.5,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600',
    category: 'Tandoori',
    rating: 4.8,
    time: '25-35 min',
    dietary: ['Dairy', 'Nuts'],
    isVegetarian: false,
  },
  {
    id: '2',
    name: 'Royal Hyderabadi Biryani',
    description:
      'Slow-cooked tender lamb chunks layered with aromatic long-grain basmati rice and spices.',
    price: 12.75,
    originalPrice: 15.0,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
    category: 'Biryani',
    rating: 4.9,
    time: '30-40 min',
    dietary: ['Gluten Free'],
    isVegetarian: false,
    discount: "Chef's Choice • 15% OFF",
  },
  {
    id: '3',
    name: 'Paneer Tikka Salad',
    description:
      'Chargrilled paneer cubes tossed with garden fresh greens and zesty mint vinaigrette.',
    price: 10.95,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    category: 'Sides',
    rating: 4.6,
    time: '15-20 min',
    dietary: [],
    isVegetarian: true,
  },
  {
    id: '4',
    name: 'Garlic & Cilantro Naan',
    description:
      'Freshly baked in our clay oven, brushed with garlic butter and fresh cilantro.',
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600',
    category: 'Sides',
    rating: 4.7,
    time: '10-15 min',
    dietary: ['Dairy'],
    isVegetarian: true,
  },
]

export const heritageCategories = [
  { id: 'All Dishes', label: 'All Dishes', thumb: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80' },
  { id: 'Tandoori', label: 'Tandoori', thumb: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=80' },
  { id: 'Curries', label: 'Curries', thumb: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80' },
  { id: 'Biryani', label: 'Biryani', thumb: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=80' },
  { id: 'Sides', label: 'Sides', thumb: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80' },
] as const
