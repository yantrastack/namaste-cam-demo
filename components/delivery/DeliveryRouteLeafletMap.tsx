"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/cn";
import { DELIVERY_ROUTE_HUB } from "@/lib/delivery-ops-data";

export type DeliveryRouteMapStop = {
  sequence: number;
  lat: number;
  lng: number;
};

type DeliveryRouteLeafletMapProps = {
  stops: DeliveryRouteMapStop[];
  /** Stable fingerprint of `stops` so the map only rebuilds when geometry or order changes. */
  routeSignature: string;
  className?: string;
  /** Increment when the panel becomes visible so the map can reflow (e.g. driver tab switch). */
  refreshToken?: number;
};

const ROUTE_LINE = "#bc000a";

function stopIcon(sequence: number): L.DivIcon {
  const html = `<div style="width:32px;height:32px;border-radius:9999px;background:${ROUTE_LINE};color:#fff;display:flex;align-items:center;justify-content:center;font-family:ui-sans-serif,system-ui,sans-serif;font-size:12px;font-weight:800;box-shadow:0 6px 16px rgba(0,0,0,0.18);border:2px solid rgba(255,255,255,0.95);">${sequence}</div>`;
  return L.divIcon({
    className: "route-stop-marker",
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const hubIcon = L.divIcon({
  className: "route-hub-marker",
  html:
    '<div style="width:36px;height:36px;border-radius:14px;background:#d6e0f3;color:#596373;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:10px;letter-spacing:0.02em;font-family:ui-sans-serif,system-ui,sans-serif;box-shadow:0 6px 16px rgba(0,0,0,0.12);border:2px solid #fff;">Hub</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export function DeliveryRouteLeafletMap({
  stops,
  routeSignature,
  className,
  refreshToken = 0,
}: DeliveryRouteLeafletMapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stopsRef = useRef(stops);
  stopsRef.current = stops;

  useEffect(() => {
    if (!hostRef.current) return;
    const el = hostRef.current;
    const currentStops = stopsRef.current;

    const map = L.map(el, {
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomleft" }).addTo(map);

    const hub: L.LatLngExpression = [DELIVERY_ROUTE_HUB.lat, DELIVERY_ROUTE_HUB.lng];
    const latlngs: L.LatLngExpression[] = [
      hub,
      ...currentStops.map((s) => [s.lat, s.lng] as L.LatLngExpression),
    ];

    if (latlngs.length > 1) {
      L.polyline(latlngs, {
        color: ROUTE_LINE,
        weight: 4,
        opacity: 0.88,
        dashArray: "10 8",
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);
    }

    L.marker(hub, { icon: hubIcon, interactive: false }).addTo(map);

    for (const s of currentStops) {
      L.marker([s.lat, s.lng], { icon: stopIcon(s.sequence) }).addTo(map);
    }

    if (latlngs.length === 1) {
      map.setView(hub, 13);
    } else {
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [52, 52], maxZoom: 14 });
    }

    const onResize = () => {
      map.invalidateSize();
    };
    window.addEventListener("resize", onResize);
    const t = window.setTimeout(() => {
      map.invalidateSize();
      if (latlngs.length > 1) {
        const bounds = L.latLngBounds(latlngs);
        map.fitBounds(bounds, { padding: [52, 52], maxZoom: 14 });
      }
    }, 160);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
      map.remove();
    };
  }, [routeSignature, refreshToken]);

  return (
    <div
      className={cn(
        "relative h-full min-h-[280px] w-full overflow-hidden bg-surface-container [&_.leaflet-container]:isolate [&_.leaflet-container]:z-0 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container_img]:max-w-none",
        className,
      )}
    >
      <div ref={hostRef} className="h-full w-full min-h-[280px]" />
    </div>
  );
}
