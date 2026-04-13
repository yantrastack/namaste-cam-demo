import { isCustomerLikeRole, isStaffLikeRole } from "./role-policy";

import type { StaffCompensationType, UserRole } from "./types";

/** Keys driven by the dynamic field grid (excludes file uploads handled in UI). */
export type NewUserFormFieldKey =
  | "name"
  | "email"
  | "phone"
  | "role"
  | "notes"
  | "walletBalance"
  | "creditLimit"
  | "strictCustomer"
  | "alternativeEmail"
  | "secondaryPhone"
  | "address"
  | "temporaryStaff"
  | "compensationType"
  | "compensationAmount";

export type NewUserFormValues = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  notes: string;
  walletBalance: string;
  creditLimit: string;
  strictCustomer: boolean;
  alternativeEmail: string;
  secondaryPhone: string;
  address: string;
  temporaryStaff: boolean;
  compensationType: StaffCompensationType;
  compensationAmount: string;
};

export type NewUserFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "money"
  | "checkbox"
  | "select";

export type NewUserFieldOption = { value: string; label: string };

export type NewUserFieldDef = {
  key: NewUserFormFieldKey;
  label: string;
  type: NewUserFieldType;
  placeholder?: string;
  hint?: string;
  /** Grid columns on md+ */
  colSpan?: 1 | 2;
  options?: NewUserFieldOption[];
};

export type NewUserSectionDef = {
  id: string;
  title: string;
  description?: string;
  icon: string;
  iconBgClass: string;
  iconClass: string;
  fields: NewUserFieldDef[];
};

const profileCore: NewUserFieldDef[] = [
  {
    key: "name",
    label: "Full Name",
    type: "text",
    placeholder: "e.g. Julian Rodriguez",
  },
  {
    key: "email",
    label: "Email Address",
    type: "email",
    placeholder: "name@example.com",
  },
  {
    key: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
  },
  {
    key: "role",
    label: "User Role",
    type: "select",
    options: [], // filled at runtime from USER_ROLE_OPTIONS
  },
  {
    key: "notes",
    label: "Administrative Notes",
    type: "textarea",
    placeholder: "Add internal notes about this user account…",
    colSpan: 2,
  },
];

const customerFinancial: NewUserFieldDef[] = [
  {
    key: "walletBalance",
    label: "Wallet Balance (GBP)",
    type: "money",
    placeholder: "0.00",
    hint: "Initial balance for this customer account.",
    colSpan: 2,
  },
  {
    key: "creditLimit",
    label: "Credit Limit (GBP)",
    type: "money",
    placeholder: "500.00",
    hint: "Maximum wallet draw / overdraft-style cap.",
    colSpan: 2,
  },
  {
    key: "strictCustomer",
    label: "Strict customer",
    type: "checkbox",
    hint: "Enforce stricter payment and ordering checks for this account.",
    colSpan: 2,
  },
];

const staffContact: NewUserFieldDef[] = [
  {
    key: "alternativeEmail",
    label: "Alternative Email",
    type: "email",
    placeholder: "backup@example.com",
  },
  {
    key: "secondaryPhone",
    label: "Secondary Phone",
    type: "tel",
    placeholder: "+1 (555) 000-0001",
  },
  {
    key: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Street, city, postcode…",
    colSpan: 2,
  },
];

const staffEmployment: NewUserFieldDef[] = [
  {
    key: "temporaryStaff",
    label: "Temporary staff",
    type: "checkbox",
    hint: "Short-term or seasonal assignment.",
    colSpan: 2,
  },
  {
    key: "compensationType",
    label: "Compensation",
    type: "select",
    options: [
      { value: "hourly", label: "Hourly" },
      { value: "monthly", label: "Monthly" },
    ],
  },
  {
    key: "compensationAmount",
    label: "Amount (GBP)",
    type: "money",
    placeholder: "0.00",
    hint: "Rate per hour or fixed monthly pay, based on compensation type.",
  },
];

export function buildNewUserSections(
  role: UserRole,
  roleSelectOptions: NewUserFieldOption[],
): NewUserSectionDef[] {
  const core = profileCore.map((f) =>
    f.key === "role" ? { ...f, options: roleSelectOptions } : f,
  );

  const sections: NewUserSectionDef[] = [
    {
      id: "profile",
      title: "Profile Information",
      description: "Primary identity used across Namaste Cam.",
      icon: "person",
      iconBgClass: "bg-red-50",
      iconClass: "text-primary",
      fields: core,
    },
  ];

  if (isCustomerLikeRole(role)) {
    sections.push({
      id: "customer-financial",
      title: "Wallet & limits",
      description: "Customer spending controls for this account.",
      icon: "account_balance_wallet",
      iconBgClass: "bg-amber-50",
      iconClass: "text-amber-600",
      fields: customerFinancial,
    });
  }

  if (isStaffLikeRole(role)) {
    sections.push(
      {
        id: "staff-contact",
        title: "Staff contact & location",
        description: "Additional reachability and address on file.",
        icon: "contact_mail",
        iconBgClass: "bg-blue-50",
        iconClass: "text-blue-700",
        fields: staffContact,
      },
      {
        id: "staff-employment",
        title: "Employment & pay",
        description: "Contract style and compensation basis.",
        icon: "work",
        iconBgClass: "bg-purple-50",
        iconClass: "text-purple-800",
        fields: staffEmployment,
      },
    );
  }

  return sections;
}

export function defaultNewUserFormValues(
  initialRole: UserRole = "user",
): NewUserFormValues {
  return {
    name: "",
    email: "",
    phone: "",
    role: initialRole,
    notes: "",
    walletBalance: "0.00",
    creditLimit: "500.00",
    strictCustomer: false,
    alternativeEmail: "",
    secondaryPhone: "",
    address: "",
    temporaryStaff: false,
    compensationType: "hourly",
    compensationAmount: "",
  };
}
