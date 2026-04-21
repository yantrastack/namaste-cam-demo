'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useUserNavDrawer } from '@/components/layout/UserNavDrawer'
import { useToast } from '@/components/ui/Toast'
import { MaterialIcon } from '@/components/MaterialIcon'

export default function LoginPage() {
  const router = useRouter()
  const { openDrawer } = useUserNavDrawer()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    router.push('/user/select-location')
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/user/select-location')
    setIsLoading(false)
  }

  const handleFacebookLogin = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/user/select-location')
    setIsLoading(false)
  }

  const handleGuestLogin = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/user/select-location')
    setIsLoading(false)
  }

  const handleForgotPassword = () => {
    showToast('Password reset link sent to your email', 'info')
  }

  const handleCreateAccount = () => {
    router.push('/user/create-account')
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="user-app-fixed-frame top-0 bottom-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-tertiary-fixed/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md space-y-12">
        {/* Brand Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-3xl mb-2">
            <MaterialIcon name="restaurant" className="text-on-primary-container text-3xl" />
          </div>
          <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-primary">
            Namaste Cam
          </h1>
          <p className="text-secondary font-medium tracking-tight">
            Curation of extraordinary flavors.
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
              Sign in to your editorial account
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
                  placeholder="gourmet@example.com"
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
                  placeholder="••••••••"
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
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
              </svg>
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
              <MaterialIcon name="explore" className="text-xl" />
              Continue as Guest
            </button>
          </div>
        </main>

        {/* Footer Call-to-action */}
        <footer className="text-center space-y-8">
          <p className="text-sm text-secondary font-medium">
            New to the editorial?
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
