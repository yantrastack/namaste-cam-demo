# Namaste Cam - Design System



### 1. Overview & Creative North Star

**Creative North Star: The Modern Brasserie**

Saffron & Stone is a design system that marries the warmth of traditional heritage with the crisp, structured elegance of high-end editorial magazines. It moves away from the "app-like" rigidity of standard material design, favoring an expansive, white-space-driven layout that feels curated rather than programmatic. The system uses bold, heavy typography paired with airy layouts to create a sense of premium culinary discovery.



### 2. Colors

The palette is rooted in a high-contrast relationship between a deep, "Saffron-Heat" Red (`primary`) and a "Cool Stone" Neutral base.

- **Text roles:** `on_surface` / `on_background` (#252B31) for primary copy; `on_surface_variant` (#4A5056) for descriptions, metadata, and secondary table cells — same cool slate family, not red-tinted.

- **The "No-Line" Rule:** Visual separation is achieved through tonal shifts in the surface hierarchy. Avoid using 1px borders to separate content blocks. Instead, use `surface_container_lowest` cards against a `surface` background to define boundaries.

- **Surface Hierarchy & Nesting:**

    - `surface`: The base canvas for the entire page.

    - `surface_container_lowest`: Used for primary content cards and interactive modules.

    - `surface_container_high`: Used for subtle UI elements like secondary buttons or navigation backgrounds.

- **The "Glass & Gradient" Rule:** Navigation bars and floating carts must utilize `backdrop-blur-md` with an 80% opacity fill to maintain context and depth.

- **Signature Textures:** Primary buttons use a subtle `shadow-primary/20` to create a soft, glowing elevation that suggests warmth without harshness.



### 3. Typography

The system uses a pairing of **Plus Jakarta Sans** for high-impact headlines and **Be Vietnam Pro** for functional, readable body text.



- **Display & Headlines:** (1.875rem / 30px) Heavy weights (Extrabold, 800) with tight tracking to mimic luxury editorial mastheads.

- **Titles:** (1.25rem / 20px) Bold and authoritative, used for product names.

- **Body Text:** (1.125rem and 0.875rem) Optimized for legibility with a slightly increased line height to handle descriptive culinary copy.

- **Micro-Labels:** (10px) Used for "Chef's Choice" or category badges, always uppercase with wide tracking (widest) for a professional, "ticket-style" aesthetic.



### 4. Elevation & Depth

Elevation is expressed through soft, ambient light rather than physical height.



- **The Layering Principle:** Content sits on `surface_container_lowest` (Pure White) to pop against the `background` (#F8F9FA).

- **Ambient Shadows:**

    - `shadow-sm`: Used for standard cards to provide a subtle lift.

    - `shadow-md`: Used for active states and specialized "Chef's Choice" features.

    - `shadow-lg`: Reserved for primary floating action elements (e.g., the Floating Cart).

- **Glassmorphism:** Navigation and bottom bars utilize a blur-radius (approx 12px) and a semi-transparent white wash to create a "floating over the content" feel.



### 5. Components

- **Buttons:** All buttons must be `rounded-full` (Pill-shaped). Primary buttons use high-saturation red with white text and a themed shadow.

- **Food Cards:** Horizontal layout with a fixed aspect ratio (1:1) for imagery. Images should have a `rounded-lg` (8px) corner to contrast the `rounded-full` buttons.

- **Quantity Selectors:** A nested "pill within a pill" design using `surface_container_high` and `primary_container` to indicate active interaction.

- **Floating Cart:** A signature element that sits 24px from the bottom, utilizing `backdrop-blur-xl` and a high-contrast layout.



### 6. Do's and Don'ts

**Do:**

- Use generous padding (spacing level 3) to let food photography "breathe."

- Use `primary` (Red) sparingly to highlight calls to action and pricing.

- Mix font weights to create hierarchy instead of just using different sizes.



**Don't:**

- Do not use black (#000000). Use `on_surface` (#252B31) for text and `stone-500` for icons.

- Avoid sharp corners; all structural containers should have at least an 8px (lg) or 12px (xl) radius.

- Do not use solid borders unless they are the `outline-variant` at 10% opacity for "Ghost" styles.