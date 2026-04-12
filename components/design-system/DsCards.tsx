import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";

export function DsCards() {
  return (
    <section className="space-y-12">
      <div className="border-b border-outline-variant/20 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight">
          04 Card Components
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4 md:grid-cols-2">
        <div className="group overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md">
          <div className="relative aspect-square w-full p-2">
            <Image
              alt=""
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClk9eu46S9Lqmjc-qYq29kw3Jk_WoxY76HMrRrPwmW8QeMg3jyw3CXuGsLb6xgUGxiA18yqBgwlxfKStP1z4bz651AcJ16tlymkyTuU3_zJnB5DFSr15dbUEsaijzxoxDL49vvEK91HRW48eQoVw9dYjgUtEyRWxj2bDwhnE_FzHY3ylKXotRqE77C8BCbwD1Xk48pWHlLMWxJ8Q0YK2eyHQCgER9ClmNLuJ4ucLN6wSomBqE0ZXI3jbnFvwGbSU9YGjtS1Vh3KEe6"
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
          <div className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
                Pasta &amp; Grains
              </span>
              <span className="font-bold text-primary">$24</span>
            </div>
            <h3 className="text-lg font-bold">Truffle Saffron Linguine</h3>
            <button
              type="button"
              className="mt-4 w-full rounded-full bg-stone-100 py-2 font-bold transition-all group-hover:bg-primary group-hover:text-white"
            >
              Quick Add
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
          <div>
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MaterialIcon name="restaurant_menu" />
              </div>
              <button
                type="button"
                className="rounded-full p-2 transition-colors hover:bg-stone-100"
                aria-label="More"
              >
                <MaterialIcon name="more_vert" className="text-stone-400" />
              </button>
            </div>
            <h3 className="mb-2 text-xl font-bold">Seasonal Menu</h3>
            <p className="text-sm leading-relaxed text-stone-500">
              Update your available dishes for the Autumn 2024 season harvest.
            </p>
          </div>
          <div className="mt-8 flex gap-2">
            <Button size="md" className="flex-1 text-sm">
              Edit Menu
            </Button>
            <button
              type="button"
              className="rounded-full bg-stone-100 px-4 py-3"
              aria-label="Preview"
            >
              <MaterialIcon name="visibility" className="text-stone-600" />
            </button>
          </div>
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
          <div className="space-y-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-stone-400">
              Revenue Growth
            </p>
            <h3 className="text-3xl font-extrabold">$142.8k</h3>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-600">
              <MaterialIcon name="trending_up" className="!text-sm" />
              12.5%
            </span>
            <span className="text-xs text-stone-400">vs last month</span>
          </div>
        </div>

        <div className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-lg">
          <Image
            alt=""
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD225yBu0s9aSQtUJPWyDzYyPonYGmrrkxCX5Un2DfOcncIdqjWMlHeyV8f0LdDctiSrDrGNxah7o31Xe7B2hpcFAs1TlDXL4lvzN-psm6Ut1QdSYzurY6iuyjzLIpClEpAHRICpEU1OMHGJJHBqbxcR63By64BffxIinYXdNdwa-sXZuhw5xX3FVsr_iOED5Uw9JnUmZyJkMrRvAURPnQzEfLOUI5SDlVBZnr9EY4GhezoeGb92xOTSaXLYSrOrN49FUy076uPcVks"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <h4 className="mb-1 text-xl font-bold text-white">
              Chef&apos;s Table Experience
            </h4>
            <p className="mb-4 text-xs text-white/70">
              A sensory journey through the heart of Namaste Cam.
            </p>
            <button
              type="button"
              className="w-full rounded-full bg-white py-2 text-sm font-bold text-stone-950"
            >
              Book Reservation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
