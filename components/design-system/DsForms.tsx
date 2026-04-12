import { MaterialIcon } from "@/components/MaterialIcon";
import { Input } from "@/components/ui/Input";

export function DsForms() {
  return (
    <section className="space-y-12" id="forms">
      <div className="border-b border-outline-variant/20 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight">
          03 Forms &amp; Inputs
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-10 rounded-lg bg-surface-container-lowest p-10 shadow-sm md:grid-cols-2">
        <div className="space-y-6">
          <Input
            label="Email Address"
            id="ds-email"
            name="email"
            type="email"
            placeholder="chef@namastecam.com"
            left={<MaterialIcon name="mail" />}
          />
          <Input
            label="Password"
            id="ds-password"
            name="password"
            type="password"
            defaultValue="secretpassword"
          />
          <Input
            label="Success State"
            id="ds-success"
            name="success"
            type="text"
            defaultValue="Premium Subscription Active"
            success="Everything looks delicious!"
          />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="ds-notes"
              className="ml-1 text-sm font-bold text-on-surface"
            >
              Chef&apos;s Notes
            </label>
            <textarea
              id="ds-notes"
              rows={4}
              placeholder="Describe your secret ingredient..."
              className="w-full resize-none rounded-xl border-none bg-surface px-4 py-4 ring-1 ring-outline-variant/20 outline-none transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
          <Input
            label="Error State"
            id="ds-error"
            name="error"
            type="text"
            defaultValue="Invalid Recipe Code"
            error="Please enter a valid 8-digit code."
          />
        </div>
      </div>
    </section>
  );
}
