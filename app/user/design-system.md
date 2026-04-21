# Namaste Cambridge — Heritage Journal Design System

*Secondary design system for the `/user` experience. Sister to `design-system.md` (Saffron & Stone).*

---

### 1. Overview & Creative North Star

**Creative North Star: The Illustrated Travel Journal**

Heritage Journal is a design system inspired by vintage postcards, hand-bound travel diaries, and the warm nostalgia of leather-bound recipe books. Where *Saffron & Stone* draws from the crisp editorial magazine, *Heritage Journal* draws from the sketched monument, the parchment page, and the storyteller's folio. It blends line-art illustrations of landmarks (Big Ben, Charminar, Taj Mahal) with rich food photography — creating a sense that every meal is a **journey between two cities**.

The palette feels **sun-aged**, as if the page has been in a satchel for a decade. Components look curated by hand: pill-shaped category tabs carry circular thumbnail medallions, and large food tiles feel like polaroids pinned into the journal.

---

### 2. Colors

The palette is rooted in **warm parchment neutrals**, a **deep brick-red** primary, and a **saffron-amber** accent that evokes turmeric and marigold.

#### Core Tokens

| Role | Hex | Usage |
|---|---|---|
| `parchment` (background) | `#F5EADA` | Base canvas — sepia-cream paper |
| `parchment_tint` | `#FBF3E4` | Elevated panels, soft fills |
| `parchment_shade` | `#E8DAC4` | Recessed areas, subtle wash |
| `ink` (on_background) | `#2A1F16` | Primary copy — warm near-black, never pure black |
| `ink_soft` (on_surface_variant) | `#6B5A4C` | Descriptions, metadata, secondary text |
| `brick` (primary) | `#C23A2C` | CTAs, pricing, brand wordmark |
| `brick_deep` (primary_container) | `#8E1F15` | Dinner/evening modes, pressed states |
| `saffron` (secondary) | `#E8A13A` | Lunch/daytime modes, highlights |
| `saffron_soft` | `#F4C881` | Saffron gradients, glow fills |
| `sage` (tertiary) | `#7A8B6A` | Veg markers, positive states |
| `terracotta` (accent) | `#D96E3A` | Chef's picks, spice-level indicators |

#### Surface Hierarchy

- `surface`: **`parchment`** — the journal page itself.
- `surface_container_lowest`: **`#FFFDF8`** — a near-white, cream-tinted card (never pure white `#FFFFFF`).
- `surface_container`: **`parchment_tint`** — for nested panels.
- `surface_container_high`: **`parchment_shade`** — for inactive tabs, muted containers.

#### The "Aged Paper" Rule

Backgrounds **must never be flat `#FFFFFF`**. All "white" surfaces carry at least a 2% warm tint. This preserves the parchment metaphor even on pure product cards.

#### The "Two-Meal Gradient" Rule

Meal-time switcher tiles use diagonal linear gradients:

- **Lunch / Day:** `from-[#F4B45A]` → `to-[#E8802C]` (saffron → amber)
- **Dinner / Night:** `from-[#C23A2C]` → `to-[#6E1410]` (brick → deep burgundy)

These are the only gradients permitted. Everything else is flat.

#### The "Line-Art Watermark" Rule

The `parchment` background can carry a **monument line-art illustration** at `opacity: 0.12–0.18` as a decorative watermark. Use sparingly — only on hero/home surfaces, never behind dense text.

---

### 3. Typography

The system uses a **three-way pairing** to recreate the hand-bound journal feel:

| Token | Font | Usage |
|---|---|---|
| `font-wordmark` | **Playfair Display Italic** (or Cormorant Garamond Italic) | "Namaste" script, brand-only |
| `font-display` | **Tenor Sans** or **Plus Jakarta Sans 800** | All-caps monument labels, "CAMBRIDGE" |
| `font-headline` | **Plus Jakarta Sans 700–800** | Page titles, product names |
| `font-body` | **Be Vietnam Pro 400–500** | Descriptions, metadata |
| `font-label` | **Plus Jakarta Sans 600** uppercase, tracked `0.12em` | Pill labels, nav items, badges |

#### Scale

- **Brand Wordmark:** script "Namaste" at 1.5rem italic, stacked with uppercase "CAMBRIDGE" at 1.5rem 800 tracked.
- **Display / Page Title:** (1.875rem / 30px) 800 weight, `-0.01em` tracking. e.g., *"Explore Menu"*.
- **Subhead / Tagline:** (1rem / 16px) 400, `ink_soft`. e.g., *"Authentic Indian Flavors Curated for Cambridge"*.
- **Product Title:** (1.125rem / 18px) 700, `ink`.
- **Body / Description:** (0.875rem / 14px) 400, `ink_soft`, line-height `1.5`.
- **Price:** (1rem / 16px) 800, `brick`.
- **Micro-Label:** (0.625rem / 10px) 600 uppercase tracked `0.15em`.

#### The "Mixed-Case Wordmark" Rule

The brand signature always combines **italic script + structured serif/sans all-caps**. Never display the wordmark as a single flat font. This duality is the brand.

---

### 4. Elevation & Depth

Elevation here is **soft, warm, and slightly diffused** — as if lit by afternoon light through a window, not overhead LEDs.

#### Shadow Tokens

```
--shadow-journal-sm: 0 2px 8px -2px rgb(42 31 22 / 0.08);
--shadow-journal-md: 0 6px 18px -6px rgb(42 31 22 / 0.14);
--shadow-journal-lg: 0 14px 36px -10px rgb(42 31 22 / 0.22);
--shadow-brick-glow: 0 10px 28px -8px rgb(194 58 44 / 0.35);
--shadow-saffron-glow: 0 10px 28px -8px rgb(232 161 58 / 0.40);
```

#### Principles

- **Warm shadows only:** shadows use `rgb(42 31 22 / α)` (ink), never neutral black. This keeps surfaces feeling paper-on-paper rather than object-on-void.
- **No glassmorphism for primary content.** Heritage Journal rejects `backdrop-blur` on cards — that belongs to Saffron & Stone. Only the **bottom tab bar** and **floating cart** may use a 90% parchment wash (no blur).
- **Meal tiles** carry a `shadow-journal-md` plus a matching color glow (saffron-glow for Lunch, brick-glow for Dinner).

---

### 5. Components

#### 5.1 App Header

- Compact, top-anchored, parchment background (no bar fill).
- Left: circular icon button (`ghost` style, parchment_tint fill) with hamburger.
- Center: stacked wordmark (Namaste script + Cambridge all-caps) flanking a small illustrated chef mascot.
- Right: 44px circular avatar with a **sage-green check badge** overlaid bottom-right (verified/active).

#### 5.2 Meal-Time Switcher (Lunch / Dinner Tiles)

- Two tiles side-by-side, `rounded-[1.25rem]` (xl).
- Each tile is **half-illustration, half-photograph**: left half holds the word ("Lunch" / "Dinner") on the gradient, right half shows a rich food photograph that bleeds to the edge.
- Icon accent (fork-and-knife for lunch, crescent-moon + stars for dinner) sits behind/beside the label.
- Height: `6rem` (96px).
- Active tile gets the matching shadow-glow; inactive tile drops to `opacity: 0.7`.

#### 5.3 Category Pills (Medallion Pills)

- `rounded-full`, height `2.75rem` (44px).
- Each pill carries a **circular photo thumbnail** (28px) on its left — like a stamped medallion on a wax seal.
- **Active** state: filled with `brick`, white text, subtle `shadow-brick-glow`.
- **Inactive** state: `parchment_tint` fill, `ink_soft` text, no shadow.
- Horizontal scroll, 12px gap.

#### 5.4 Food Cards

- Horizontal layout inside `rounded-[1.25rem]` (xl) cards on `surface_container_lowest`.
- Image area: `6.5rem × 6.5rem` (104px), `rounded-lg` (12px), offset 10px from card edge (image feels "inset" into the card, not flush).
- Small corner badges: square veg/non-veg indicator top-left (8px `rounded-sm`), small info "(i)" circle top-right of content.
- Title: `font-headline` 700.
- Description: 2-line clamp, `ink_soft`.
- Price: `brick`, 800.
- CTA: full-width pill `+ Add to Cart` below the price, **`brick` fill with `shadow-brick-glow`**. Pill uses `rounded-full`, height `2.5rem`.

#### 5.5 Floating Cart Bar

- Fixed `1rem` (16px) from the bottom tab bar.
- Horizontal pill, `rounded-full`, `parchment_tint` fill at 95% opacity (no blur), `shadow-journal-lg`.
- Left: circular `brick` badge with item count (white numeral, 800).
- Middle: stacked meta — uppercase micro-label "ITEM ADDED" + bold price "£12.75 plus taxes".
- Right: "VIEW CART" pill button, `brick` fill, white chevron, `shadow-brick-glow`.

#### 5.6 Bottom Tab Bar

- Parchment background (95% opacity wash, no blur), sits directly on the page edge with `shadow-journal-sm` pushing upward.
- 4 tabs: Home, Menu, Orders, Profile.
- **Active tab**: the icon is replaced by an **illustrated full-color glyph** (e.g., a red fork-and-knife crossed, painted style), label in `brick` 700 uppercase tracked.
- **Inactive tab**: flat line icon in `ink_soft`, label in `ink_soft` 500 uppercase tracked.

#### 5.7 Icon Buttons (Ghost / Parchment)

- 44px square `rounded-[0.9rem]` (lg), `parchment_tint` fill, `ink` icon, no border, `shadow-journal-sm`.

---

### 6. Iconography & Illustration

- **Line-art monuments** (Big Ben, Charminar, Taj Mahal, King's College Chapel) used as background watermarks and decorative dividers. Stroke weight `1.25px`, color `ink` at 15% opacity.
- **Filled/painted spot illustrations** reserved for brand moments: the chef mascot, meal-tile food photos, active bottom-nav icons.
- **Line icons** (Material Symbols Outlined, weight 400, grade 0, 24px) for all utility UI.
- **Never mix** painted and line styles inside the same component. A component is either "illustrated" (storytelling) or "line" (functional).

---

### 7. Motion

- **Gentle, paper-feeling easings.** Default: `cubic-bezier(0.32, 0.72, 0.24, 1)` over 280–360ms.
- Pills on selection: scale 1.0 → 1.04 → 1.0 bounce.
- Card press: 2px downward translate + shadow shrink.
- No flashy transforms. Think *"turning a page"*, not *"swiping a screen"*.

---

### 8. Do's and Don'ts

**Do:**

- Do use **warm, sepia-tinted** whites and shadows — every surface should feel like aged paper.
- Do pair a **script italic** word with an **all-caps structured** word for any brand/heading moment.
- Do use **line-art monument watermarks** on hero surfaces to reinforce the "between two cities" narrative.
- Do use **photographic medallions** inside category pills to add tactile richness.
- Do reserve gradients for the **Lunch/Dinner** meal tiles only.

**Don't:**

- Don't use pure `#FFFFFF` or pure `#000000`. Use `#FFFDF8` and `#2A1F16`.
- Don't apply `backdrop-blur` to content cards — glassmorphism belongs to the *Saffron & Stone* system, not this one.
- Don't use cool-grey shadows. All shadows carry warm ink tint.
- Don't use more than one gradient per screen outside the meal-tile switcher.
- Don't use solid 1px borders except for the veg/non-veg indicator squares. Separation is achieved via tonal shifts on parchment.
- Don't mix painted illustration and line icons inside the same component.

---

### 9. Relationship to *Saffron & Stone*

| Dimension | Saffron & Stone (primary) | Heritage Journal (this) |
|---|---|---|
| Metaphor | Modern brasserie / editorial magazine | Illustrated travel journal / postcard |
| Base surface | `#F8F9FA` cool stone | `#F5EADA` warm parchment |
| Whites | `#FFFFFF` pure | `#FFFDF8` cream-tinted |
| Primary red | `#BC000A` saffron-heat | `#C23A2C` brick |
| Shadow tint | Neutral / cool | Warm ink |
| Separation | Tonal surface shifts + blur | Tonal surface shifts + warm shadow |
| Illustration | Minimal, photographic | Line-art monuments + painted spots |
| Typography voice | Structured editorial | Script + structured duet |

Use Heritage Journal for **customer-facing narrative surfaces** (home, menu discovery, craft-plan onboarding, order storytelling). Keep Saffron & Stone for **transactional clarity** (checkout, payment, admin). The two systems share the same radius scale and the same base type pairing, so a single flow can transition between them without friction.
