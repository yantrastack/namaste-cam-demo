'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { MaterialIcon } from '@/components/MaterialIcon'

export default function DeliveryLoginPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push('/delivery/new-deliveries')
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/delivery/new-deliveries')
    setIsLoading(false)
  }

  const handleFacebookLogin = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/delivery/new-deliveries')
    setIsLoading(false)
  }

  const handleGuestLogin = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/delivery/new-deliveries')
    setIsLoading(false)
  }

  const handleForgotPassword = () => {
    showToast('Password reset link sent to your email', 'info')
  }

  const handleCreateAccount = () => {
    router.push('/delivery/register')
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-tertiary-fixed/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md space-y-12">
        {/* Brand Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-3xl mb-2">
            <MaterialIcon name="delivery_dining" className="text-on-primary-container text-3xl" />
          </div>
          <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-primary">
            Namaste Cam
          </h1>
          <p className="text-secondary font-medium tracking-tight">
            Delivery Partner Portal
          </p>
        </header>

        {/* Main Auth Form Shell */}
        <main className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl space-y-8 relative overflow-hidden">
          {/* Subtle Asymmetric Decorative Element */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="space-y-2">
            <h2 className="font-headline font-bold text-2xl text-on-surface">
              Welcome back
            </h2>
            <p className="text-secondary text-sm">
              Sign in to your delivery partner account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2 ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <MaterialIcon name="mail" className="absolute left-4 text-secondary/60 text-xl" />
                <input
                  id="email"
                  type="email"
                  placeholder="delivery@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-zinc-400 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-bold text-primary hover:opacity-80 transition-opacity"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative flex items-center">
                <MaterialIcon name="lock" className="absolute left-4 text-secondary/60 text-xl" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-zinc-400 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-secondary/60 hover:text-primary transition-colors"
                >
                  <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="text-xl" />
                </button>
              </div>
            </div>

            {/* Primary Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#bc000a] to-[#e2241f] text-on-primary font-headline font-bold rounded-full active:scale-95 transition-all duration-200 shadow-lg"
              style={{ boxShadow: '0 8px 24px rgba(25, 28, 29, 0.04)' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-surface-container-high" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              or
            </span>
            <div className="h-px flex-1 bg-surface-container-high" />
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-4 bg-white border border-surface-variant text-on-surface font-headline font-bold rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all shadow-sm"
            >
              <img
                alt="Google"
                className="h-5 w-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNxI22KEwngUQYEb2ZPIiftkoU0JkFF3eY04GpxRCK9h4oqFTcwys-U33o0PxUCSVNyn38xmHiFZwg-8qyVKsqKyTMDPrWTxkto0K6OHEBzYX1wmVvmZ2JPALuDVOGSzCvOgWlIBiN04W-tZWDgW8mOgiDfk2wpEfkcBs864RHY5c6GdXI6LThIwejyW4hDQwEf4jQOEqo30waYD1_7rRj3PfFTeuhghkDqcpIhzFne77tvd2JxQB6QU6eunPVNekapvM_SVUHYmo"
              />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full py-4 bg-[#1877F2] text-white font-headline font-bold rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all shadow-sm"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full py-4 bg-surface-container-high text-on-surface-variant font-headline font-bold rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <MaterialIcon name="delivery_dining" className="text-xl" />
              Continue as Guest
            </button>
          </div>
        </main>

        {/* Footer Call-to-action */}
        <footer className="text-center space-y-8">
          <p className="text-sm text-secondary font-medium">
            New to delivery?
            <button
              onClick={handleCreateAccount}
              className="text-primary font-bold hover:underline ml-1"
            >
              Create an account
            </button>
          </p>
        </footer>
      </div>
    </div>
  )
}
