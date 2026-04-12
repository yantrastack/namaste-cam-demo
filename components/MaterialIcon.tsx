import type { HTMLAttributes } from "react";

type MaterialIconProps = {
  name: string;
  filled?: boolean;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children">;

export function MaterialIcon({ name, className, filled = false, ...rest }: MaterialIconProps) {
  return (
    <span
      className={["material-symbols-outlined", className].filter(Boolean).join(" ")}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden
      {...rest}
    >
      {name}
    </span>
  );
}
