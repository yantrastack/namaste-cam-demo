import type { ReactNode } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/** Full-width surface canvas inside the dashboard main column (matches admin user mockup). */
export function UserModuleCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-6 -mb-6 min-h-[calc(100%-0.5rem)] bg-surface px-4 pb-28 pt-2 sm:px-6 md:pb-10 lg:px-10 lg:pt-6">
      {children}
    </div>
  );
}

export type UserBreadcrumb = { label: string; href?: string };

type UserScreenToolbarProps = {
  /** Ordered trail; omit `href` on the last item for the current page. */
  breadcrumbs: UserBreadcrumb[];
};

/** Breadcrumb row for user-module screens (Namaste Cam admin). */
export function UserScreenToolbar({ breadcrumbs }: UserScreenToolbarProps) {
  if (breadcrumbs.length === 0) return null;

  return (
    <nav
      className="mb-6 border-b border-stone-200/60 pb-4"
      aria-label="Breadcrumb"
    >
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-0.5 gap-y-1 p-0 font-headline text-sm">
        {breadcrumbs.map((item, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center">
              {i > 0 ? (
                <MaterialIcon
                  name="chevron_right"
                  className="mx-1 text-base text-stone-400"
                  aria-hidden
                />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="font-semibold text-primary transition-colors hover:text-primary-container hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "font-extrabold tracking-tight text-on-surface"
                      : "font-semibold text-secondary"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
