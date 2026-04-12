import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/10",
        className,
      )}
      {...props}
    />
  );
}
