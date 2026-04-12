export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  restaurant: string
  image: string
  items: OrderItem[]
  total: number
  status: string
  statusTone: string
  time: string
  date: string
  location: string
  paymentMethod: string
  address: string
  city: string
  contactName: string
  contactPhone: string
  deliveryPerson: {
    name: string
    rating: number
    vehicle: string
    image: string
  }
  fees: {
    subtotal: number
    delivery: number
    service: number
    taxes: number
    total: number
  }
}

export const mockOrders: Order[] = [
  {
    id: 'ORD-88219',
    restaurant: 'The Artisan Kitchen',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKsymZlXW5uS6TEa7trxCCocmM-t_iDShkSopU-EHXzK2mKk00W98dm2OCzGVu0nGxVN8c-blZsnDJPLtyMaa06dAZl1vj9nDN0Z9byoy2Fxn07pUW4KVrFYw_o9DRrLr3VWwsuQah5o-S8M6tED3aNVZNPqIf243kkrlK6iWGzprHK4Q7dIp1Qz44quU7INt1KCGf761hzCi0KDYxsZMrZzIRFNmpS2a37likv3hrC8KDbFTJGXiM9BCbAIP8xGq22esi5lz3KVY',
    items: [
      { name: 'Glazed Atlantic Salmon', quantity: 1, price: 18.50 },
      { name: 'Truffle Mash', quantity: 1, price: 8.00 },
      { name: 'Sparkling Citrus', quantity: 1, price: 4.00 },
    ],
    total: 42.50,
    status: 'Out for Delivery',
    statusTone: 'info',
    time: '5-10 min',
    date: 'October 14, 2023 • 12:45 PM',
    location: 'Cambridge CB1',
    paymentMethod: 'Card',
    address: '15 Market Street',
    city: 'Cambridge CB1 2EP',
    contactName: 'John Doe',
    contactPhone: '+44 7700 900001',
    deliveryPerson: {
      name: 'Arjun Sharma',
      rating: 4.8,
      vehicle: 'Scooter',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeFwsoYQFF--NyASGU-YuxiZ0VTinMIhXE91vvT7ueANznNrwyH2WhToA0xUCF0Qd8yR8EYyuMpyyrtZXM1LnX2_wCvOy-nmW6-ZWeBibUZr5o4NwV3wZffSpFNGLGinrkWtIy7LHsxKI_tgZpAbPM-VmIaoLYQYJUmO68u-pmM5rQAcSAbWh4ivpRPVKr4L9av2Qdxa86gb8nWAEGoGtLPHG36CiBtYffuQtf_oZbPNnKVNaZZKLJIi3jc6Gulq0O8tSdqR8KgsCb',
    },
    fees: {
      subtotal: 30.50,
      delivery: 4.99,
      service: 2.50,
      taxes: 2.50,
      total: 40.49,
    },
  },
  {
    id: 'ORD-88220',
    restaurant: 'Bloom Bowls',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs2GF3Pqs0pvdI92r8KvUC4Sn2J4TX83j5v-npNwPUtX4-VR9hOCs2XvEpGv127_BZ_AJV9NhRIs_JI7PB49LyiiY35Q0CGeuCvgGXSt_ySQWHPxO-4CWLAGM1s5qxcFcb4evZm5di0EtP6sN3Q6IhjcG95314ldJGRJPybS40mMGwmgo2TOT9DvQy8uf8Ioh1INAroiCZQyQbSSd10SFGXYecuLek6dXAfGyUIs6EqOSCcwdzwY50xl_nCOCib3aC7lNpiZlYQ3I',
    items: [
      { name: 'Harvest Buddha Bowl', quantity: 1, price: 14.50 },
      { name: 'Green Detox Juice', quantity: 1, price: 6.00 },
    ],
    total: 22.90,
    status: 'Preparing',
    statusTone: 'warning',
    time: '15-20 min',
    date: 'October 14, 2023 • 1:30 PM',
    location: 'Cambridge CB2',
    paymentMethod: 'Card',
    address: '28 King Street',
    city: 'Cambridge CB2 1ST',
    contactName: 'Jane Smith',
    contactPhone: '+44 7700 900002',
    deliveryPerson: {
      name: 'Priya Patel',
      rating: 4.9,
      vehicle: 'Bicycle',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeFwsoYQFF--NyASGU-YuxiZ0VTinMIhXE91vvT7ueANznNrwyH2WhToA0xUCF0Qd8yR8EYyuMpyyrtZXM1LnX2_wCvOy-nmW6-ZWeBibUZr5o4NwV3wZffSpFNGLGinrkWtIy7LHsxKI_tgZpAbPM-VmIaoLYQYJUmO68u-pmM5rQAcSAbWh4ivpRPVKr4L9av2Qdxa86gb8nWAEGoGtLPHG36CiBtYffuQtf_oZbPNnKVNaZZKLJIi3jc6Gulq0O8tSdqR8KgsCb',
    },
    fees: {
      subtotal: 20.50,
      delivery: 2.99,
      service: 1.50,
      taxes: 1.50,
      total: 26.49,
    },
  },
  {
    id: 'ORD-8821',
    restaurant: 'The Artisan Kitchen',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKsymZlXW5uS6TEa7trxCCocmM-t_iDShkSopU-EHXzK2mKk00W98dm2OCzGVu0nGxVN8c-blZsnDJPLtyMaa06dAZl1vj9nDN0Z9byoy2Fxn07pUW4KVrFYw_o9DRrLr3VWwsuQah5o-S8M6tED3aNVZNPqIf243kkrlK6iWGzprHK4Q7dIp1Qz44quU7INt1KCGf761hzCi0KDYxsZMrZzIRFNmpS2a37likv3hrC8KDbFTJGXiM9BCbAIP8xGq22esi5lz3KVY',
    items: [
      { name: 'Glazed Atlantic Salmon', quantity: 1, price: 18.50 },
      { name: 'Truffle Mash', quantity: 1, price: 8.00 },
      { name: 'Sparkling Citrus', quantity: 1, price: 4.00 },
    ],
    total: 42.50,
    status: 'Delivered',
    statusTone: 'success',
    time: 'Delivered',
    date: 'October 14, 2023 • 12:45 PM',
    location: 'Cambridge CB1',
    paymentMethod: 'Card',
    address: '15 Market Street',
    city: 'Cambridge CB1 2EP',
    contactName: 'John Doe',
    contactPhone: '+44 7700 900001',
    deliveryPerson: {
      name: 'Arjun Sharma',
      rating: 4.8,
      vehicle: 'Scooter',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeFwsoYQFF--NyASGU-YuxiZ0VTinMIhXE91vvT7ueANznNrwyH2WhToA0xUCF0Qd8yR8EYyuMpyyrtZXM1LnX2_wCvOy-nmW6-ZWeBibUZr5o4NwV3wZffSpFNGLGinrkWtIy7LHsxKI_tgZpAbPM-VmIaoLYQYJUmO68u-pmM5rQAcSAbWh4ivpRPVKr4L9av2Qdxa86gb8nWAEGoGtLPHG36CiBtYffuQtf_oZbPNnKVNaZZKLJIi3jc6Gulq0O8tSdqR8KgsCb',
    },
    fees: {
      subtotal: 30.50,
      delivery: 4.99,
      service: 2.50,
      taxes: 2.50,
      total: 40.49,
    },
  },
  {
    id: 'ORD-7912',
    restaurant: 'Trattoria Neapolis',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0ZAvajwPYpwObmSAso9rX571NlPE7mFjiqw272MAAWOogKKexXozPKZRrrENC-1zNj5lsG8aphh72NZQMwocTsOqzz4tmhupSU0Q3MND7n9cjAaKl9kqP9aCNiZHVS1WrapxQ0xZgG0-a4G2B6dxxultqz4EX6U94Fdm2wdY9Xuyfc4VXqZtoNpAAJiqeScYB4AF1A6txUQ0md_2SeIP1qxsNlRGa7ztoqi3Kf4RxGAwRM9hgn7PyVPP1YE5fi4W91bJ_hUqm2u4',
    items: [
      { name: 'Margherita Classico', quantity: 1, price: 14.00 },
      { name: 'Burrata Salad', quantity: 1, price: 10.00 },
    ],
    total: 38.00,
    status: 'Cancelled',
    statusTone: 'error',
    time: 'Cancelled',
    date: 'October 09, 2023 • 07:12 PM',
    location: 'Cambridge CB3',
    paymentMethod: 'Card',
    address: '42 Hills Road',
    city: 'Cambridge CB3 2QD',
    contactName: 'Mike Johnson',
    contactPhone: '+44 7700 900003',
    deliveryPerson: {
      name: 'Raj Kumar',
      rating: 4.7,
      vehicle: 'Motorcycle',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeFwsoYQFF--NyASGU-YuxiZ0VTinMIhXE91vvT7ueANznNrwyH2WhToA0xUCF0Qd8yR8EYyuMpyyrtZXM1LnX2_wCvOy-nmW6-ZWeBibUZr5o4NwV3wZffSpFNGLGinrkWtIy7LHsxKI_tgZpAbPM-VmIaoLYQYJUmO68u-pmM5rQAcSAbWh4ivpRPVKr4L9av2Qdxa86gb8nWAEGoGtLPHG36CiBtYffuQtf_oZbPNnKVNaZZKLJIi3jc6Gulq0O8tSdqR8KgsCb',
    },
    fees: {
      subtotal: 24.00,
      delivery: 0,
      service: 0,
      taxes: 0,
      total: 24.00,
    },
  },
  {
    id: 'ORD-7440',
    restaurant: 'Bloom Bowls',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs2GF3Pqs0pvdI92r8KvUC4Sn2J4TX83j5v-npNwPUtX4-VR9hOCs2XvEpGv127_BZ_AJV9NhRIs_JI7PB49LyiiY35Q0CGeuCvgGXSt_ySQWHPxO-4CWLAGM1s5qxcFcb4evZm5di0EtP6sN3Q6IhjcG95314ldJGRJPybS40mMGwmgo2TOT9DvQy8uf8Ioh1INAroiCZQyQbSSd10SFGXYecuLek6dXAfGyUIs6EqOSCcwdzwY50xl_nCOCib3aC7lNpiZlYQ3I',
    items: [
      { name: 'Harvest Buddha Bowl', quantity: 1, price: 14.50 },
      { name: 'Green Detox Juice', quantity: 1, price: 6.00 },
    ],
    total: 22.90,
    status: 'Delivered',
    statusTone: 'success',
    time: 'Delivered',
    date: 'September 28, 2023 • 01:30 PM',
    location: 'Cambridge CB2',
    paymentMethod: 'Card',
    address: '28 King Street',
    city: 'Cambridge CB2 1ST',
    contactName: 'Jane Smith',
    contactPhone: '+44 7700 900002',
    deliveryPerson: {
      name: 'Priya Patel',
      rating: 4.9,
      vehicle: 'Bicycle',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeFwsoYQFF--NyASGU-YuxiZ0VTinMIhXE91vvT7ueANznNrwyH2WhToA0xUCF0Qd8yR8EYyuMpyyrtZXM1LnX2_wCvOy-nmW6-ZWeBibUZr5o4NwV3wZffSpFNGLGinrkWtIy7LHsxKI_tgZpAbPM-VmIaoLYQYJUmO68u-pmM5rQAcSAbWh4ivpRPVKr4L9av2Qdxa86gb8nWAEGoGtLPHG36CiBtYffuQtf_oZbPNnKVNaZZKLJIi3jc6Gulq0O8tSdqR8KgsCb',
    },
    fees: {
      subtotal: 20.50,
      delivery: 2.99,
      service: 1.50,
      taxes: 1.50,
      total: 26.49,
    },
  },
]

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find(order => order.id === id)
}
