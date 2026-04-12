'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MaterialIcon } from '@/components/MaterialIcon'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'

export default function CraftPlanPage() {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  
  const [selectedPlan, setSelectedPlan] = useState('executive')
  const [selectedRice, setSelectedRice] = useState('jeera')
  const [selectedCurries, setSelectedCurries] = useState(['paneer-butter', 'dal-tadke'])
  const [selectedAddons, setSelectedAddons] = useState(['fried-curd'])

  const mealPlans = [
    { id: 'executive', name: 'The Executive Meal', price: '$299/mo', badge: 'BÁLÁCUAD', highlighted: true },
    { id: 'student', name: 'Student Special', price: '$149', badge: null, highlighted: false },
    { id: 'lite', name: 'Lite & Healthy', price: '$199', badge: null, highlighted: false },
  ]

  const riceOptions = ['Jeera Rice', 'Brown Rice', 'Basmati']
  
  const curryOptions = [
    { id: 'paneer-butter', name: 'Paneer Butter Masala' },
    { id: 'dal-tadke', name: 'Dal Tadke' },
    { id: 'aloo-gobi', name: 'Aloo Gobi' },
  ]
  
  const addonOptions = ['Fried Curd', 'Sweet dish', 'Buttermilk']

  const handleCurryToggle = (curryId: string) => {
    setSelectedCurries(prev => 
      prev.includes(curryId) 
        ? prev.filter(id => id !== curryId)
        : [...prev, curryId]
    )
  }

  const handleAddonToggle = (addon: string) => {
    setSelectedAddons(prev =>
      prev.includes(addon)
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    )
  }

  const handleConfirm = () => {
    router.push('/user/subscription-details')
  }

  const getSelectionSummary = () => {
    const rice = riceOptions.find(r => r.toLowerCase().includes(selectedRice)) || selectedRice
    const curries = curryOptions
      .filter(c => selectedCurries.includes(c.id))
      .map(c => c.name.split(' ')[0])
      .join(' + ')
    const addon = selectedAddons[0] || ''
    return `${rice} + ${curries} + ${addon}`
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-32 md:pb-8">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-zinc-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <MaterialIcon name="arrow_back" className="text-2xl" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-lg sm:text-xl text-primary">
              Namaste Cam
            </h1>
          </div>
          <button
            onClick={() => router.push('/user/profile')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-zinc-500 hover:text-primary transition-colors"
          >
            <MaterialIcon name="person" className="text-xl" />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-8 max-w-md mx-auto px-4 sm:px-6">
        {/* Craft Your Plan Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">
            Craft Your Plan
          </h2>
          <p className="text-secondary text-sm">
            Select a subscription that fits your lifestyle and taste.
          </p>
        </section>

        {/* Meal Plan Selection */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Meal Plan Selection</h3>
          <div className="space-y-3">
            {mealPlans.map((plan) => (
              <Card
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-on-surface">{plan.name}</h4>
                    <p className="text-primary font-bold">{plan.price}</p>
                  </div>
                  {plan.badge && (
                    <span className="px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-full uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Rice Selection */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Rice Selection</h3>
          <div className="flex flex-wrap gap-2">
            {riceOptions.map((rice) => (
              <button
                key={rice}
                onClick={() => setSelectedRice(rice.toLowerCase().split(' ')[0])}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedRice === rice.toLowerCase().split(' ')[0]
                    ? 'bg-primary text-on-primary shadow-md shadow-primary-soft'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container'
                }`}
              >
                {rice}
              </button>
            ))}
          </div>
        </section>

        {/* Curry Selection */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Curry Selection</h3>
          <div className="space-y-3">
            {curryOptions.map((curry) => (
              <Card
                key={curry.id}
                onClick={() => handleCurryToggle(curry.id)}
                className={`p-4 cursor-pointer transition-all flex items-center gap-3 ${
                  selectedCurries.includes(curry.id)
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedCurries.includes(curry.id)
                    ? 'border-primary bg-primary'
                    : 'border-outline-variant'
                }`}>
                  {selectedCurries.includes(curry.id) && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
                <span className="font-medium text-on-surface">{curry.name}</span>
              </Card>
            ))}
          </div>
        </section>

        {/* Add-ons */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Add-ons</h3>
          <div className="flex flex-wrap gap-2">
            {addonOptions.map((addon) => (
              <button
                key={addon}
                onClick={() => handleAddonToggle(addon)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedAddons.includes(addon)
                    ? 'bg-primary text-on-primary shadow-primary-soft'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container'
                }`}
              >
                {addon}
              </button>
            ))}
          </div>
        </section>

        {/* Your Selection Summary */}
        <section className="mb-8">
          <Card className="p-4 bg-surface-container-low">
            <p className="text-sm text-secondary mb-1">Your Selection</p>
            <p className="font-semibold text-on-surface">{getSelectionSummary()}</p>
          </Card>
        </section>

        {/* Confirm Subscription Button */}
        <section className="mb-6">
          <Button
            onClick={handleConfirm}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Confirm Subscription
            <MaterialIcon name="arrow_forward" className="text-xl" />
          </Button>
        </section>
      </main>
    </div>
  )
}
