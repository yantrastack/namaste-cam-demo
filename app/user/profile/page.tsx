'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MaterialIcon } from '@/components/MaterialIcon'
import { Switch } from '@/components/ui/Switch'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'
import { useToast } from '@/components/ui/Toast'

export default function ProfilePage() {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  const { showToast } = useToast()
  const [pushNotifications, setPushNotifications] = useState(true)

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      router.push('/user/login')
    }
  }

  const handleSettingsClick = () => {
    showToast('Settings page coming soon!', 'info')
  }

  const handleWalletClick = () => {
    showToast('Wallet page coming soon!', 'info')
  }

  const handleAddressesClick = () => {
    showToast('Addresses page coming soon!', 'info')
  }

  const handlePaymentClick = () => {
    showToast('Payment options page coming soon!', 'info')
  }

  const handleAppearanceClick = () => {
    showToast('Appearance settings coming soon!', 'info')
  }

  const handlePrivacyClick = () => {
    showToast('Privacy & Security settings coming soon!', 'info')
  }

  const handleLanguageClick = () => {
    showToast('Language settings coming soon!', 'info')
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-32">
      {/* TopAppBar */}
      <header className="user-app-fixed-frame top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 w-full">
          <div className="flex items-center gap-4">
            <button onClick={openDrawer} className="text-zinc-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <MaterialIcon name="menu" className="text-2xl" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-lg text-primary">
              Profile
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden cursor-pointer">
            <img
              className="w-full h-full object-cover"
              alt="User profile avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBLTUkPph8lyHdvxM66U8H8_95GCrxcO46WjeUi1MA8D_FLTN_SqQI_uHSLGUH4fRbtI-TWsvVTblcDWvFLs5gV6EzM206c91DoW-Vls_ueYkDqnk7RJTlWExOxMpUrTXveRmq1FXVGud-Gx0U9sZp5lBnZ3pSRAhdVzDiODC0m82H4g1hIcxeYsStCVVUYcmHuodFLRLd3zt3C_ZnQs7PeYRVZ8pQ6sX-a2D11H9-liDxAmBIDHyOgJT5_mbENQgB5M2lZxJdFes"
            />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        {/* User Profile Section */}
        <section className="mb-6">
          <Card className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container-low">
                  <img
                    className="w-full h-full object-cover"
                    alt="User profile avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBLTUkPph8lyHdvxM66U8H8_95GCrxcO46WjeUi1MA8D_FLTN_SqQI_uHSLGUH4fRbtI-TWsvVTblcDWvFLs5gV6EzM206c91DoW-Vls_ueYkDqnk7RJTlWExOxMpUrTXveRmq1FXVGud-Gx0U9sZp5lBnZ3pSRAhdVzDiODC0m82H4g1hIcxeYsStCVVUYcmHuodFLRLd3zt3C_ZnQs7PeYRVZ8pQ6sX-a2D11H9-liDxAmBIDHyOgJT5_mbENQgB5M2lZxJdFes"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-lg">
                  <MaterialIcon name="edit" className="text-sm" />
                </button>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-headline font-bold text-on-surface mb-1">
                  John Doe
                </h2>
                <p className="text-sm text-secondary mb-1">@johndoe</p>
                <p className="text-xs text-on-surface-variant">john.doe@example.com</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-6 space-y-3">
          {/* My Subscription Card */}
          <Card 
            className="p-4 cursor-pointer hover:bg-surface-container-low transition-colors" 
            onClick={() => router.push('/user/subscription-details')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                <MaterialIcon name="card_membership" className="text-xl text-on-primary-container" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface">My Subscription</h3>
                <p className="text-sm text-secondary">Royal Mughal Feast</p>
              </div>
              <MaterialIcon name="chevron_right" className="text-secondary" />
            </div>
          </Card>

          {/* Craft Plan Card */}
          <Card 
            className="p-4 cursor-pointer hover:bg-surface-container-low transition-colors" 
            onClick={() => router.push('/user/craft-plan')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
                <MaterialIcon name="restaurant_menu" className="text-xl text-on-tertiary-container" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface">Craft Your Plan</h3>
                <p className="text-sm text-secondary">Create custom meal plan</p>
              </div>
              <MaterialIcon name="chevron_right" className="text-secondary" />
            </div>
          </Card>

          {/* Wallet Balance Card */}
          <Card className="p-4 cursor-pointer hover:bg-surface-container-low transition-colors" onClick={handleWalletClick}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                <MaterialIcon name="account_balance_wallet" className="text-xl text-on-primary-container" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface">Wallet Balance</h3>
                <p className="text-2xl font-headline font-bold text-primary">£2,450.00</p>
              </div>
              <MaterialIcon name="chevron_right" className="text-secondary" />
            </div>
          </Card>

          {/* Saved Addresses Card */}
          <Card className="p-4 cursor-pointer hover:bg-surface-container-low transition-colors" onClick={handleAddressesClick}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                <MaterialIcon name="location_on" className="text-xl text-on-secondary-container" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface">Saved Addresses</h3>
                <p className="text-sm text-secondary">3 addresses saved</p>
              </div>
              <MaterialIcon name="chevron_right" className="text-secondary" />
            </div>
          </Card>

          {/* Payment Options Card */}
          <Card className="p-4 cursor-pointer hover:bg-surface-container-low transition-colors" onClick={handlePaymentClick}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
                <MaterialIcon name="payment" className="text-xl text-on-tertiary-container" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface">Payment Options</h3>
                <p className="text-sm text-secondary">Visa **** 4242</p>
              </div>
              <MaterialIcon name="chevron_right" className="text-secondary" />
            </div>
          </Card>
        </section>

        {/* App Settings Section */}
        <section className="mb-6">
          <Card className="divide-y divide-surface-container-high">
            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
                  <MaterialIcon name="notifications" className="text-lg text-secondary" />
                </div>
                <span className="font-medium text-on-surface">Push Notifications</span>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            {/* Appearance */}
            <button
              onClick={handleAppearanceClick}
              className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
                  <MaterialIcon name="palette" className="text-lg text-secondary" />
                </div>
                <span className="font-medium text-on-surface">Appearance</span>
              </div>
              <MaterialIcon name="chevron_right" className="text-secondary" />
            </button>

            {/* Privacy & Security */}
            <button
              onClick={handlePrivacyClick}
              className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
                  <MaterialIcon name="shield" className="text-lg text-secondary" />
                </div>
                <span className="font-medium text-on-surface">Privacy & Security</span>
              </div>
              <MaterialIcon name="chevron_right" className="text-secondary" />
            </button>

            {/* Language */}
            <button
              onClick={handleLanguageClick}
              className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
                  <MaterialIcon name="language" className="text-lg text-secondary" />
                </div>
                <span className="font-medium text-on-surface">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">English</span>
                <MaterialIcon name="chevron_right" className="text-secondary" />
              </div>
            </button>
          </Card>
        </section>

        {/* Logout Button */}
        <section className="mb-6">
          <Button
            onClick={handleLogout}
            className="w-full py-4 bg-error-container text-error rounded-full font-bold flex items-center justify-center gap-2"
          >
            <MaterialIcon name="logout" className="text-xl" />
            Logout
          </Button>
        </section>

        {/* Footer */}
        <footer className="text-center pb-8">
          <p className="text-xs text-on-surface-variant">Version 1.0.0</p>
        </footer>
      </main>
    </div>
  )
}
