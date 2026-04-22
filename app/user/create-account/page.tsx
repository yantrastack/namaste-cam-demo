'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialIcon } from '@/components/MaterialIcon'
import { useToast } from '@/components/ui/Toast'

export default function CreateAccountPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    // Simulate API call with dummy data
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Account created with dummy data:', formData)
    showToast('Account created successfully! (Demo mode)', 'success')
    router.push('/user/login')
    setIsLoading(false)
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToast('Google signup initiated (Demo mode)', 'info')
    setIsLoading(false)
  }

  const handleFacebookSignup = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToast('Facebook signup initiated (Demo mode)', 'info')
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col">
      {/* Background Decorative Elements */}
      <div className="user-app-fixed-frame top-0 bottom-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-tertiary-fixed/10 rounded-full blur-[100px]" />
      </div>

      {/* Header Section */}
      <div className="relative h-[221px] md:h-[265px] w-full overflow-hidden bg-surface-container-lowest">
        <div className="relative z-20 flex flex-col items-center justify-center h-full pt-8">
          <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-primary">
            Namaste Cam
          </h1>
          <div className="h-1 w-12 bg-primary mt-2 rounded-full" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-start justify-center px-4 pt-12 z-30 pb-12">
        <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-xl overflow-hidden relative">
          <div className="p-6 md:p-8 relative z-10">
            {/* Title & Tagline */}
            <header className="mb-8">
              <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight mb-2">
                Create an Account
              </h2>
              <p className="text-secondary font-medium text-sm leading-relaxed">
                Join our culinary inner circle and experience the finest flavors of India in Cambridge.
              </p>
            </header>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
                  Full Name
                </label>
                <div className="relative group">
                  <MaterialIcon 
                    name="person" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-xl" 
                  />
                  <input
                    type="text"
                    placeholder="Arjun Sharma"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline transition-all outline-none ${
                      errors.fullName ? 'ring-2 ring-error/30' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.fullName && (
                  <p className="ml-1 text-xs font-medium text-error">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
                  Email Address
                </label>
                <div className="relative group">
                  <MaterialIcon 
                    name="mail" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-xl" 
                  />
                  <input
                    type="email"
                    placeholder="arjun@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline transition-all outline-none ${
                      errors.email ? 'ring-2 ring-error/30' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="ml-1 text-xs font-medium text-error">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <MaterialIcon 
                    name="phone_iphone" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-xl" 
                  />
                  <input
                    type="tel"
                    placeholder="+44 7700 900000"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline transition-all outline-none ${
                      errors.phone ? 'ring-2 ring-error/30' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="ml-1 text-xs font-medium text-error">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
                  Password
                </label>
                <div className="relative group">
                  <MaterialIcon 
                    name="lock" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-xl" 
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-12 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-outline transition-all outline-none ${
                      errors.password ? 'ring-2 ring-error/30' : ''
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    disabled={isLoading}
                  >
                    <MaterialIcon 
                      name={showPassword ? 'visibility_off' : 'visibility'} 
                      className="text-lg" 
                    />
                  </button>
                </div>
                {errors.password && (
                  <p className="ml-1 text-xs font-medium text-error">{errors.password}</p>
                )}
              </div>

              {/* Primary CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#bc000a] to-[#e2241f] text-on-primary font-bold py-4 rounded-full mt-4 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : (
                  <>
                    Sign Up
                    <MaterialIcon name="arrow_forward" className="text-lg" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8 flex items-center">
              <div className="flex-grow h-px bg-outline-variant/30" />
              <span className="px-4 text-xs font-medium text-outline uppercase tracking-widest">
                Or sign up with
              </span>
              <div className="flex-grow h-px bg-outline-variant/30" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 hover:bg-surface-container transition-colors active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-semibold text-on-surface">Google</span>
              </button>

              <button
                type="button"
                onClick={handleFacebookSignup}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 hover:bg-surface-container transition-colors active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-semibold text-on-surface">Facebook</span>
              </button>
            </div>

            {/* Footer Link */}
            <footer className="mt-10 text-center">
              <p className="text-sm font-medium text-secondary">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/user/login')}
                  className="text-primary font-bold ml-1 hover:underline underline-offset-4 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Log In
                </button>
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  )
}
