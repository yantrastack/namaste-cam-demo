"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { setSessionUser } from "@/lib/auth";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYkd4drFgOEK09S_e2xfCodfqSc20bdyGGLEutU7vMfQ3f3VdK8X7g1uJWOxuRcvFddlQBhmn5YeIwHFQknO_jTmjBnBS200c0HBlDDAZX7YV5z55rn9oRTA5j3ByGC7Qblg2MwhIOFHm9nIlD5e0CuZNSabjw7rZOvc2V5r0awfbH5HEcQjPVOrPIvLzKFHtE_McyAJPsn-yNjjfJCmP_0W3knt3RTkf6T6xc5xHY9YeeLsI4MkTk9pSkKsJQhuVxU3mQGfVZ9go";

/** Google/Facebook buttons and “Or continue with” divider. */
const ENABLE_SOCIAL_LOGIN = false;

/** Create-account prompt and tagline / design-system links at the bottom. */
const ENABLE_LOGIN_FOOTER_EXTRAS = false;

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-[#1877F2]"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSessionUser({ role: "admin", name: "Admin User" });
    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-on-surface md:min-h-screen md:flex-row">
      {/* Mobile / small tablet: compact hero */}
      <div className="relative h-40 shrink-0 overflow-hidden sm:h-48 md:hidden">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
          <div>
            <p className="font-headline text-2xl font-extrabold tracking-tighter text-white drop-shadow-lg sm:text-3xl">
              Namaste Cam
            </p>
            <p className="mt-0.5 font-headline text-[10px] font-medium uppercase tracking-widest text-white/85 sm:text-xs">
              Authentic Indian cuisine
            </p>
          </div>
        </div>
      </div>

      {/* Desktop: left hero */}
      <div className="relative hidden min-h-0 overflow-hidden md:flex md:min-h-screen md:w-1/2">
        <Image
          src={HERO_IMAGE}
          alt="Colourful Indian biryani and sides on a dark table"
          fill
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 0px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="absolute left-6 top-8 z-10 md:left-10 md:top-12 lg:left-12 lg:top-12">
          <div className="font-headline text-3xl font-extrabold tracking-tighter text-white drop-shadow-lg lg:text-4xl">
            Namaste Cam
          </div>
          <p className="mt-2 font-headline text-xs font-medium uppercase tracking-wide text-white/80 sm:text-sm">
            Authentic Indian cuisine
          </p>
        </div>
        <div className="absolute bottom-8 left-6 right-6 text-white md:bottom-10 md:left-10 md:right-10 lg:bottom-12 lg:left-12 lg:right-12">
          <p className="font-headline text-lg font-bold italic leading-snug sm:text-xl lg:text-2xl lg:leading-tight">
            &ldquo;Experience the true essence of Indian spices and traditions in
            every bite.&rdquo;
          </p>
        </div>
      </div>

      {/* Form column: scrolls when content + keyboard exceed viewport */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain bg-surface-container-lowest px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pb-8 sm:pt-8 md:w-1/2 md:justify-center md:px-10 md:py-12 lg:px-16 lg:py-16">
        <div className="mx-auto w-full max-w-md space-y-8 sm:space-y-10">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
              Welcome back
            </h1>
            <p className="font-body text-sm text-secondary sm:text-base">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                className="ml-0.5 text-xs font-bold uppercase tracking-widest text-secondary sm:ml-1"
                htmlFor="login-email"
              >
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@namastecam.com"
                className="min-h-12 w-full rounded-xl border-none bg-surface-container-low px-4 py-3.5 text-base text-on-surface placeholder:text-stone-400 transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none sm:px-5 sm:py-4"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-col gap-2 sm:ml-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                <label
                  className="text-xs font-bold uppercase tracking-widest text-secondary"
                  htmlFor="login-password"
                >
                  Password
                </label>
                {/* <a
                  href="#"
                  className="self-start text-xs font-bold text-primary underline-offset-4 hover:underline sm:self-auto"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a> */}
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="min-h-12 w-full rounded-xl border-none bg-surface-container-low px-4 py-3.5 pr-14 text-base text-on-surface placeholder:text-stone-400 transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none sm:px-5 sm:py-4"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full text-stone-400 hover:bg-black/5 hover:text-stone-600 sm:right-4"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <MaterialIcon
                    name={showPassword ? "visibility_off" : "visibility"}
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="font-headline min-h-12 w-full rounded-full bg-primary py-3.5 text-base font-extrabold tracking-tight text-white shadow-lg shadow-primary-soft transition-all hover:opacity-95 active:scale-[0.98] sm:py-4 sm:text-lg"
            >
              Sign in
            </button>
          </form>

          {ENABLE_SOCIAL_LOGIN ? (
            <>
              <div className="relative flex items-center py-1 sm:py-2">
                <div className="flex-grow border-t border-surface-container-high" />
                <span className="mx-3 flex-shrink text-[10px] font-bold uppercase tracking-widest text-stone-400 sm:mx-4 sm:text-xs">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-surface-container-high" />
              </div>

              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                <button
                  type="button"
                  className="font-headline flex min-h-12 items-center justify-center gap-2 rounded-full border border-surface-container-high px-4 py-3.5 transition-colors hover:bg-surface-container-low active:scale-[0.98] sm:gap-3 sm:py-4"
                >
                  <GoogleIcon />
                  <span className="text-sm font-bold">Google</span>
                </button>
                <button
                  type="button"
                  className="font-headline flex min-h-12 items-center justify-center gap-2 rounded-full border border-surface-container-high px-4 py-3.5 transition-colors hover:bg-surface-container-low active:scale-[0.98] sm:gap-3 sm:py-4"
                >
                  <FacebookIcon />
                  <span className="text-sm font-bold">Facebook</span>
                </button>
              </div>
            </>
          ) : null}

          {ENABLE_LOGIN_FOOTER_EXTRAS ? (
            <>
              <div className="pt-2 text-center sm:pt-4">
                <p className="text-sm font-medium text-secondary">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/user/create-account"
                    className="font-bold text-primary underline-offset-4 hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              <div className="space-y-3 pb-2 text-center sm:mt-8">
                <p className="text-[10px] uppercase leading-relaxed tracking-widest text-stone-400">
                  Authentic • Traditional • Crafted with care
                </p>
                <p className="text-xs text-stone-400">
                  <Link
                    href="/design-system"
                    className="font-bold text-primary underline-offset-4 hover:underline"
                  >
                    Design system
                  </Link>
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
