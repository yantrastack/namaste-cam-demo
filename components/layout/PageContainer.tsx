import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PageContainerProps = {
  title: string;
  description?: string;
  /** Optional header actions (filters, exports) shown beside the title on larger screens. */
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PageContainer({
  title,
  description,
  actions,
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 font-medium text-on-surface-variant">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
