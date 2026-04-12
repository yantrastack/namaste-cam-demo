"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { UserAvatar } from "@/components/users/UserAvatar";
import { useUsers } from "@/components/users/UsersProvider";
import { cn } from "@/lib/cn";

export function UserSidebarDirectory() {
  const pathname = usePathname();
  const { users, hydrated } = useUsers();

  const sorted = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users],
  );

  if (!hydrated) return null;

  return (
    <div className="mt-2 border-t border-outline-variant/25 pt-2">
      <p className="mb-1.5 px-2 text-[10px] font-extrabold tracking-widest text-stone-400 uppercase">
        In this directory
      </p>
      <div className="max-h-52 space-y-0.5 overflow-y-auto overscroll-contain pr-0.5">
        {sorted.map((u) => {
          const href = `/users/${u.id}`;
          const active = pathname === href;
          return (
            <Link
              key={u.id}
              href={href}
              title={u.name}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 items-center gap-2 rounded-full py-1.5 pr-2 pl-1 text-xs font-semibold transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-secondary hover:bg-surface-container-high hover:text-on-surface",
              )}
            >
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-outline-variant/30">
                <UserAvatar
                  src={u.avatarUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="h-full w-full"
                />
              </span>
              <span className="min-w-0 flex-1 truncate">{u.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
