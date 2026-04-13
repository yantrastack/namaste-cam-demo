"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  formatJoinDate,
  useUsers,
  userStatusLabel,
} from "@/components/users/UsersProvider";
import { formatUserRole, USER_ROLE_OPTIONS } from "@/lib/users/roles";
import type { ManagedUser } from "@/lib/users/types";
import { cn } from "@/lib/cn";

/** YYYY-MM-DD or ISO prefix → sortable / displayable date part */
function isoDatePrefix(raw: string | undefined): string | null {
  if (!raw) return null;
  const t = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  if (t.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10);
  return null;
}

function formatActivityCell(user: ManagedUser): string {
  const iso = isoDatePrefix(user.lastActivity);
  if (iso) return formatJoinDate(iso);
  if (user.lastActivity?.trim()) return user.lastActivity.trim();
  return formatJoinDate(user.joinDate);
}

function activitySortTime(user: ManagedUser): number {
  const iso = isoDatePrefix(user.lastActivity);
  return new Date(iso || user.joinDate).getTime();
}

function rolePillClass(role: ManagedUser["role"]): string {
  if (role === "admin") {
    return "bg-primary-fixed text-on-primary-fixed";
  }
  if (role === "restaurant_admin") {
    return "bg-secondary-container text-on-secondary-container";
  }
  if (role === "delivery_agent") {
    return "bg-green-50 text-green-800";
  }
  if (role === "cook") {
    return "bg-amber-50 text-amber-800";
  }
  if (role === "manager") {
    return "bg-purple-50 text-purple-800";
  }
  if (role === "customer" || role === "user") {
    return "bg-blue-50 text-blue-800";
  }
  return "bg-surface-container-high text-zinc-500";
}

interface UsersListViewProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function UsersListView({ searchQuery, onSearchChange }: UsersListViewProps = {}) {
  const router = useRouter();
  const { users, hydrated } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest_activity");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  // Calculate stats
  const stats = useMemo(() => {
    const activeUsers = users.filter(u => u.status === "active").length;
    const newRegistrations = users.filter(u => {
      const joinDate = new Date(u.joinDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return joinDate >= thirtyDaysAgo;
    }).length;

    return {
      totalActive: activeUsers,
      newRegistrations,
      totalUsers: users.length
    };
  }, [users]);

  const filtered = useMemo(() => {
    let filteredUsers = [...users];
    
    // Search filter
    const q = searchQuery?.trim().toLowerCase() || "";
    if (q) {
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }

    // Role filter - special handling for "all" to show at least one of each role
    if (filterRole !== "all") {
      filteredUsers = filteredUsers.filter(u => u.role === filterRole);
    } else {
      // When "all" is selected, show at least one of each role
      const roles = USER_ROLE_OPTIONS.map((o) => o.value);
      const roleSamples: ManagedUser[] = [];
      
      roles.forEach(role => {
        const roleUsers = filteredUsers.filter(u => u.role === role);
        if (roleUsers.length > 0) {
          // Take the first user of each role, or more if there are duplicates in other roles
          roleSamples.push(roleUsers[0]);
          // Add additional users from this role if they don't appear in other roles
          const additionalUsers = roleUsers.slice(1).filter(user => 
            !roleSamples.some(existing => existing.id === user.id)
          );
          roleSamples.push(...additionalUsers);
        }
      });
      
      // Add any remaining users that weren't included yet
      const remainingUsers = filteredUsers.filter(user => 
        !roleSamples.some(existing => existing.id === user.id)
      );
      
      filteredUsers = [...roleSamples, ...remainingUsers];
    }

    // Status filter
    if (filterStatus !== "all") {
      filteredUsers = filteredUsers.filter(u => u.status === filterStatus);
    }

    // Sort
    if (sortBy === "latest_activity") {
      filteredUsers.sort(
        (a, b) => activitySortTime(b) - activitySortTime(a),
      );
    } else if (sortBy === "name") {
      filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "join_date") {
      filteredUsers.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
    }

    return filteredUsers;
  }, [users, searchQuery, filterRole, filterStatus, sortBy]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleEditUser = (user: ManagedUser) => {
    router.push(`/users/${user.id}`);
  };

  const exportCSV = () => {
    const csv = [
      ["Name", "Email", "Role", "Status", "Last Activity", "Join Date"],
      ...filtered.map(u => [
        u.name,
        u.email,
        formatUserRole(u.role),
        userStatusLabel(u.status),
        formatActivityCell(u),
        formatJoinDate(u.joinDate)
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">User Directory</h2>
          <p className="text-zinc-500">Manage administrative privileges and monitor system-wide user activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV}
            className="px-6 py-2.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-95"
          >
            Export CSV
          </button>
          <Link
            href="/users/new"
            className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <MaterialIcon name="person_add" className="text-sm" />
            Add User
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Active Users</p>
            <h3 className="text-4xl font-extrabold text-on-surface">{stats.totalActive.toLocaleString()}</h3>
            <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
              <MaterialIcon name="trending_up" className="text-xs" />
              +12% from last month
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
            <MaterialIcon name="groups" className="text-3xl" />
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">New Registrations</p>
          <h3 className="text-4xl font-extrabold text-on-surface">{stats.newRegistrations}</h3>
          <div className="mt-4 w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-primary"></div>
          </div>
        </div>
      </div>

      {/* Users Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between border-b border-surface-container-low">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-surface-container-high rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              <MaterialIcon name="filter_list" className="text-sm" />
              Filter
            </button>
            <div className="flex items-center gap-1 text-sm text-zinc-400">
              <MaterialIcon name="sort" className="text-sm" />
              Sort by: <span className="text-on-surface font-semibold">
                {sortBy === "latest_activity" ? "Latest Active" : sortBy === "name" ? "Name" : "Join Date"}
              </span>
            </div>
          </div>
          <div className="text-xs font-bold text-zinc-400">
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-8 py-4 bg-surface-container-low/50 border-b border-surface-container-low">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</label>
                <select 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="mt-1 px-3 py-2 bg-surface-container-high rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Roles</option>
                  {USER_ROLE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="mt-1 px-3 py-2 bg-surface-container-high rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sort</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-1 px-3 py-2 bg-surface-container-high rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                >
                  <option value="latest_activity">Latest Activity</option>
                  <option value="name">Name</option>
                  <option value="join_date">Join Date</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-[11px] uppercase tracking-widest font-bold text-zinc-500">
              <tr>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Last Activity</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-8 py-5">
                    <Link href={`/users/${user.id}`} className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.status === "active" && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className={`font-bold text-on-surface group-hover:text-primary transition-colors ${user.status === "blocked" ? "line-through text-zinc-400" : ""}`}>
                          {user.name}
                        </p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${rolePillClass(user.role)}`}>
                      {formatUserRole(user.role)}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${user.status === "active" ? "text-green-600" : "text-error"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-green-600" : "bg-error"}`}></span>
                      {userStatusLabel(user.status)}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-zinc-500">
                    {formatActivityCell(user)}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleEditUser(user)}
                        className="rounded-lg p-2 text-secondary transition-colors hover:bg-secondary-container"
                        title="Edit details"
                      >
                        <MaterialIcon name="edit" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedUsers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-on-surface">No users match</p>
            <p className="mt-1 text-sm text-zinc-500">
              Try a different search or <Link href="/users/new" className="font-bold text-primary hover:underline">add a user</Link>.
            </p>
          </div>
        ) : null}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-4 bg-surface-container-low/50 flex items-center justify-between">
            <p className="text-xs text-zinc-500 font-medium italic">Showing {itemsPerPage} records per page</p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === 1 ? "bg-surface-container-highest text-zinc-500 pointer-events-none opacity-50" : "hover:bg-surface-container-high"}`}
              >
                <MaterialIcon name="chevron_left" className="text-sm" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold ${
                      currentPage === pageNum 
                        ? "bg-primary text-white" 
                        : "hover:bg-surface-container-high"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2 text-zinc-400">...</span>
              )}
              {totalPages > 5 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-xs font-bold ${
                    currentPage === totalPages ? "bg-primary text-white" : ""
                  }`}
                >
                  {totalPages}
                </button>
              )}
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === totalPages ? "bg-surface-container-highest text-zinc-500 pointer-events-none opacity-50" : "hover:bg-surface-container-high"}`}
              >
                <MaterialIcon name="chevron_right" className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
