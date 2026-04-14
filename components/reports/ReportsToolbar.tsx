import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";

/** Shared report chrome — wire to real export when backend exists. */
export function ReportsToolbar() {
  return (
    <>
      <Button variant="secondary" size="sm" type="button">
        <MaterialIcon name="calendar_today" className="text-lg" />
        Last 30 days
      </Button>
      <Button variant="primary" size="sm" type="button">
        <MaterialIcon name="download" className="text-lg" />
        Export
      </Button>
    </>
  );
}
