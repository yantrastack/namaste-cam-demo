"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

type UserAvatarProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
};

/** Supports remote URLs and data URLs from uploaded photos. */
export function UserAvatar({
  src,
  alt = "",
  width,
  height,
  className,
}: UserAvatarProps) {
  if (src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- data URLs from uploads
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-cover", className)}
      unoptimized
    />
  );
}
