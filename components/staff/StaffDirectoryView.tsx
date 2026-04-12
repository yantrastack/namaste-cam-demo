"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { AddStaffModal } from "./AddStaffModal";

// Types for staff member
interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Chef" | "Cook" | "Delivery" | "Manager";
  location: "Cambridge" | "Peterborough" | "Huntingdon" | "Ely";
  priorityDispatch: boolean;
  status: "active" | "inactive";
  lastLogin: string;
  avatarUrl?: string;
}

// Mock data for staff members
const mockStaffMembers: StaffMember[] = [
  {
    id: "1",
    name: "Alexander Sterling",
    email: "alex.sterling@saffronstone.com",
    phone: "+44 7700 900 123",
    role: "Delivery",
    location: "Cambridge",
    priorityDispatch: true,
    status: "active",
    lastLogin: "2 hours ago",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHLajKyimQyGESuCj0IGy-hUkCqUx0Aah7NaAKNQwDHGOzAQQ2GuFvIU5_7X67qvpa4Mklf5c0YJOFXGj4f1KfTlxHzGNyW6OnqiIVT68OfceeY4ktfe7JufYcFQHHCLx71USAqSW863DTWFAES_6wRisnPYGZdLC9FTNoiFtvElVJCGlbfqFVSObJhEbmRr4ZOFlN8q9RimhIjlvgoBaSaA5EMRtvBMlAb9yNYZEdEgEBXds_vRW4y7-M_o78xqWy1GuTllZwYN0"
  },
  {
    id: "2", 
    name: "Maria Rodriguez",
    email: "maria.r@saffronstone.com",
    phone: "+44 7700 900 456",
    role: "Chef",
    location: "Peterborough",
    priorityDispatch: false,
    status: "active",
    lastLogin: "1 day ago",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEffu9YXH9aruk8Sd2T9AP9r7sW69FBve9bqUSq7ILQshbwEnFBtx4TEF4mCANtYWyDUz7W5ELelrZMuw9k_coZnNhpzckG472vZTgDmvGwQasUhwFluIQzXQ-asnfU52RXDDFU5p_gAMNsjTjWYcScoXNXRWp8INMUevmTPc2FJSQeWRf9FPeiZJdJqvHnz9no7foPp83tWvY5oSePbjV44WF_gP6s80WQ5g-RM8S4ISXD1YGUTAF35RQlPA8yyrk9c5wkUvi_aQ"
  },
  {
    id: "3",
    name: "James Chen",
    email: "james.c@saffronstone.com", 
    phone: "+44 7700 900 789",
    role: "Manager",
    location: "Cambridge",
    priorityDispatch: true,
    status: "active",
    lastLogin: "3 hours ago",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCto_nrbq5CccRRrPYdgXFD_1Lk4M2sw7kdPrASoR0xwTBseo36K285FVqHbEtRt-_BmwL9z_kVjOyX3DbIPuus2SIpf3vfpAlrZii5s49glEkYanRMxfdDuiUf025LNZA2iIPAMcR16LQpjAHHdDfWsef3bC6kf_w19wOZv45IiV5m74rAnFae4GzZnKh9T1zQK3cxij58vsOyTjbk7X1jtog2sVK9VtPEHo-1SO5enEKNA3X2ZAzuwBRRNhVXjkAlciRXItCkLoE"
  },
  {
    id: "4",
    name: "Sophie Martin",
    email: "sophie.m@saffronstone.com",
    phone: "+44 7700 900 012",
    role: "Cook",
    location: "Huntingdon",
    priorityDispatch: false,
    status: "active",
    lastLogin: "5 hours ago",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOZWEUGvoIUVJmmKLaAgvmW38Je9-wJUXw57cuD_T4VkjOhAlXClDm4BZDQCgKl1xziurYfL_u-BKttQmstq1-8_jBgYKIBQujjyR515wRWiTP8x9tXRpUk3nFlYLv47pcH89HgRKrDioftUMNJABd7Pn-ouFShyjTSYDSBZ5-iVUHdvyGdBo3-lx3opprEvMInjm9T6_FkjR0Healgdu2TUWFlYkzaIcaCaMt3vS6Iv5iKy-80Vq53XRrScxYzOvGbZmlrcQZeig"
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@saffronstone.com",
    phone: "+44 7700 900 345",
    role: "Delivery",
    location: "Ely",
    priorityDispatch: true,
    status: "inactive",
    lastLogin: "2 days ago",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSRWzZK2RnD7KG1rvGCaQY1lGLU0voJXQQGTtzbDSExfxFTvjatFRFa0DPyH83ZBBwqZ0sgW0gWJQOekQbES_5DOAmchuKS3ClyPmk62gndv5wG8PulMRaecsKZKkST9bXWLT50zbXpv556qp6x9MZUjdiLz3-YeWJJIwj8hdo8kK5XqRMyHsgMyzjNrg1oFhTsdPH3zQ-3sz8emZiA_vZxCkZ0s8LPOf1N9FMke9aWCJ6E76aUd29M4xE_a36ew2lMczlr0QCl2M"
  }
];

function rolePillClass(role: StaffMember["role"]): string {
  switch (role) {
    case "Chef":
      return "bg-amber-50 text-amber-800";
    case "Cook":
      return "bg-blue-50 text-blue-800";
    case "Delivery":
      return "bg-green-50 text-green-800";
    case "Manager":
      return "bg-purple-50 text-purple-800";
    default:
      return "bg-surface-container-high text-zinc-500";
  }
}

export function StaffDirectoryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState(mockStaffMembers);

  const filteredStaff = useMemo(() => {
    return staffMembers.filter(staff => {
      const matchesSearch = !searchQuery || 
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = filterRole === "all" || staff.role === filterRole;
      const matchesLocation = filterLocation === "all" || staff.location === filterLocation;

      return matchesSearch && matchesRole && matchesLocation;
    });
  }, [searchQuery, filterRole, filterLocation, staffMembers]);

  const stats = useMemo(() => {
    const activeCount = staffMembers.filter(s => s.status === "active").length;
    const totalDelivery = staffMembers.filter(s => s.role === "Delivery").length;
    const priorityCount = staffMembers.filter(s => s.priorityDispatch).length;

    return {
      active: activeCount,
      totalDelivery,
      priority: priorityCount,
      total: staffMembers.length
    };
  }, [staffMembers]);

  const handleAddStaff = (newStaffData: any) => {
    const newStaff: StaffMember = {
      id: Date.now().toString(), // Generate unique ID
      ...newStaffData,
      lastLogin: "Just now",
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newStaffData.name)}&background=random`
    };
    
    setStaffMembers(prev => [...prev, newStaff]);
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Role", "Location", "Status", "Priority Dispatch", "Last Login"];
    const csvContent = [
      headers.join(","),
      ...staffMembers.map(staff => [
        staff.name,
        staff.email,
        staff.phone,
        staff.role,
        staff.location,
        staff.status,
        staff.priorityDispatch ? "Yes" : "No",
        staff.lastLogin
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `staff-directory-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Staff Directory</h2>
          <p className="text-zinc-500">Manage your restaurant staff and delivery team.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-6 py-2.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-95"
          >
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <MaterialIcon name="person_add" className="text-sm" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Staff</p>
          <h3 className="text-4xl font-extrabold text-on-surface">{stats.total}</h3>
          <div className="mt-4 w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div className="w-4/5 h-full bg-primary"></div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Active Staff</p>
          <h3 className="text-4xl font-extrabold text-on-surface">{stats.active}</h3>
          <div className="mt-4 w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-green-500"></div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Delivery Team</p>
          <h3 className="text-4xl font-extrabold text-on-surface">{stats.totalDelivery}</h3>
          <div className="mt-4 w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div className="w-2/5 h-full bg-blue-500"></div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Priority Dispatch</p>
          <h3 className="text-4xl font-extrabold text-on-surface">{stats.priority}</h3>
          <div className="mt-4 w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-amber-500"></div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between border-b border-surface-container-low">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                <MaterialIcon name="search" />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by name or email..."
                className="w-full rounded-full border-none bg-surface py-2.5 pl-12 pr-4 text-sm font-medium text-on-surface ring-1 ring-outline-variant/20 outline-none transition-all focus:ring-2 focus:ring-primary"
              />
            </div>
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-surface-container-high rounded-lg text-sm font-semibold"
            >
              <option value="all">All Roles</option>
              <option value="Chef">Chef</option>
              <option value="Cook">Cook</option>
              <option value="Delivery">Delivery</option>
              <option value="Manager">Manager</option>
            </select>
            <select 
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-2 bg-surface-container-high rounded-lg text-sm font-semibold"
            >
              <option value="all">All Locations</option>
              <option value="Cambridge">Cambridge</option>
              <option value="Peterborough">Peterborough</option>
              <option value="Huntingdon">Huntingdon</option>
              <option value="Ely">Ely</option>
            </select>
          </div>
          <div className="text-xs font-bold text-zinc-400">
            Showing {filteredStaff.length} of {staffMembers.length} staff
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-[11px] uppercase tracking-widest font-bold text-zinc-500">
              <tr>
                <th className="px-8 py-4">Staff Member</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Location</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Last Login</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-8 py-5">
                    <Link href={`/staff/${staff.id}`} className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          className="w-10 h-10 rounded-full object-cover" 
                          alt={staff.name}
                          src={staff.avatarUrl}
                        />
                        {staff.status === "active" && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface group-hover:text-primary transition-colors">
                          {staff.name}
                        </p>
                        <p className="text-xs text-zinc-500">{staff.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${rolePillClass(staff.role)}`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-zinc-500">
                    {staff.location}
                  </td>
                  <td className="px-8 py-5">
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${staff.status === "active" ? "text-green-600" : "text-error"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${staff.status === "active" ? "bg-green-600" : "bg-error"}`}></span>
                      {staff.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-zinc-500">
                    {staff.lastLogin}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/staff/${staff.id}`}
                        className="p-2 hover:bg-secondary-container rounded-lg transition-colors text-secondary" 
                        title="Edit Staff"
                      >
                        <MaterialIcon name="edit_note" className="text-lg" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStaff.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-semibold text-on-surface">No staff members match</p>
            <p className="mt-1 text-sm text-zinc-500">
              Try a different search or add a new staff member.
            </p>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddStaff}
      />
    </div>
  );
}
