"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";

type PunchKind = "in" | "out";

type ShiftStatus = "on_break" | "checked_in" | "checked_out";

type StaffProfile = {
  name: string;
  avatarUrl: string;
  roles: string[];
  displayTitle: string;
  shiftStatus: ShiftStatus;
  lastActionDetail: string;
  checkedInBy: string;
};

const STAFF: StaffProfile[] = [
  {
    name: "Marcus Chen",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHLajKyimQyGESuCj0IGy-hUkCqUx0Aah7NaAKNQwDHGOzAQQ2GuFvIU5_7X67qvpa4Mklf5c0YJOFXGj4f1KfTlxHzGNyW6OnqiIVT68OfceeY4ktfe7JufYcFQHHCLx71USAqSW863DTWFAES_6wRisnPYGZdLC9FTNoiFtvElVJCGlbfqFVSObJhEbmRr4ZOFlN8q9RimhIjlvgoBaSaA5EMRtvBMlAb9yNYZEdEgEBXds_vRW4y7-M_o78xqWy1GuTllZwYN0",
    roles: ["Executive sous chef", "Line cook", "Closing lead"],
    displayTitle: "Executive sous chef",
    shiftStatus: "on_break",
    lastActionDetail: "10:30 (Break)",
    checkedInBy: "Self",
  },
  {
    name: "Elena Rodriguez",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEffu9YXH9aruk8Sd2T9AP9r7sW69FBve9bqUSq7ILQshbwEnFBtx4TEF4mCANtYWyDUz7W5ELelrZMuw9k_coZnNhpzckG472vZTgDmvGwQasUhwFluIQvXQ-asnfU52RXDDFU5p_gAMNsjTjWYcScoXNXRWp8INMUevmTPc2FJSQeWRf9FPeiZJdJqvHnz9no7foPp83tWvY5oSePbjV44WF_gP6s80WQ5g-RM8S4ISXD1YGUTAF35RQlPA8yyrk9c5wkUvi_aQ",
    roles: ["Pastry chef", "Morning prep"],
    displayTitle: "Pastry chef",
    shiftStatus: "checked_in",
    lastActionDetail: "08:15 (Check-in)",
    checkedInBy: "Admin",
  },
  {
    name: "James Wilson",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSRWzZK2RnD7KG1rvGCaQY1lGLU0voJXQQGTtzbDSExfxFTvjatFRFa0DPyH83ZBBwqZ0sgW0gWJQOekQbES_5DOAmchuKS3ClyPmk62gndv5wG8PulMRaecsKZKkST9bXWLT50zbXpv556qp6x9MZUjdiLz3-YeWJJIwj8hdo8kK5XqRMyHsgMyzjNrg1oFhTsdPH3zQ-3sz8emZiA_vZxCkZ0s8LPOf1N9FMke9aWCJ6E76aUd29M4xE_a36ew2lMczlr0QCl2M",
    roles: ["Delivery driver", "Runner", "Inventory support"],
    displayTitle: "Delivery driver",
    shiftStatus: "checked_out",
    lastActionDetail: "17:00 (Check-out)",
    checkedInBy: "Self",
  },
  {
    name: "Sarah Thompson",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCto_nrbq5CccRRrPYdgXFD_1Lk4M2sw7kdPrASoR0xwTBseo36K285FVqHbEtRt-_BmwL9z_kVjOyX3DbIPuus2SIpf3vfpAlrZii5s49glEkYanRMxfdDuiUf025LNZA2iIPAMcR16LQpjAHHdDfWsef3bC6kf_w19wOZv45IiV5m74rAnFae4GzZnKh9T1zQK3cxij58vsOyTjbk7X1jtog2sVK9VtPEHo-1SO5enEKNA3X2ZAzuwBRRNhVXjkAlciRXItCkLoE",
    roles: ["Floor manager", "Events coordinator"],
    displayTitle: "Floor manager",
    shiftStatus: "checked_in",
    lastActionDetail: "10:30 (Check-in)",
    checkedInBy: "Self",
  },
];

type PunchRow = {
  id: string;
  staffName: string;
  role: string;
  time: string;
  kind: PunchKind;
  detail: string;
};

const INITIAL_PUNCHES: PunchRow[] = [
  {
    id: "p0",
    staffName: "Sarah Jenkins",
    role: "Server",
    time: "09:00",
    kind: "in",
    detail: "Admin checked in Sarah Jenkins",
  },
  {
    id: "p1",
    staffName: "Marcus Chen",
    role: "Executive sous chef",
    time: "10:15",
    kind: "in",
    detail: "Marcus Chen (Chef) started a break",
  },
  {
    id: "p2",
    staffName: "Emma Wright",
    role: "Floor manager",
    time: "10:30",
    kind: "in",
    detail: "Emma Wright (Floor manager) checked in (Self)",
  },
  {
    id: "p3",
    staffName: "David C.",
    role: "Kitchen",
    time: "11:00",
    kind: "out",
    detail: "Admin marked David C. as absent",
  },
];

type NoteTag = "late" | "early" | "overtime";

function statusBadge(profile: StaffProfile) {
  if (profile.shiftStatus === "on_break") {
    return { label: "On break", tone: "warning" as const };
  }
  if (profile.shiftStatus === "checked_in") {
    return { label: "Checked in", tone: "success" as const };
  }
  return { label: "Checked out", tone: "neutral" as const };
}

function decodeParam(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value.replace(/\+/g, " ");
  }
}

export function StaffCheckInOutClient() {
  const searchParams = useSearchParams();
  const staffQ = searchParams.get("staff");
  const roleQ = searchParams.get("role");
  const intentQ = searchParams.get("intent");

  const [staffName, setStaffName] = useState(STAFF[0]!.name);
  const [activeRole, setActiveRole] = useState(STAFF[0]!.roles[0]!);
  const [pin, setPin] = useState("");
  const [punches, setPunches] = useState<PunchRow[]>(INITIAL_PUNCHES);
  const [message, setMessage] = useState<string | null>(null);
  const [attendanceNotes, setAttendanceNotes] = useState("");
  const [noteTags, setNoteTags] = useState<Set<NoteTag>>(new Set());

  const profile = useMemo(
    () => STAFF.find((s) => s.name === staffName) ?? STAFF[0]!,
    [staffName],
  );

  useEffect(() => {
    const name = decodeParam(staffQ);
    if (!name) return;
    const member = STAFF.find((s) => s.name === name);
    if (!member) return;

    setStaffName(name);
    const roleDecoded = decodeParam(roleQ);
    if (roleDecoded && member.roles.includes(roleDecoded)) {
      setActiveRole(roleDecoded);
    } else {
      setActiveRole(member.roles[0]!);
    }

    if (intentQ === "check-out") {
      setMessage(`Opened for ${name}. Enter PIN and confirm check-out.`);
    } else if (intentQ === "check-in") {
      setMessage(`Opened for ${name}. Enter PIN and confirm check-in.`);
    }
  }, [staffQ, roleQ, intentQ]);

  const lastPunchForStaff = useMemo(() => {
    const forStaff = punches.filter((p) => p.staffName === staffName);
    return forStaff.length ? forStaff[0] : null;
  }, [punches, staffName]);

  const shiftBadge = statusBadge(profile);

  const toggleNote = (tag: NoteTag) => {
    setNoteTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const recordPunch = (kind: PunchKind) => {
    setMessage(null);
    if (!pin.trim()) {
      setMessage("Enter a PIN to confirm.");
      return;
    }
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tags = Array.from(noteTags);
    const noteSuffix =
      tags.length > 0 ? ` — flags: ${tags.join(", ")}` : attendanceNotes.trim()
        ? ` — note logged`
        : "";
    setPunches((prev) => [
      {
        id: `p-${now.getTime()}`,
        staffName,
        role: activeRole,
        time,
        kind,
        detail: `${staffName} (${activeRole}) ${kind === "in" ? "checked in" : "checked out"} (Self)${noteSuffix}`,
      },
      ...prev,
    ]);
    setPin("");
    setMessage(kind === "in" ? "Checked in successfully." : "Checked out successfully.");
  };

  return (
    <PageContainer
      title="Check-in / check-out"
      description="Front-of-house punch clock for shifts (demo data — connect your time system later)."
    >
      <div className="grid min-w-0 w-full gap-6 lg:grid-cols-12">
        <Card className="space-y-5 p-6 sm:p-8 lg:col-span-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <Image
                src={profile.avatarUrl}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-outline-variant/20"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-headline text-xl font-extrabold tracking-tight text-on-surface">
                    {profile.name}
                  </h2>
                  <Badge tone={shiftBadge.tone} className="normal-case tracking-normal">
                    {shiftBadge.label}
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm font-semibold text-on-surface-variant">{profile.displayTitle}</p>
                <p className="mt-2 text-xs font-medium text-secondary">
                  Last action: {profile.lastActionDetail} · Checked-in by: {profile.checkedInBy}
                </p>
              </div>
            </div>
          </div>

          <SelectField
            label="Staff member"
            value={staffName}
            onChange={(e) => {
              const nextName = e.target.value;
              setStaffName(nextName);
              const next = STAFF.find((s) => s.name === nextName) ?? STAFF[0]!;
              setActiveRole(next.roles[0]!);
              setMessage(null);
            }}
          >
            {STAFF.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Active role"
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
            hint="Pick the role they are performing right now when they have more than one."
          >
            {profile.roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </SelectField>

          <div className="flex flex-col gap-2 rounded-xl bg-secondary-container/50 px-4 py-3 ring-1 ring-secondary-fixed-dim/30 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-on-secondary-container">
              Performing action for:{" "}
              <span className="text-on-surface">
                {profile.name} ({activeRole})
              </span>
            </p>
            <Badge tone="info" className="shrink-0 normal-case tracking-normal">
              Admin view
            </Badge>
          </div>

          <Input
            label="PIN (demo)"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="primary" size="lg" onClick={() => recordPunch("in")}>
              <MaterialIcon name="login" className="text-xl" />
              Check-in
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="shadow-sm ring-1 ring-outline-variant/20"
              onClick={() => recordPunch("out")}
            >
              <MaterialIcon name="logout" className="text-xl" />
              Check-out
            </Button>
          </div>

          {message ? (
            <p className="text-sm font-semibold text-on-surface-variant" role="status">
              {message}
            </p>
          ) : null}

          <Textarea
            label="Attendance notes"
            placeholder="Add details about shift adjustments, swaps, or approvals…"
            value={attendanceNotes}
            onChange={(e) => setAttendanceNotes(e.target.value)}
          />

          <div>
            <p className="mb-2 ml-1 text-xs font-bold uppercase tracking-widest text-secondary">Quick tags</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "late" as const, label: "Late" },
                  { id: "early" as const, label: "Early leave" },
                  { id: "overtime" as const, label: "Overtime" },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleNote(id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                    noteTags.has(id)
                      ? "bg-primary/10 text-primary ring-2 ring-primary"
                      : "bg-surface text-secondary ring-1 ring-outline-variant/20 hover:bg-surface-container-high",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-low p-4 ring-1 ring-outline-variant/20">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Session summary</p>
            <p className="mt-1 font-headline text-base font-extrabold text-on-surface">
              {profile.name} · {activeRole}
            </p>
            {lastPunchForStaff ? (
              <p className="mt-2 text-sm text-secondary">
                Latest log:{" "}
                <span className="font-semibold text-on-surface">{lastPunchForStaff.detail}</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-secondary">No punches recorded for this member yet today.</p>
            )}
          </div>
        </Card>

        <Card className="flex flex-col p-0 lg:col-span-5">
          <div className="border-b border-outline-variant/20 px-6 py-4">
            <h2 className="font-headline text-lg font-extrabold text-on-surface">Recent activity</h2>
            <p className="text-sm font-medium text-secondary">Live punch trail</p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <ul className="space-y-0">
              {punches.map((p, index) => {
                const isLast = index === punches.length - 1;
                return (
                  <li key={p.id} className="grid grid-cols-[auto_1fr] gap-x-3 pb-6 last:pb-0">
                    <div className="relative flex w-3 shrink-0 justify-center pt-1.5">
                      {!isLast ? (
                        <span
                          className="absolute left-1/2 top-[18px] bottom-0 w-px -translate-x-1/2 bg-outline-variant/40"
                          aria-hidden
                        />
                      ) : null}
                      <span
                        className={cn(
                          "relative z-10 h-3 w-3 shrink-0 rounded-full ring-2 ring-surface-container-lowest",
                          p.kind === "in" ? "bg-primary" : "bg-secondary",
                        )}
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <MaterialIcon
                          name={p.kind === "in" ? "login" : "logout"}
                          filled
                          className={cn(
                            "text-[18px] leading-none",
                            p.kind === "in" ? "text-primary" : "text-secondary",
                          )}
                        />
                        <time
                          dateTime={p.time}
                          className="text-xs font-semibold tabular-nums tracking-normal text-secondary"
                        >
                          {p.time}
                        </time>
                      </div>
                      <p className="mt-1 text-sm font-semibold leading-snug text-on-surface">{p.detail}</p>
                      <p className="mt-0.5 text-xs font-medium text-secondary">
                        {p.staffName} · {p.role}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
