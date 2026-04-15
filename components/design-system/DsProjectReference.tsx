import { Card } from "@/components/ui/Card";

const surfaceAndTextColors: { token: string; tailwind: string; hex: string }[] =
  [
    { token: "background", tailwind: "bg-background", hex: "#f8f9fa" },
    { token: "surface", tailwind: "bg-surface", hex: "#f8f9fa" },
    { token: "surface-bright", tailwind: "bg-surface-bright", hex: "#f8f9fa" },
    { token: "surface-dim", tailwind: "bg-surface-dim", hex: "#d9dadb" },
    { token: "surface-variant", tailwind: "bg-surface-variant", hex: "#e1e3e4" },
    {
      token: "surface-container",
      tailwind: "bg-surface-container",
      hex: "#edeeef",
    },
    {
      token: "surface-container-low",
      tailwind: "bg-surface-container-low",
      hex: "#f3f4f5",
    },
    {
      token: "surface-container-high",
      tailwind: "bg-surface-container-high",
      hex: "#e7e8e9",
    },
    {
      token: "surface-container-highest",
      tailwind: "bg-surface-container-highest",
      hex: "#e1e3e4",
    },
    {
      token: "surface-container-lowest",
      tailwind: "bg-surface-container-lowest",
      hex: "#ffffff",
    },
    { token: "surface-tint", tailwind: "bg-surface-tint", hex: "#c0000a" },
    { token: "on-background", tailwind: "text-on-background", hex: "#252b31" },
    { token: "on-surface", tailwind: "text-on-surface", hex: "#252b31" },
    {
      token: "on-surface-variant",
      tailwind: "text-on-surface-variant",
      hex: "#4a5056",
    },
    {
      token: "inverse-surface",
      tailwind: "bg-inverse-surface",
      hex: "#2e3132",
    },
    {
      token: "inverse-on-surface",
      tailwind: "text-inverse-on-surface",
      hex: "#f0f1f2",
    },
  ];

const primaryColors: { token: string; tailwind: string; hex: string }[] = [
  { token: "primary", tailwind: "bg-primary", hex: "#bc000a" },
  { token: "on-primary", tailwind: "text-on-primary", hex: "#ffffff" },
  {
    token: "primary-container",
    tailwind: "bg-primary-container",
    hex: "#e2241f",
  },
  {
    token: "on-primary-container",
    tailwind: "text-on-primary-container",
    hex: "#fffbff",
  },
  {
    token: "primary-fixed",
    tailwind: "bg-primary-fixed",
    hex: "#ffdad5",
  },
  {
    token: "primary-fixed-dim",
    tailwind: "bg-primary-fixed-dim",
    hex: "#ffb4aa",
  },
  {
    token: "on-primary-fixed",
    tailwind: "text-on-primary-fixed",
    hex: "#410001",
  },
  {
    token: "on-primary-fixed-variant",
    tailwind: "text-on-primary-fixed-variant",
    hex: "#930005",
  },
  {
    token: "inverse-primary",
    tailwind: "text-inverse-primary",
    hex: "#ffb4aa",
  },
];

const secondaryColors: { token: string; tailwind: string; hex: string }[] = [
  { token: "secondary", tailwind: "bg-secondary", hex: "#555f6f" },
  { token: "on-secondary", tailwind: "text-on-secondary", hex: "#ffffff" },
  {
    token: "secondary-container",
    tailwind: "bg-secondary-container",
    hex: "#d6e0f3",
  },
  {
    token: "on-secondary-container",
    tailwind: "text-on-secondary-container",
    hex: "#596373",
  },
  {
    token: "secondary-fixed",
    tailwind: "bg-secondary-fixed",
    hex: "#d9e3f6",
  },
  {
    token: "secondary-fixed-dim",
    tailwind: "bg-secondary-fixed-dim",
    hex: "#bdc7d9",
  },
  {
    token: "on-secondary-fixed",
    tailwind: "text-on-secondary-fixed",
    hex: "#121c2a",
  },
  {
    token: "on-secondary-fixed-variant",
    tailwind: "text-on-secondary-fixed-variant",
    hex: "#3d4756",
  },
];

const tertiaryColors: { token: string; tailwind: string; hex: string }[] = [
  { token: "tertiary", tailwind: "bg-tertiary", hex: "#705d00" },
  { token: "on-tertiary", tailwind: "text-on-tertiary", hex: "#ffffff" },
  {
    token: "tertiary-container",
    tailwind: "bg-tertiary-container",
    hex: "#caa900",
  },
  {
    token: "on-tertiary-container",
    tailwind: "text-on-tertiary-container",
    hex: "#4c3e00",
  },
  {
    token: "tertiary-fixed",
    tailwind: "bg-tertiary-fixed",
    hex: "#ffe171",
  },
  {
    token: "tertiary-fixed-dim",
    tailwind: "bg-tertiary-fixed-dim",
    hex: "#e9c400",
  },
  {
    token: "on-tertiary-fixed",
    tailwind: "text-on-tertiary-fixed",
    hex: "#221b00",
  },
  {
    token: "on-tertiary-fixed-variant",
    tailwind: "text-on-tertiary-fixed-variant",
    hex: "#554600",
  },
];

const errorColors: { token: string; tailwind: string; hex: string }[] = [
  { token: "error", tailwind: "bg-error", hex: "#ba1a1a" },
  { token: "on-error", tailwind: "text-on-error", hex: "#ffffff" },
  {
    token: "error-container",
    tailwind: "bg-error-container",
    hex: "#ffdad6",
  },
  {
    token: "on-error-container",
    tailwind: "text-on-error-container",
    hex: "#93000a",
  },
];

const lineColors: { token: string; tailwind: string; hex: string }[] = [
  { token: "outline", tailwind: "ring-outline", hex: "#926f6a" },
  {
    token: "outline-variant",
    tailwind: "ring-outline-variant",
    hex: "#e7bdb7",
  },
];

function ColorGroup({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: { token: string; tailwind: string; hex: string }[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-headline text-lg font-bold text-on-surface">
          {title}
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <li
            key={row.token}
            className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3 ring-1 ring-outline-variant/10"
          >
            <div
              className="h-12 w-12 shrink-0 rounded-lg ring-1 ring-outline-variant/20"
              style={{ backgroundColor: row.hex }}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="font-mono text-xs font-semibold text-on-surface">
                {row.token}
              </p>
              <p className="truncate font-mono text-[11px] text-on-surface-variant">
                {row.tailwind}
              </p>
              <p className="font-mono text-[11px] text-secondary">{row.hex}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const overviewColors = [
  {
    label: "Primary",
    displayName: "Guardsman Red",
    hex: "#bc000a",
    swatchClass: "bg-primary",
    strip: ["bg-primary", "bg-primary/70", "bg-primary/45"] as const,
  },
  {
    label: "Secondary",
    displayName: "Mid Gray",
    hex: "#555f6f",
    swatchClass: "bg-secondary",
    strip: ["bg-secondary", "bg-secondary/70", "bg-secondary/45"] as const,
  },
  {
    label: "Tertiary",
    displayName: "Antique Bronze",
    hex: "#705d00",
    swatchClass: "bg-tertiary",
    strip: ["bg-tertiary", "bg-tertiary/70", "bg-tertiary/45"] as const,
  },
  {
    label: "Neutral",
    displayName: "White",
    hex: "#ffffff",
    swatchClass: "bg-surface-container-lowest ring-1 ring-outline-variant/20",
    strip: null,
  },
] as const;

const overviewType = [
  {
    role: "Headline",
    family: "Plus Jakarta Sans",
    className: "font-headline text-5xl font-extrabold tracking-tight",
  },
  {
    role: "Body",
    family: "Be Vietnam Pro",
    className: "font-body text-4xl font-medium",
  },
  {
    role: "Label",
    family: "Plus Jakarta Sans",
    className: "font-label text-2xl font-bold tracking-wide",
  },
] as const;

function DsTokenOverviewCard() {
  return (
    <Card className="p-5 md:p-6">
      <p className="mb-4 text-center font-headline text-sm font-bold text-on-surface md:text-base">
        Namaste Cam — at a glance
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          {overviewColors.map((c) => (
            <div
              key={c.label}
              className="flex flex-col rounded-xl bg-surface-container-low p-3 ring-1 ring-outline-variant/10"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-on-surface">
                    {c.label}
                  </span>
                  <p className="mt-0.5 truncate text-[10px] font-semibold leading-tight text-secondary">
                    {c.displayName}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-on-surface-variant">
                  {c.hex}
                </span>
              </div>
              <div
                className={`mt-2 h-14 w-full rounded-lg ${c.swatchClass}`}
                aria-hidden
              />
              {c.strip ? (
                <div
                  className="mt-2 flex h-2 gap-px overflow-hidden rounded-full"
                  aria-hidden
                >
                  {c.strip.map((cls, i) => (
                    <div
                      key={`${c.label}-strip-${i}`}
                      className={`min-w-0 flex-1 ${cls}`}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="mt-2 flex h-2 gap-px overflow-hidden rounded-full ring-1 ring-inset ring-outline-variant/30"
                  aria-hidden
                >
                  <div className="min-w-0 flex-1 bg-surface-container-high" />
                  <div className="min-w-0 flex-1 bg-surface-container" />
                  <div className="min-w-0 flex-1 bg-surface-container-low" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid gap-3">
          {overviewType.map((t) => (
            <div
              key={t.role}
              className="flex flex-col rounded-xl bg-surface-container-low p-3 ring-1 ring-outline-variant/10"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-on-surface">
                  {t.role}
                </span>
                <span className="max-w-[55%] truncate text-right font-mono text-[10px] text-on-surface-variant">
                  {t.family}
                </span>
              </div>
              <p
                className={`mt-2 text-on-surface ${t.className}`}
                aria-hidden
              >
                Aa
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function DsProjectReference() {
  return (
    <section
      id="project-tokens"
      className="scroll-mt-28 space-y-10 border-t border-outline-variant/20 pt-16"
    >
      <div className="space-y-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
          Reference
        </p>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
          Project tokens & guidelines
        </h2>
        <p className="max-w-3xl text-on-surface-variant">
          Values below mirror{" "}
          <code className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-xs text-on-surface">
            app/globals.css
          </code>{" "}
          (<span className="font-mono">@theme inline</span>) and the narrative
          in{" "}
          <code className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-xs text-on-surface">
            design-system.md
          </code>
          .
        </p>
      </div>

      <DsTokenOverviewCard />

      <Card className="space-y-6 p-6 md:p-8">
        <div>
          <h3 className="font-headline text-lg font-bold text-on-surface">
            Typography & icons
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            CSS variables are set in the root layout; semantic classes map in
            theme.
          </p>
        </div>
        <ul className="divide-y divide-outline-variant/15">
          <li className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="font-semibold text-on-surface">Plus Jakarta Sans</p>
              <p className="font-mono text-xs text-on-surface-variant">
                --font-plus-jakarta · className{" "}
                <span className="text-primary">font-headline</span>,{" "}
                <span className="text-primary">font-label</span>
              </p>
            </div>
            <p className="text-sm text-secondary">
              Weights loaded: 400, 500, 600, 700, 800
            </p>
          </li>
          <li className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="font-semibold text-on-surface">Be Vietnam Pro</p>
              <p className="font-mono text-xs text-on-surface-variant">
                --font-be-vietnam · className{" "}
                <span className="text-primary">font-body</span>
              </p>
            </div>
            <p className="text-sm text-secondary">
              Weights loaded: 300, 400, 500, 600, 700
            </p>
          </li>
          <li className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="font-semibold text-on-surface">
                Material Symbols Outlined
              </p>
              <p className="font-mono text-xs text-on-surface-variant">
                Google Fonts stylesheet ·{" "}
                <span className="text-primary">MaterialIcon</span> (
                <span className="font-mono">.material-symbols-outlined</span>)
              </p>
            </div>
            <p className="text-sm text-secondary">
              Opsz 24, wght 400, FILL 0–1 — ligature names (e.g.{" "}
              <span className="font-mono">search</span>)
            </p>
          </li>
        </ul>
      </Card>

      <Card className="space-y-10 p-6 md:p-8">
        <ColorGroup
          title="Surfaces & text"
          description="Page canvas, containers, and default copy colors."
          rows={surfaceAndTextColors}
        />
        <ColorGroup
          title="Primary"
          description="Saffron-heat red for CTAs, emphasis, and brand accents."
          rows={primaryColors}
        />
        <ColorGroup
          title="Secondary"
          description="Cool slate neutrals for UI chrome and de-emphasized text."
          rows={secondaryColors}
        />
        <ColorGroup
          title="Tertiary"
          description="Accent gold / warm highlights where needed."
          rows={tertiaryColors}
        />
        <ColorGroup
          title="Error"
          description="Destructive states and validation."
          rows={errorColors}
        />
        <ColorGroup
          title="Lines"
          description="Rings and dividers; prefer outline-variant at low opacity."
          rows={lineColors}
        />
      </Card>

      <Card className="space-y-4 p-6 md:p-8">
        <h3 className="font-headline text-lg font-bold text-on-surface">
          Radius & shadow
        </h3>
        <ul className="grid gap-4 sm:grid-cols-2">
          <li className="rounded-lg bg-surface-container-low p-4 ring-1 ring-outline-variant/10">
            <p className="font-mono text-xs font-semibold text-on-surface">
              rounded-lg
            </p>
            <p className="text-sm text-on-surface-variant">1.25rem (20px)</p>
          </li>
          <li className="rounded-xl bg-surface-container-low p-4 ring-1 ring-outline-variant/10">
            <p className="font-mono text-xs font-semibold text-on-surface">
              rounded-xl
            </p>
            <p className="text-sm text-on-surface-variant">1.75rem (28px)</p>
          </li>
          <li className="rounded-full bg-surface-container-low px-4 py-3 ring-1 ring-outline-variant/10">
            <p className="font-mono text-xs font-semibold text-on-surface">
              rounded-full
            </p>
            <p className="text-sm text-on-surface-variant">9999px — pills</p>
          </li>
          <li className="rounded-DEFAULT bg-surface-container-low p-4 ring-1 ring-outline-variant/10">
            <p className="font-mono text-xs font-semibold text-on-surface">
              rounded-DEFAULT
            </p>
            <p className="text-sm text-on-surface-variant">0.75rem (12px)</p>
          </li>
        </ul>
        <div className="rounded-xl bg-primary p-6 text-on-primary shadow-primary-soft">
          <p className="font-mono text-xs font-semibold">shadow-primary-soft</p>
          <p className="mt-1 text-sm opacity-90">
            0 8px 24px -6px rgb(188 0 10 / 0.22) — primary button glow
          </p>
        </div>
      </Card>

      <Card className="space-y-4 p-6 md:p-8">
        <h3 className="font-headline text-lg font-bold text-on-surface">
          From design-system.md (Saffron & Stone)
        </h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-on-surface-variant">
          <li>
            <strong className="text-on-surface">North star:</strong> modern
            brasserie — warm heritage plus editorial white space; avoid rigid
            “default app” density.
          </li>
          <li>
            Primary copy uses on-surface tones; avoid pure black (
            <span className="font-mono">#000</span>).
          </li>
          <li>
            Prefer tonal surfaces over heavy borders: cards on{" "}
            <span className="font-mono">surface-container-lowest</span> over{" "}
            <span className="font-mono">surface</span>.
          </li>
          <li>
            Navigation and floating chrome: glass via{" "}
            <span className="font-mono">backdrop-blur</span> and semi-opaque
            fills (~80%).
          </li>
          <li>
            Elevation: <span className="font-mono">shadow-sm</span> on cards,{" "}
            <span className="font-mono">shadow-md</span> for emphasis,{" "}
            <span className="font-mono">shadow-lg</span> for floating actions.
          </li>
          <li>
            Buttons stay pill-shaped (<span className="font-mono">
              rounded-full
            </span>
            ); food imagery often <span className="font-mono">rounded-lg</span>{" "}
            for contrast.
          </li>
          <li>
            Use primary red sparingly for CTAs and key prices; mix weights for
            hierarchy, not only size jumps.
          </li>
        </ul>
      </Card>
    </section>
  );
}
