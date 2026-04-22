'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { MaterialIcon } from '@/components/MaterialIcon'
import { cn } from '@/lib/cn'

export type MenuListingLayoutMode = 'list' | 'grid-2'

export type MenuListingDisplayTheme = {
  layout: MenuListingLayoutMode
  primary: string
  surface: string
  cardBg: string
}

export const MENU_LISTING_THEME_DEFAULT: MenuListingDisplayTheme = {
  layout: 'list',
  primary: '#bc000a',
  surface: '#f8f9fa',
  cardBg: '#ffffff',
}

const STORAGE_KEY = 'namaste-user-menu-listing-theme'

const PRIMARY_PRESETS = ['#bc000a', '#0d6e6e', '#5b21b6', '#b45309', '#0f766e']
const SURFACE_PRESETS = ['#f8f9fa', '#fff7ed', '#f0fdf4', '#f8fafc', '#1c1917']
const CARD_PRESETS = ['#ffffff', '#fafafa', '#fffbeb', '#f1f5f9', '#292524']

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i)
  if (!m) return null
  const n = parseInt(m[1], 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export function onPrimaryForHex(hex: string): string {
  const rgb = parseHex(hex)
  if (!rgb) return '#ffffff'
  const { r, g, b } = rgb
  const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return L > 0.55 ? '#252b31' : '#ffffff'
}

export function loadMenuListingTheme(): MenuListingDisplayTheme {
  if (typeof window === 'undefined') return MENU_LISTING_THEME_DEFAULT
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return MENU_LISTING_THEME_DEFAULT
    const parsed = JSON.parse(raw) as Partial<MenuListingDisplayTheme>
    return { ...MENU_LISTING_THEME_DEFAULT, ...parsed }
  } catch {
    return MENU_LISTING_THEME_DEFAULT
  }
}

export function persistMenuListingTheme(theme: MenuListingDisplayTheme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
  } catch {
    /* ignore */
  }
}

type MenuListingThemeDockProps = {
  theme: MenuListingDisplayTheme
  onThemeChange: (next: MenuListingDisplayTheme) => void
  cartVisible: boolean
}

export function MenuListingThemeDock({
  theme,
  onThemeChange,
  cartVisible,
}: MenuListingThemeDockProps) {
  const [open, setOpen] = useState(false)

  const bottomClass = cartVisible ? 'bottom-44' : 'bottom-28'

  const patch = (partial: Partial<MenuListingDisplayTheme>) => {
    onThemeChange({ ...theme, ...partial })
  }

  return (
    <div
      className={cn(
        'user-app-fixed-frame z-[60] pointer-events-none flex flex-col items-end gap-3 px-4',
        bottomClass,
      )}
    >
      <div
        className={cn(
          'pointer-events-auto max-h-[min(72vh,520px)] w-[min(calc(100vw-2rem),320px)] overflow-y-auto rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-200',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        )}
        aria-hidden={!open}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="font-headline text-sm font-bold text-on-surface">Menu listing preview</p>
            <p className="mt-0.5 text-xs text-on-surface-variant">
              Client-only on this page. Saved in this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Close display settings"
          >
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Layout
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => patch({ layout: 'list' })}
                className={cn(
                  'rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors',
                  theme.layout === 'list'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline-variant/40 bg-surface-container-low text-on-surface',
                )}
              >
                Single column
              </button>
              <button
                type="button"
                onClick={() => patch({ layout: 'grid-2' })}
                className={cn(
                  'rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors',
                  theme.layout === 'grid-2'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline-variant/40 bg-surface-container-low text-on-surface',
                )}
              >
                2-column grid
              </button>
            </div>
          </div>

          <ColorRow
            label="Primary"
            value={theme.primary}
            onChange={(primary) => patch({ primary })}
            presets={PRIMARY_PRESETS}
          />
          <ColorRow
            label="Page background"
            value={theme.surface}
            onChange={(surface) => patch({ surface })}
            presets={SURFACE_PRESETS}
          />
          <ColorRow
            label="Card background"
            value={theme.cardBg}
            onChange={(cardBg) => patch({ cardBg })}
            presets={CARD_PRESETS}
          />

          <button
            type="button"
            onClick={() => onThemeChange(MENU_LISTING_THEME_DEFAULT)}
            className="w-full rounded-xl border border-outline-variant/40 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
          >
            Reset to defaults
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg shadow-primary/30 transition-transform active:scale-95"
        aria-expanded={open}
        aria-label={open ? 'Close menu display settings' : 'Open menu display settings'}
      >
        <MaterialIcon name="palette" className="text-2xl" />
      </button>
    </div>
  )
}

function ColorRow({
  label,
  value,
  onChange,
  presets,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
  presets: string[]
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{label}</p>
      <div className="flex items-center gap-2">
        <label className="relative size-11 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-outline-variant/40 shadow-sm">
          <span className="sr-only">Pick {label}</span>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 p-0"
          />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="min-w-0 flex-1 rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 font-mono text-xs text-on-surface"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {presets.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={cn(
              'size-7 rounded-lg border-2 transition-transform active:scale-90',
              value.toLowerCase() === c.toLowerCase() ? 'border-primary ring-2 ring-primary/20' : 'border-white shadow-sm',
            )}
            style={{ backgroundColor: c }}
            aria-label={`Use ${c}`}
          />
        ))}
      </div>
    </div>
  )
}

export function useMenuListingThemePersistence(theme: MenuListingDisplayTheme) {
  useEffect(() => {
    persistMenuListingTheme(theme)
  }, [theme])
}

export function menuListingThemeCssVars(theme: MenuListingDisplayTheme): CSSProperties {
  const onPrimary = onPrimaryForHex(theme.primary)
  return {
    '--color-primary': theme.primary,
    '--color-on-primary': onPrimary,
    '--color-surface': theme.surface,
    '--color-surface-container-lowest': theme.cardBg,
  } as CSSProperties
}
