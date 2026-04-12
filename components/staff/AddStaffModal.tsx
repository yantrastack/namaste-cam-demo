"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (staffData: StaffFormData) => void;
}

interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  role: "Chef" | "Cook" | "Delivery" | "Manager";
  location: "Cambridge" | "Peterborough" | "Huntingdon" | "Ely";
  priorityDispatch: boolean;
  status: "active" | "inactive";
  cvFile?: File;
}

export function AddStaffModal({ isOpen, onClose, onSubmit }: AddStaffModalProps) {
  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    email: "",
    phone: "",
    role: "Delivery",
    location: "Cambridge",
    priorityDispatch: false,
    status: "active",
  });

  const [errors, setErrors] = useState<Partial<StaffFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<StaffFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "Delivery",
        location: "Cambridge",
        priorityDispatch: false,
        status: "active",
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof StaffFormData, value: string | boolean | File | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <MaterialIcon name="person_add" className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface">Add New Staff Member</h3>
              <p className="text-sm text-zinc-500">Enter the details of the staff member you want to add</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"
          >
            <MaterialIcon name="close" className="text-zinc-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-sm font-bold text-zinc-600 uppercase tracking-wider mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-2.5 bg-surface rounded-lg border ${
                    errors.name ? "border-error" : "border-outline-variant/20"
                  } text-sm font-medium text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary`}
                  placeholder="Enter staff member's full name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-error font-medium">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-2.5 bg-surface rounded-lg border ${
                    errors.email ? "border-error" : "border-outline-variant/20"
                  } text-sm font-medium text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary`}
                  placeholder="staff@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-error font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full px-4 py-2.5 bg-surface rounded-lg border ${
                    errors.phone ? "border-error" : "border-outline-variant/20"
                  } text-sm font-medium text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary`}
                  placeholder="+44 7700 900 123"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-error font-medium">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Upload CV (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleInputChange("cvFile", e.target.files?.[0] || undefined)}
                    className="w-full px-4 py-2.5 bg-surface rounded-lg border border-outline-variant/20 text-sm font-medium text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary/90"
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-500">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h4 className="text-sm font-bold text-zinc-600 uppercase tracking-wider mb-4">Job Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface rounded-lg border border-outline-variant/20 text-sm font-medium text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
                >
                  <option value="Chef">Chef</option>
                  <option value="Cook">Cook</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Location *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface rounded-lg border border-outline-variant/20 text-sm font-medium text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
                >
                  <option value="Cambridge">Cambridge</option>
                  <option value="Peterborough">Peterborough</option>
                  <option value="Huntingdon">Huntingdon</option>
                  <option value="Ely">Ely</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface rounded-lg border border-outline-variant/20 text-sm font-medium text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.priorityDispatch}
                    onChange={(e) => handleInputChange("priorityDispatch", e.target.checked)}
                    className="w-5 h-5 text-primary bg-surface border-outline-variant rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm font-semibold text-on-surface">Priority Dispatch</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-low">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-surface-container-high text-on-surface rounded-full text-sm font-semibold hover:bg-surface-container-high/80 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <MaterialIcon name="person_add" className="text-sm" />
              Add Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
