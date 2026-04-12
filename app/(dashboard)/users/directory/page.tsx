"use client";

import { useUsers } from "@/components/users/UsersProvider";
import { UserAvatar } from "@/components/users/UserAvatar";
import Link from "next/link";
import { useMemo } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";

export default function UserDirectoryPage() {
  const { users, hydrated } = useUsers();

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users],
  );

  if (!hydrated) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <MaterialIcon name="hourglass_empty" className="text-4xl text-secondary" />
          <p className="mt-2 text-sm text-secondary">Loading user directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-on-surface">
            User Directory
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Browse and manage all users in the system
          </p>
        </div>
        <Link href="/users/new">
          <Button size="sm" className="gap-2">
            <MaterialIcon name="person_add" />
            Add New User
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedUsers.map((user) => (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className="group block rounded-xl border border-outline-variant/20 bg-surface p-4 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-outline-variant/30 transition-colors group-hover:ring-primary/30">
                <UserAvatar
                  src={user.avatarUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="h-full w-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-on-surface group-hover:text-primary">
                  {user.name}
                </h3>
                <p className="truncate text-sm text-secondary">{user.email}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {sortedUsers.length === 0 && (
        <div className="flex h-96 items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30">
          <div className="text-center">
            <MaterialIcon name="group_off" className="text-4xl text-secondary" />
            <p className="mt-2 text-sm font-medium text-secondary">No users found</p>
            <p className="mt-1 text-xs text-secondary">
              Get started by adding your first user
            </p>
            <Link href="/users/new" className="mt-4 inline-block">
              <Button size="sm" className="gap-2">
                <MaterialIcon name="person_add" />
                Add First User
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
