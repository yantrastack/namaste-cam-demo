"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type ChannelId = "in_app" | "push" | "email";

const CHANNELS: { id: ChannelId; label: string; sub: string; icon: string }[] = [
  { id: "in_app", label: "In-app", sub: "Notification bell", icon: "notifications" },
  { id: "push", label: "Push", sub: "Mobile devices", icon: "smartphone" },
  { id: "email", label: "Email", sub: "Direct inbox", icon: "mail" },
];

const MAX_FEATURED_IMAGE_BYTES = 5 * 1024 * 1024;

const DEFAULT_PREVIEW_HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBDZK3tdQTZotJ_jiwyi1FE0lWmrSoNlpbsjF_QfzbIpIsSj3qfheRwjWdNIb3OC6Wze4kL6xmuQuia3OXj0jb3WZeYigdASjQwvhu5khgEylKbKbrQvlsn329yENOlEB2TJYQp7xZFPxOzQAZTMwgwVR0CUYrTuzazRSE-KJ1Tn9tfEM6EXM64qF0WAq6T3VynWFjcn03R-uuQEXuCenzfrDWCUBLldsPpkuksUtqL4fP9ZxTtZbqn0zBt4XLdmNNZqrTbXG5kG3o";

function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Invalid read result"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

function isJpegOrPng(file: File) {
  return file.type === "image/jpeg" || file.type === "image/png";
}

function safeHttpUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol === "https:" || u.protocol === "http:") return u.href;
  } catch {
    return null;
  }
  return null;
}

function SectionTitle({ icon, children }: { icon: string; children: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <MaterialIcon name={icon} className="text-xl text-primary" />
      <h2 className="font-headline text-lg font-bold text-on-surface">{children}</h2>
    </div>
  );
}

export function CreateNotificationClient() {
  const { showToast } = useToast();
  const featuredFileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [featuredImageDataUrl, setFeaturedImageDataUrl] = useState<string | null>(null);
  const [featuredDragOver, setFeaturedDragOver] = useState(false);
  const [channels, setChannels] = useState<Set<ChannelId>>(new Set(["in_app"]));
  const [scheduleLater, setScheduleLater] = useState(false);
  const [audience, setAudience] = useState<"all" | "segment" | "users">("all");
  const [tags, setTags] = useState<string[]>(["VIP Members", "London Area"]);

  const toggleChannel = useCallback((id: ChannelId) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const applyFeaturedFile = useCallback(
    (file: File) => {
      if (!isJpegOrPng(file)) {
        showToast("Use a JPG or PNG image.", "error");
        return;
      }
      if (file.size > MAX_FEATURED_IMAGE_BYTES) {
        showToast("Image must be 5MB or smaller.", "error");
        return;
      }
      void (async () => {
        try {
          const dataUrl = await readImageFileAsDataUrl(file);
          setFeaturedImageDataUrl(dataUrl);
        } catch {
          showToast("Could not read that image.", "error");
        }
      })();
    },
    [showToast],
  );

  const previewTitle = title.trim() || "Notification title here";
  const previewBody =
    message.trim() ||
    "Craft a compelling message for your audience. It appears here as customers read it.";
  const previewActionHref = safeHttpUrl(actionUrl);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <SectionTitle icon="edit_note">Content details</SectionTitle>
          <div className="space-y-5">
            <Input
              label="Notification title"
              placeholder="e.g. Exclusive weekend tasting menu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="Message content"
              placeholder="Craft a compelling message for your audience…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div>
              <p className="mb-2 ml-1 text-xs font-extrabold uppercase tracking-widest text-secondary">
                Featured media
              </p>
              <input
                ref={featuredFileInputRef}
                type="file"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                className="sr-only"
                aria-hidden
                tabIndex={-1}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  applyFeaturedFile(file);
                }}
              />
              {featuredImageDataUrl ? (
                <div className="space-y-3 rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low p-4">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg ring-1 ring-outline-variant/15">
                    <img
                      alt="Featured media preview"
                      src={featuredImageDataUrl}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => featuredFileInputRef.current?.click()}
                    >
                      <MaterialIcon name="upload_file" className="text-lg" />
                      Replace image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFeaturedImageDataUrl(null)}
                    >
                      <MaterialIcon name="delete" className="text-lg" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setFeaturedDragOver(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                      setFeaturedDragOver(false);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setFeaturedDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) applyFeaturedFile(file);
                  }}
                  className={cn(
                    "rounded-xl border-2 border-dashed transition-colors",
                    featuredDragOver
                      ? "border-primary/50 bg-primary/5"
                      : "border-outline-variant/40 bg-surface-container-low",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => featuredFileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-2 px-4 py-10 text-center transition-colors hover:bg-surface-container-high/60"
                  >
                    <MaterialIcon name="upload_file" className="text-3xl text-primary" />
                    <span className="text-sm font-semibold text-on-surface">Drag and drop your image</span>
                    <span className="text-xs text-on-surface-variant">
                      High-quality JPG or PNG (max 5MB)
                    </span>
                  </button>
                </div>
              )}
            </div>
            <Input
              label="Action URL (optional)"
              placeholder="https://namaste.cam/offers/weekend"
              value={actionUrl}
              onChange={(e) => setActionUrl(e.target.value)}
              left={<MaterialIcon name="link" className="text-lg text-secondary" />}
            />
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionTitle icon="hub">Delivery strategy</SectionTitle>
          <p className="mb-4 text-sm text-on-surface-variant">Choose one or more channels for this send.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {CHANNELS.map((ch) => {
              const on = channels.has(ch.id);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => toggleChannel(ch.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl p-4 text-left ring-1 transition-all",
                    on
                      ? "bg-primary/5 ring-2 ring-primary shadow-sm"
                      : "bg-surface-container-low ring-outline-variant/20 hover:bg-surface-container-high/80",
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <MaterialIcon name={ch.icon} className="text-xl text-primary" />
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded border text-xs",
                        on ? "border-primary bg-primary text-on-primary" : "border-outline-variant/50",
                      )}
                      aria-hidden
                    >
                      {on ? "✓" : ""}
                    </span>
                  </div>
                  <span className="font-headline text-sm font-bold">{ch.label}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                    {ch.sub}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3 ring-1 ring-outline-variant/15">
            <MaterialIcon name="schedule" className="text-xl text-primary" />
            <div className="min-w-0 flex-1">
              <p className="font-headline text-sm font-bold">Schedule for later?</p>
              <p className="text-xs text-on-surface-variant">Pick a specific date and time for delivery.</p>
            </div>
            <Switch checked={scheduleLater} onCheckedChange={setScheduleLater} />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <SectionTitle icon="groups">Audience</SectionTitle>
          <fieldset className="space-y-3">
            <legend className="sr-only">Audience</legend>
            {(
              [
                ["all", "All active users"],
                ["segment", "Segmented group"],
                ["users", "Specific users"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ring-1 transition-colors",
                  audience === value
                    ? "bg-primary/5 ring-primary/40"
                    : "ring-transparent hover:bg-surface-container-high/80",
                )}
              >
                <input
                  type="radio"
                  name="audience"
                  className="h-4 w-4 accent-primary"
                  checked={audience === value}
                  onChange={() => setAudience(value)}
                />
                <span className="text-sm font-semibold">{label}</span>
              </label>
            ))}
          </fieldset>

          <div className="mt-5 space-y-3">
            <Input
              label="Search users or segments"
              placeholder="Search…"
              left={<MaterialIcon name="search" className="text-lg text-secondary" />}
            />
            {tags.length ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => removeTag(t)}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-primary/20"
                  >
                    {t}
                    <MaterialIcon name="close" className="text-sm" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-secondary">
            Live preview
          </p>
          <div className="overflow-hidden rounded-xl ring-1 ring-outline-variant/15">
            <div className="relative h-28 bg-surface-container-high">
              <img
                alt=""
                className="h-full w-full object-cover opacity-90"
                src={featuredImageDataUrl ?? DEFAULT_PREVIEW_HERO}
              />
              <div className="absolute left-3 top-3">
                <Badge className="bg-primary/90 text-on-primary ring-0">New offer</Badge>
              </div>
            </div>
            <div className="space-y-2 bg-surface-container-lowest p-4">
              <p className="font-headline text-base font-bold leading-snug">{previewTitle}</p>
              <p className="text-sm leading-relaxed text-on-surface-variant">{previewBody}</p>
              {actionUrl.trim() ? (
                previewActionHref ? (
                  <a
                    href={previewActionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 truncate text-xs font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    <MaterialIcon name="link" className="shrink-0 text-sm" />
                    <span className="truncate">{actionUrl.trim()}</span>
                  </a>
                ) : (
                  <p className="flex items-center gap-1 truncate text-xs font-semibold text-on-surface-variant">
                    <MaterialIcon name="link" className="shrink-0 text-sm" />
                    <span className="truncate">{actionUrl.trim()}</span>
                  </p>
                )
              ) : null}
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => showToast("Notification queued (demo)", "success")}
          >
            <MaterialIcon name="send" className="text-xl" />
            Send notification
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => showToast("Draft saved (demo)", "info")}
          >
            Save as draft
          </Button>
          <div className="text-center">
            <Link
              href="/notifications/list"
              className="text-sm font-semibold text-secondary underline-offset-4 hover:text-primary hover:underline"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
