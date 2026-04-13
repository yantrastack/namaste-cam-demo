"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { cn } from "@/lib/cn";
import { MenuBuilderWorkspace } from "./MenuBuilderWorkspace";
import { useMenuManagementDemo } from "./MenuManagementDemoContext";
import { DEMO_FOOD_ITEMS, type MenuRow } from "./model";

export function MenuEditScreenClient() {
  const router = useRouter();
  const params = useParams();
  const menuId = typeof params.menuId === "string" ? params.menuId : "";
  const { menus, upsertMenu } = useMenuManagementDemo();

  const menuToEdit = useMemo(() => menus.find((m) => m.id === menuId) ?? null, [menus, menuId]);
  const [workspaceKey, setWorkspaceKey] = useState(0);

  useEffect(() => {
    if (!menuId) {
      router.replace("/menu");
      return;
    }
    if (!menus.some((m) => m.id === menuId)) {
      router.replace("/menu");
    }
  }, [menuId, menus, router]);

  const handleClose = useCallback(() => {
    router.push("/menu");
  }, [router]);

  const handleSave = useCallback(
    (row: MenuRow) => {
      upsertMenu(row);
      router.push("/menu");
    },
    [router, upsertMenu],
  );

  if (!menuId || !menuToEdit) {
    return (
      <PageContainer title="Opening Master Menu…" description="Returning you to the list.">
        <div className="h-16" />
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer
        title="Edit menu"
        description={menuToEdit.name}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-outline-variant/35"
            onClick={() => router.push("/menu")}
          >
            <MaterialIcon name="arrow_back" />
            Back to list
          </Button>
        }
      >
        <Card className="max-w-xl p-6">
          <p className="text-sm font-medium leading-relaxed text-on-surface-variant">
            Update details in the drawer. Saving returns you to the master list.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3 text-primary"
            onClick={() => setWorkspaceKey((k) => k + 1)}
          >
            Reload form from saved menu
          </Button>
        </Card>
      </PageContainer>

      <Drawer
        open
        onClose={handleClose}
        position="right"
        className={cn(
          "flex h-full w-[min(100vw,1120px)]! max-w-[min(100vw,1120px)]! flex-col sm:rounded-l-2xl",
          "border-l border-outline-variant/15 shadow-2xl",
        )}
      >
        <MenuBuilderWorkspace
          key={workspaceKey}
          menuToEdit={menuToEdit}
          foodItems={DEMO_FOOD_ITEMS}
          onSave={handleSave}
          onClose={handleClose}
        />
      </Drawer>
    </>
  );
}
