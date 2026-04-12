import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";

export function DsEmpty() {
  return (
    <section className="space-y-6 rounded-xl bg-stone-100 p-16 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-stone-300">
        <MaterialIcon name="search_off" className="text-6xl" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">No Ingredients Found</h3>
        <p className="mx-auto max-w-sm text-stone-500">
          Try adjusting your filters or adding a new seasonal item to your
          pantry.
        </p>
      </div>
      <Button size="md" className="shadow-lg shadow-primary-soft">
        Add New Item
      </Button>
    </section>
  );
}
