Create a scalable Next.js (App Router) admin panel foundation using Tailwind CSS based on a premium food delivery design system.

This is NOT a backend app. It is a frontend-only interactive demo using sessionStorage.

---

## PROJECT SETUP

* Framework: Next.js (App Router)
* Styling: Tailwind CSS
* Language: TypeScript
* Use functional components only
* Use "use client" where needed

---

## DESIGN SYSTEM (STRICT RULES)

Follow these design rules strictly:

1. Colors

* Primary: Deep Red (#D00000 or similar saffron red)
* Background: #F8F9FA
* Card Surface: White (#FFFFFF)
* Text Primary: #191C1D (not pure black)
* No hard borders (avoid 1px borders)
* Use shadows instead of borders

2. Layout Feel

* Spacious, premium, editorial style
* Generous padding
* No clutter

3. Shapes

* Buttons: rounded-full (pill)
* Cards: rounded-lg or rounded-xl
* Inputs: fully rounded

4. Elevation

* Use soft shadows:

  * shadow-sm (cards)
  * shadow-md (active)
  * shadow-lg (floating elements)

5. Glassmorphism

* Use backdrop-blur for:

  * header
  * modals
  * floating components

---

## FOLDER STRUCTURE

Create this structure:

app/
├─ (auth)/
│   └─ login/page.tsx
│
├─ (dashboard)/
│   ├─ layout.tsx
│   ├─ dashboard/page.tsx
│   ├─ orders/page.tsx
│   ├─ menu/page.tsx
│   ├─ weekly-menus/page.tsx
│   ├─ users/page.tsx
│   ├─ restaurants/page.tsx
│   └─ settings/page.tsx
│
components/
├─ layout/
│   ├─ Sidebar.tsx
│   ├─ Header.tsx
│   └─ PageContainer.tsx
│
├─ ui/
│   ├─ Button.tsx
│   ├─ Card.tsx
│   ├─ Input.tsx
│   ├─ Badge.tsx
│   ├─ Modal.tsx
│   ├─ Table.tsx
│   └─ Tabs.tsx
│
lib/
├─ storage.ts
└─ auth.ts

---

## LAYOUT SYSTEM (VERY IMPORTANT)

Implement a proper layout:

Dashboard layout:

* Sidebar (fixed width: 240px)
* Header (top bar)
* Main content (flex-1)

Use this structure:

<div className="flex h-screen bg-[#F8F9FA]">
  <Sidebar />
  <div className="flex flex-col flex-1">
    <Header />
    <main className="p-6 overflow-y-auto">{children}</main>
  </div>
</div>

Sidebar rules:

* fixed width (w-[240px])
* full height
* active route highlight
* icons + labels

---

## AUTH (FAKE LOGIN)

Create login page:

* Email + Password inputs
* Sign In button
* On login:

sessionStorage.setItem(
"user",
JSON.stringify({ role: "admin", name: "Admin User" })
)

* Redirect to /dashboard

---

## ROUTE PROTECTION

* If no user in sessionStorage → redirect to /login
* Apply this in dashboard layout

---

## SESSION STORAGE UTILS

Create helper:

export const getData = (key: string) =>
JSON.parse(sessionStorage.getItem(key) || "[]");

export const setData = (key: string, value: any) =>
sessionStorage.setItem(key, JSON.stringify(value));

---

## COMPONENT RULES

Button:

* rounded-full
* primary (red)
* secondary (light surface)

Card:

* white background
* shadow-sm
* rounded-xl

Input:

* rounded-full
* soft background (no borders)

Badge:

* pill style
* colors:

  * green (success)
  * blue (info)
  * red (error)
  * yellow (warning)

Modal:

* centered
* backdrop blur
* rounded-xl
* shadow-lg

---

## HEADER

Include:

* search bar
* notification icon
* user profile

Use glass effect:

* backdrop-blur-md
* bg-white/80

---

## SIDEBAR NAV ITEMS

* Dashboard
* Orders
* Menu
* Weekly Menus
* Users
* Restaurants
* Payments
* Settings

---

## UX DETAILS

* Smooth hover states
* Active nav highlight (red indicator)
* Consistent spacing
* Clean typography hierarchy

---

## GOAL

After setup:

* App should run
* Login should work
* Sidebar + layout should be perfect
* Navigation should work

DO NOT build full features yet.
Focus on foundation + layout + components.

---
