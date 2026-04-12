import type { HTMLAttributes } from "react";

type MaterialIconProps = {
  name: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children">;

export function MaterialIcon({ name, className, ...rest }: MaterialIconProps) {
  return (
    <span
      className={["material-symbols-outlined", className].filter(Boolean).join(" ")}
      aria-hidden
      {...rest}
    >
      {name}
    </span>
  );
}
