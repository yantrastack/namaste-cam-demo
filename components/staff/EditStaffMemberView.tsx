"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";

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

export function EditStaffMemberView() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<StaffMember>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate loading and find staff member
    const timer = setTimeout(() => {
      const member = mockStaffMembers.find(m => m.id === id);
      if (member) {
        setStaffMember(member);
        setFormData(member);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (staffMember) {
      const changed = JSON.stringify(staffMember) !== JSON.stringify(formData);
      setHasChanges(changed);
    }
  }, [formData, staffMember]);

  const handleFieldChange = (field: keyof StaffMember, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (staffMember) {
      setFormData(staffMember);
      setHasChanges(false);
    }
  };

  const handleSave = () => {
    // Simulate saving
    console.log("Saving staff member:", formData);
    setStaffMember(formData as StaffMember);
    setHasChanges(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-12 px-12 max-w-6xl mx-auto">
        <div className="py-20 text-center text-sm text-secondary">Loading...</div>
      </div>
    );
  }

  if (!staffMember) {
    return (
      <div className="pt-28 pb-12 px-12 max-w-6xl mx-auto">
        <div className="py-20 text-center">
          <h1 className="font-headline text-2xl font-extrabold text-on-surface mb-4">
            Staff Member Not Found
          </h1>
          <p className="text-secondary mb-6">
            This staff member may have been removed or the link is invalid.
          </p>
          <button
            onClick={() => router.back()}
            className="rounded-full bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-container active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-28 pb-12 px-12 max-w-6xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleAvatarChange}
      />
      
      {/* Header Actions */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Edit Member</h3>
          <p className="text-stone-500 mt-1">Configure access levels and personal profile information.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCancel}
            disabled={!hasChanges}
            className="px-6 py-2.5 rounded-full border border-outline-variant text-stone-600 font-semibold text-sm hover:bg-surface-container-high transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-8 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Profile Photo Card (3 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img 
                alt="Staff Profile Image" 
                className="w-full h-full rounded-lg object-cover border-4 border-surface-container-high shadow-md" 
                src={formData.avatarUrl || staffMember.avatarUrl}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                <MaterialIcon name="edit" className="text-sm" />
              </button>
            </div>
            <h4 className="font-headline font-bold text-lg">{formData.name || staffMember.name}</h4>
            <p className="text-xs text-stone-500 uppercase tracking-widest font-bold mt-1">{formData.role || staffMember.role}</p>
            <div className="mt-8 pt-8 border-t border-surface-container-high">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-full bg-surface-container-high text-stone-700 font-bold text-xs hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2"
              >
                <MaterialIcon name="cloud_upload" className="text-base" />
                UPDATE PHOTO
              </button>
              <p className="text-[10px] text-stone-400 mt-4 leading-relaxed">Accepted formats: JPG, PNG. <br/>Max size: 2MB. Recommended 1:1 ratio.</p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-surface-container-lowest rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 text-stone-500 mb-4">
              <MaterialIcon name="info" />
              <span className="text-xs font-bold uppercase tracking-widest">Account Status</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Access</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                {formData.status || staffMember.status}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium">Last Login</span>
              <span className="text-xs text-stone-500">{formData.lastLogin || staffMember.lastLogin}</span>
            </div>
          </div>
        </div>

        {/* Form Information (8 cols) */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-lg p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-700">
                <MaterialIcon name="badge" />
              </div>
              <h4 className="text-xl font-headline font-extrabold">Staff Information</h4>
            </div>
            
            <form className="space-y-8">
              {/* Field Group 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Full Name</label>
                  <input 
                    className="w-full px-5 py-3.5 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-stone-400" 
                    type="text" 
                    value={formData.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Email Address</label>
                  <input 
                    className="w-full px-5 py-3.5 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-stone-400" 
                    type="email" 
                    value={formData.email || ""}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                  />
                </div>
              </div>

              {/* Field Group 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Phone Number</label>
                  <input 
                    className="w-full px-5 py-3.5 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-stone-400" 
                    type="tel" 
                    value={formData.phone || ""}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Staff Role</label>
                  <div className="relative">
                    <select 
                      className="w-full px-5 py-3.5 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary/20 text-on-surface font-medium appearance-none"
                      value={formData.role || staffMember.role}
                      onChange={(e) => handleFieldChange("role", e.target.value)}
                    >
                      <option value="Chef">Chef</option>
                      <option value="Cook">Cook</option>
                      <option value="Delivery">Delivery Agent</option>
                      <option value="Manager">Manager</option>
                    </select>
                    <MaterialIcon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" />
                  </div>
                </div>
              </div>

              {/* Location Selection */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Primary Assignment Location</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {["Cambridge", "Peterborough", "Huntingdon", "Ely"].map((location) => (
                    <label key={location} className={cn(
                      "relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all",
                      (formData.location || staffMember.location) === location
                        ? "bg-red-50 border-primary"
                        : "bg-surface-container-low border-transparent hover:bg-stone-200"
                    )}>
                      <input 
                        className="hidden" 
                        name="location" 
                        type="radio"
                        checked={(formData.location || staffMember.location) === location}
                        onChange={() => handleFieldChange("location", location)}
                      />
                      <MaterialIcon 
                        name="location_on" 
                        className={cn(
                          "mb-2",
                          (formData.location || staffMember.location) === location
                            ? "text-primary"
                            : "text-stone-400 group-hover:text-stone-600"
                        )} 
                      />
                      <span className={cn(
                        "text-sm font-bold",
                        (formData.location || staffMember.location) === location
                          ? "text-red-700"
                          : "text-stone-600"
                      )}>
                        {location}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced Settings Toggle */}
              <div className="pt-8 mt-8 border-t border-surface-container-high space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold">Priority Dispatch</h5>
                    <p className="text-xs text-stone-500">Allow this agent to receive priority high-value orders.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      className="sr-only peer" 
                      type="checkbox"
                      checked={formData.priorityDispatch ?? staffMember.priorityDispatch}
                      onChange={(e) => handleFieldChange("priorityDispatch", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
