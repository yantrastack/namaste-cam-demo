"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  category: "Kitchen Staff" | "Delivery Staff" | "Management";
  avatar: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "Active" | "Late" | "Completed";
  isCheckedIn: boolean;
}

const dummyStaff: StaffMember[] = [
  {
    id: "1",
    name: "John Smith",
    role: "Head Chef",
    category: "Kitchen Staff",
    avatar: "JS",
    checkInTime: "08:45 AM",
    status: "Active",
    isCheckedIn: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Sous Chef",
    category: "Kitchen Staff",
    avatar: "SJ",
    checkInTime: "09:15 AM",
    status: "Late",
    isCheckedIn: true,
  },
  {
    id: "3",
    name: "Mike Davis",
    role: "Delivery Driver",
    category: "Delivery Staff",
    avatar: "MD",
    checkInTime: "08:30 AM",
    checkOutTime: "02:30 PM",
    status: "Completed",
    isCheckedIn: false,
  },
  {
    id: "4",
    name: "Emily Wilson",
    role: "Restaurant Manager",
    category: "Management",
    avatar: "EW",
    checkInTime: "08:00 AM",
    status: "Active",
    isCheckedIn: true,
  },
  {
    id: "5",
    name: "Carlos Martinez",
    role: "Line Cook",
    category: "Kitchen Staff",
    avatar: "CM",
    checkInTime: "08:20 AM",
    status: "Active",
    isCheckedIn: true,
  },
  {
    id: "6",
    name: "Lisa Thompson",
    role: "Delivery Driver",
    category: "Delivery Staff",
    avatar: "LT",
    checkInTime: "07:45 AM",
    checkOutTime: "03:45 PM",
    status: "Completed",
    isCheckedIn: false,
  },
  {
    id: "7",
    name: "David Brown",
    role: "General Manager",
    category: "Management",
    avatar: "DB",
    checkInTime: "08:10 AM",
    status: "Active",
    isCheckedIn: true,
  },
];

type FilterRole = "All" | "Kitchen Staff" | "Delivery Staff" | "Management";
type FilterStatus = "All" | "Active" | "Late" | "Completed";

export function StaffAttendanceView() {
  const [staff, setStaff] = useState<StaffMember[]>(dummyStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<FilterRole>("All");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("All");
  const [selectedDate, setSelectedDate] = useState("");

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalStaff = staff.length;
    const checkedIn = staff.filter(s => s.isCheckedIn).length;
    const checkedOut = staff.filter(s => !s.isCheckedIn && s.checkOutTime).length;
    const activeNow = staff.filter(s => s.isCheckedIn && s.status === "Active").length;

    return { totalStaff, checkedIn, checkedOut, activeNow };
  }, [staff]);

  // Filter staff based on search and filters
  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === "All" || member.category === selectedRole;
      const matchesStatus = selectedStatus === "All" || member.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staff, searchQuery, selectedRole, selectedStatus]);

  // Group staff by category
  const staffByCategory = useMemo(() => {
    const categories: Record<string, StaffMember[]> = {
      "Kitchen Staff": [],
      "Delivery Staff": [],
      "Management": [],
    };

    filteredStaff.forEach(member => {
      categories[member.category].push(member);
    });

    return categories;
  }, [filteredStaff]);

  // Calculate total hours
  const calculateTotalHours = (member: StaffMember) => {
    if (!member.checkInTime) return "0h 0m";
    
    const now = new Date();
    const checkIn = new Date();
    const [time, period] = member.checkInTime.split(" ");
    const [checkInHours, checkInMinutes] = time.split(":").map(Number);
    
    checkIn.setHours(period === "PM" && checkInHours !== 12 ? checkInHours + 12 : checkInHours);
    checkIn.setMinutes(checkInMinutes);
    
    const diff = now.getTime() - checkIn.getTime();
    const totalMinutes = Math.floor(diff / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    return `${totalHours}h ${remainingMinutes}m`;
  };

  // Handle check-in/check-out
  const handleCheckInOut = (memberId: string) => {
    setStaff(prev => prev.map(member => {
      if (member.id === memberId) {
        if (member.isCheckedIn) {
          // Check out
          const now = new Date();
          const checkOutTime = now.toLocaleTimeString("en-US", { 
            hour: "2-digit", 
            minute: "2-digit",
            hour12: true 
          });
          return {
            ...member,
            isCheckedIn: false,
            checkOutTime,
            status: "Completed" as const,
          };
        } else {
          // Check in
          const now = new Date();
          const checkInTime = now.toLocaleTimeString("en-US", { 
            hour: "2-digit", 
            minute: "2-digit",
            hour12: true 
          });
          const hour = now.getHours();
          const status = hour >= 9 ? "Late" as const : "Active" as const;
          return {
            ...member,
            isCheckedIn: true,
            checkInTime,
            checkOutTime: undefined,
            status,
          };
        }
      }
      return member;
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-extrabold text-on-surface">
          Staff Attendance
        </h1>
        <p className="mt-2 text-base font-medium text-secondary">
          Monitor and manage staff attendance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-primary/10 p-4">
              <MaterialIcon name="group" className="text-3xl text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-on-surface">{stats.totalStaff}</p>
              <p className="text-sm font-semibold text-secondary">Total Staff</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-green-50 p-4">
              <MaterialIcon name="login" className="text-3xl text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-on-surface">{stats.checkedIn}</p>
              <p className="text-sm font-semibold text-secondary">Checked-In</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-amber-50 p-4">
              <MaterialIcon name="logout" className="text-3xl text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-on-surface">{stats.checkedOut}</p>
              <p className="text-sm font-semibold text-secondary">Checked-Out</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-50 p-4">
              <MaterialIcon name="schedule" className="text-3xl text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-on-surface">{stats.activeNow}</p>
              <p className="text-sm font-semibold text-secondary">Active Now</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-stone-400" />
              <input
                type="text"
                placeholder="Search staff by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border-none bg-surface py-4 pl-12 pr-4 text-base font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as FilterRole)}
              className="rounded-2xl border-none bg-surface px-6 py-4 text-base font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Roles</option>
              <option value="Kitchen Staff">Kitchen Staff</option>
              <option value="Delivery Staff">Delivery Staff</option>
              <option value="Management">Management</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as FilterStatus)}
              className="rounded-2xl border-none bg-surface px-6 py-4 text-base font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Late">Late</option>
              <option value="Completed">Completed</option>
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-2xl border-none bg-surface px-6 py-4 text-base font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </Card>

      {/* Staff List by Category */}
      <div className="space-y-8">
        {Object.entries(staffByCategory).map(([category, members]) => (
          <div key={category}>
            <h2 className="mb-6 text-xl font-bold text-on-surface">{category}</h2>
            
            {members.length === 0 ? (
              <Card className="rounded-2xl p-8 text-center shadow-lg">
                <p className="text-secondary">No {category.toLowerCase()} found</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <Card key={member.id} className="rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 font-headline text-lg font-bold text-primary">
                          {member.avatar}
                        </div>
                        
                        {/* Staff Info */}
                        <div>
                          <h3 className="text-base font-semibold text-on-surface">{member.name}</h3>
                          <p className="text-sm text-secondary">{member.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        {/* Times */}
                        <div className="text-right">
                          <p className="text-sm font-medium text-on-surface">
                            {member.checkInTime || "-"}
                          </p>
                          <p className="text-sm text-secondary">
                            {member.checkOutTime || "-"}
                          </p>
                        </div>

                        {/* Total Hours */}
                        <div className="text-right min-w-[80px]">
                          <p className="text-sm font-medium text-on-surface">
                            {member.isCheckedIn ? calculateTotalHours(member) : "0h 0m"}
                          </p>
                          <p className="text-xs text-secondary">Total hours</p>
                        </div>

                        {/* Status Badge */}
                        <div className="min-w-[80px]">
                          <Badge
                            tone={
                              member.status === "Active"
                                ? "success"
                                : member.status === "Late"
                                ? "warning"
                                : "neutral"
                            }
                          >
                            {member.status}
                          </Badge>
                        </div>

                        {/* Action Button */}
                        <Button
                          variant={member.isCheckedIn ? "outline" : "primary"}
                          size="sm"
                          onClick={() => handleCheckInOut(member.id)}
                          className="rounded-2xl px-6 py-3"
                        >
                          <MaterialIcon 
                            name={member.isCheckedIn ? "logout" : "login"} 
                            className="text-lg"
                          />
                          {member.isCheckedIn ? "Check-out" : "Check-in"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
