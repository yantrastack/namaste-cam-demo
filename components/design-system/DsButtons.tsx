import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";

export function DsButtons() {
  return (
    <section className="space-y-12" id="buttons">
      <div className="border-b border-outline-variant/20 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight">02 Buttons</h2>
      </div>
      <div className="rounded-lg bg-surface-container-lowest p-10 shadow-sm">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg">Primary Action</Button>
              <Button size="md">Medium</Button>
              <Button size="sm">Small</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary" size="lg">
                Secondary
              </Button>
              <Button variant="outline" size="lg">
                Outline
              </Button>
              <Button variant="ghost" size="lg">
                Ghost
              </Button>
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="danger" size="lg">
                Danger Zone
              </Button>
              <Button size="lg" disabled>
                Disabled State
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg shadow-primary-soft"
              >
                <MaterialIcon name="add" />
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-on-primary shadow-md shadow-primary-soft"
              >
                <span>Proceed to Cart</span>
                <MaterialIcon name="shopping_bag" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
