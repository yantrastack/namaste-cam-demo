"use client";

import { UsersListView } from "@/components/users/UsersListView";

interface UsersPageProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function UsersPage({ searchQuery, onSearchChange }: UsersPageProps) {
  return <UsersListView searchQuery={searchQuery} onSearchChange={onSearchChange} />;
}
