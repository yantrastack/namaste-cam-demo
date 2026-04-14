"use client";

import { createContext, useContext, type ReactNode } from "react";

export type UsersPageSearchValue = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

const UsersPageSearchContext = createContext<UsersPageSearchValue | null>(null);

export function UsersPageSearchProvider({
  value,
  children,
}: {
  value: UsersPageSearchValue | null;
  children: ReactNode;
}) {
  return (
    <UsersPageSearchContext.Provider value={value}>{children}</UsersPageSearchContext.Provider>
  );
}

export function useUsersPageSearch(): UsersPageSearchValue | null {
  return useContext(UsersPageSearchContext);
}
