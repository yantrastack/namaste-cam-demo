import { MaterialIcon } from "@/components/MaterialIcon";

export function DsChefFab() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        type="button"
        className="group flex items-center gap-2 rounded-full bg-primary p-4 text-white shadow-2xl transition-all duration-300 hover:px-6"
      >
        <MaterialIcon name="support_agent" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-bold transition-all duration-300 group-hover:max-w-xs">
          Chef Concierge
        </span>
      </button>
    </div>
  );
}
