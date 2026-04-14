"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DeliveryRouteLeafletMap } from "@/components/delivery/DeliveryRouteLeafletMap";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import {
  estimatedMinutesForStops,
  outwardUkPostcode,
  type DeliveryRoutePlan,
  type RouteStop,
} from "@/lib/delivery-ops-data";

function swapStops(stops: RouteStop[], i: number, j: number): RouteStop[] | null {
  if (j < 0 || j >= stops.length) return null;
  const next = [...stops];
  [next[i], next[j]] = [next[j]!, next[i]!];
  return next.map((s, idx) => ({ ...s, sequence: idx + 1 }));
}

function routeDisplayId(plan: DeliveryRoutePlan): string {
  const n = plan.agentId.replace(/\D/g, "").slice(-3).padStart(3, "0");
  return `RD-2026-${n}`;
}

function stopTargetLabels(stopsCount: number, totalMinutes: number): string[] {
  if (stopsCount === 0) return [];
  const msPer = (totalMinutes * 60_000) / stopsCount;
  const base = new Date();
  base.setHours(11, 30, 0, 0);
  return Array.from({ length: stopsCount }, (_, i) => {
    const t = new Date(base.getTime() + msPer * (i + 1));
    return t.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  });
}

type DeliveryRoutesClientProps = {
  initialPlans: DeliveryRoutePlan[];
};

export function DeliveryRoutesClient({ initialPlans }: DeliveryRoutesClientProps) {
  const [plans, setPlans] = useState<DeliveryRoutePlan[]>(initialPlans);
  const baselineRef = useRef<DeliveryRoutePlan[]>([]);
  const [activeAgentId, setActiveAgentId] = useState(() => initialPlans[0]?.agentId ?? "");
  const [mapRefresh, setMapRefresh] = useState(0);
  const [dispatchHint, setDispatchHint] = useState<string | null>(null);

  useEffect(() => {
    baselineRef.current = structuredClone(initialPlans);
  }, [initialPlans]);

  useEffect(() => {
    if (plans.length === 0) return;
    if (!plans.some((p) => p.agentId === activeAgentId)) {
      setActiveAgentId(plans[0]!.agentId);
    }
  }, [plans, activeAgentId]);

  useEffect(() => {
    setMapRefresh((n) => n + 1);
  }, [activeAgentId]);

  const activePlan = useMemo(() => {
    return plans.find((p) => p.agentId === activeAgentId) ?? plans[0] ?? null;
  }, [plans, activeAgentId]);

  const routeSignature = useMemo(() => {
    if (!activePlan) return "";
    return activePlan.stops.map((s) => `${s.sequence}:${s.lat}:${s.lng}`).join("|");
  }, [activePlan]);

  const targetLabels = useMemo(() => {
    if (!activePlan) return [];
    return stopTargetLabels(activePlan.stops.length, activePlan.estimatedMinutes);
  }, [activePlan]);

  const updatePlanStops = (agentId: string, stops: RouteStop[]) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.agentId === agentId
          ? {
              ...p,
              stops,
              estimatedMinutes: estimatedMinutesForStops(stops),
            }
          : p,
      ),
    );
  };

  const moveStop = (agentId: string, index: number, dir: -1 | 1) => {
    const plan = plans.find((p) => p.agentId === agentId);
    if (!plan) return;
    const next = swapStops(plan.stops, index, index + dir);
    if (!next) return;
    updatePlanStops(agentId, next);
  };

  const handleReshuffle = (agentId: string) => {
    const base = baselineRef.current.find((p) => p.agentId === agentId);
    if (!base) return;
    updatePlanStops(
      agentId,
      base.stops.map((s) => ({ ...s })),
    );
  };

  const handleDispatch = () => {
    if (!activePlan) return;
    setDispatchHint(`Route queued for ${activePlan.agentName} (${activePlan.stops.length} stops).`);
    window.setTimeout(() => setDispatchHint(null), 4200);
  };

  if (plans.length === 0) {
    return (
      <div className="-m-6 flex min-h-[calc(100dvh-7.5rem)] items-center justify-center p-6">
        <Card className="flex max-w-lg flex-col items-center gap-4 p-12 text-center">
          <MaterialIcon name="route" className="text-5xl text-secondary" />
          <p className="font-medium text-on-surface-variant">
            No active driver routes right now. When orders are assigned or marked out for delivery, an
            optimized stop order appears here with a live map and editable sequence.
          </p>
          <Link
            href="/delivery/assign"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold transition-all active:scale-95",
              "border-2 border-primary text-primary hover:bg-primary/5 bg-transparent",
            )}
          >
            Go to assign orders
          </Link>
        </Card>
      </div>
    );
  }

  if (!activePlan) {
    return null;
  }

  return (
    <div className="-m-6 flex h-[calc(100dvh-7.5rem)] min-h-0 flex-col overflow-hidden md:flex-row">
      <section className="relative h-[min(380px,42vh)] w-full shrink-0 md:h-auto md:min-h-0 md:w-[58%] md:flex-1">
        <DeliveryRouteLeafletMap
          stops={activePlan.stops.map((s) => ({
            sequence: s.sequence,
            lat: s.lat,
            lng: s.lng,
          }))}
          routeSignature={routeSignature}
          refreshToken={mapRefresh}
          className="h-full min-h-0 rounded-none md:rounded-none"
        />

        <div className="pointer-events-none absolute inset-0 z-[620]">
          <div className="pointer-events-auto absolute left-6 top-6 max-w-[min(100%-3rem,320px)]">
            <div className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-xl ring-1 ring-outline-variant/15 dark:bg-surface-container-lowest">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary"
                aria-hidden
              >
                <MaterialIcon
                  name="route"
                  className="text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">
                  Route status
                </p>
                <p className="truncate font-headline text-base font-extrabold text-on-surface">
                  Optimized · {activePlan.agentName}
                </p>
                <p className="truncate text-xs font-medium text-on-surface-variant">{activePlan.vehicle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-0 w-full flex-col border-t border-outline-variant/15 bg-surface-container-low md:w-[42%] md:max-w-xl md:border-l md:border-t-0">
        <div className="shrink-0 space-y-5 p-6 pb-4 md:p-8 md:pb-4">
          {plans.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {plans.map((p) => {
                const selected = p.agentId === activeAgentId;
                return (
                  <button
                    key={p.agentId}
                    type="button"
                    onClick={() => setActiveAgentId(p.agentId)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-bold transition-colors",
                      selected
                        ? "bg-primary text-on-primary shadow-md shadow-primary-soft"
                        : "bg-surface-container-high/70 text-secondary hover:bg-surface-container-high",
                    )}
                  >
                    {p.agentName}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">
                Delivery sequence
              </h1>
              <p className="mt-1 text-sm font-medium text-on-surface-variant">
                Route #{routeDisplayId(activePlan)} · {activePlan.stops.length}{" "}
                {activePlan.stops.length === 1 ? "stop" : "stops"} · ~{activePlan.estimatedMinutes}{" "}
                min run
              </p>
            </div>
            <Button
              type="button"
              size="md"
              className="shrink-0 shadow-primary-soft"
              onClick={() => handleReshuffle(activePlan.agentId)}
            >
              <MaterialIcon name="shuffle" className="text-xl" />
              Reshuffle
            </Button>
          </div>
        </div>

        {dispatchHint ? (
          <div className="shrink-0 px-6 pb-2 md:px-8">
            <p className="rounded-xl bg-primary-fixed/80 px-4 py-2 text-center text-xs font-semibold text-on-primary-fixed">
              {dispatchHint}
            </p>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-6 md:px-8 md:pb-8">
          {activePlan.stops.map((stop, i) => {
            const outcode = outwardUkPostcode(stop.postcode);
            const isFirst = i === 0;
            const target = targetLabels[i] ?? "—";
            return (
              <div
                key={stop.orderId}
                className={cn(
                  "rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/10 transition-shadow hover:shadow-md",
                  isFirst ? "border-l-4 border-primary" : "border-l-4 border-transparent",
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full font-headline text-sm font-extrabold",
                        isFirst ? "bg-primary/10 text-primary" : "bg-surface-container-high text-secondary",
                      )}
                    >
                      {stop.sequence}
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest",
                            isFirst
                              ? "bg-primary-fixed text-primary"
                              : "bg-surface-container-high text-secondary",
                          )}
                        >
                          {outcode}
                        </span>
                        <span className="text-sm font-bold text-on-surface">#{stop.code}</span>
                      </div>
                      <h2 className="font-headline text-lg font-bold leading-tight text-on-surface">
                        {stop.customerName}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-on-surface-variant">{stop.shortAddress}</p>
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-secondary">
                        {stop.postcode}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-row items-end justify-between gap-4 sm:flex-col sm:items-end sm:text-right">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">Target</p>
                      <p
                        className={cn(
                          "font-headline text-lg font-extrabold",
                          isFirst ? "text-primary" : "text-on-surface",
                        )}
                      >
                        {target}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-10 min-w-0 px-0"
                        disabled={i === 0}
                        onClick={() => moveStop(activePlan.agentId, i, -1)}
                        aria-label={`Move ${stop.code} earlier`}
                      >
                        <MaterialIcon name="arrow_upward" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-10 min-w-0 px-0"
                        disabled={i === activePlan.stops.length - 1}
                        onClick={() => moveStop(activePlan.agentId, i, 1)}
                        aria-label={`Move ${stop.code} later`}
                      >
                        <MaterialIcon name="arrow_downward" />
                      </Button>
                      {stop.linkedRestaurantOrderId ? (
                        <Link
                          href={`/orders/${stop.linkedRestaurantOrderId}`}
                          className="inline-flex size-10 items-center justify-center rounded-full bg-surface-container-high/80 text-primary ring-1 ring-outline-variant/20 transition-colors hover:bg-surface-container-high"
                          aria-label={`Open ticket ${stop.code}`}
                        >
                          <MaterialIcon name="open_in_new" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.06)] md:px-8">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full justify-center border-0 bg-inverse-surface text-inverse-on-surface shadow-none hover:bg-inverse-surface/90"
            onClick={handleDispatch}
          >
            <MaterialIcon name="send" className="text-xl" />
            Dispatch to driver
          </Button>
        </div>
      </section>
    </div>
  );
}
