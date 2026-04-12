import { normalizeUkPostcode } from "@/lib/orders-restaurant-data";

export type DeliveryDispatchStatus =
  | "unassigned"
  | "assigned"
  | "en_route"
  | "delivered";

export type DeliveryOrder = {
  id: string;
  code: string;
  /** Human area title shown with postcode group. */
  areaLabel: string;
  postcode: string;
  customerName: string;
  addressLine: string;
  placedAtLabel: string;
  dispatchStatus: DeliveryDispatchStatus;
  assignedAgentId?: string;
  lat: number;
  lng: number;
  /** When set, links to restaurant order detail. */
  linkedRestaurantOrderId?: string;
};

export type DeliveryAgent = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  /** Simulated concurrent drops. */
  activeStops: number;
};

export type DeliveryAreaStat = {
  outcode: string;
  areaLabel: string;
  total: number;
  unassigned: number;
  assigned: number;
  enRoute: number;
  delivered: number;
};

export type RouteStop = {
  orderId: string;
  sequence: number;
  code: string;
  customerName: string;
  shortAddress: string;
  postcode: string;
  lat: number;
  lng: number;
  linkedRestaurantOrderId?: string;
};

export type DeliveryRoutePlan = {
  agentId: string;
  agentName: string;
  vehicle: string;
  stops: RouteStop[];
  /** Rough drive + drop time for ops context. */
  estimatedMinutes: number;
};

/** Kitchen / dispatch hub (Covent Garden) — used for sequencing and route maps. */
export const DELIVERY_ROUTE_HUB = { lat: 51.5033, lng: -0.1195 } as const;

const DEPOT: { lat: number; lng: number } = DELIVERY_ROUTE_HUB;

const DELIVERY_AGENTS_SEED: DeliveryAgent[] = [
  {
    id: "ag-raj",
    name: "Rajesh Kumar",
    phone: "+44 7700 900101",
    vehicle: "E-bike",
    activeStops: 2,
  },
  {
    id: "ag-amy",
    name: "Amy Okonkwo",
    phone: "+44 7700 900102",
    vehicle: "Van · cold chain",
    activeStops: 1,
  },
  {
    id: "ag-li",
    name: "Li Wei",
    phone: "+44 7700 900103",
    vehicle: "Scooter",
    activeStops: 3,
  },
  {
    id: "ag-sam",
    name: "Sam Brooks",
    phone: "+44 7700 900104",
    vehicle: "Car",
    activeStops: 0,
  },
];

const DELIVERY_ORDERS_SEED: DeliveryOrder[] = [
  {
    id: "ord-ss-8291",
    code: "SS-8291",
    areaLabel: "Westminster core",
    postcode: "SW1A 1AA",
    customerName: "Benjamin Harrison",
    addressLine: "12 Birdcage Walk",
    placedAtLabel: "Today · 14:22",
    dispatchStatus: "unassigned",
    lat: 51.5007,
    lng: -0.143,
    linkedRestaurantOrderId: "ord-ss-8291",
  },
  {
    id: "ord-ss-8292",
    code: "SS-8292",
    areaLabel: "Shoreditch & east",
    postcode: "E1 6AN",
    customerName: "Elena Rostova",
    addressLine: "88 Commercial Street",
    placedAtLabel: "Today · 14:05",
    dispatchStatus: "unassigned",
    lat: 51.5208,
    lng: -0.0754,
    linkedRestaurantOrderId: "ord-ss-8292",
  },
  {
    id: "ord-ss-8288",
    code: "SS-8288",
    areaLabel: "Cambridge city",
    postcode: "CB2 1TP",
    customerName: "Jordan Lee",
    addressLine: "4 Trumpington Street",
    placedAtLabel: "Today · 13:40",
    dispatchStatus: "assigned",
    assignedAgentId: "ag-li",
    lat: 52.201,
    lng: 0.1167,
    linkedRestaurantOrderId: "ord-ss-8288",
  },
  {
    id: "ord-ss-8275",
    code: "SS-8275",
    areaLabel: "Cambridge city",
    postcode: "CB2 1TP",
    customerName: "Amelia Grant",
    addressLine: "19 Silver Street",
    placedAtLabel: "Today · 12:58",
    dispatchStatus: "unassigned",
    lat: 52.2025,
    lng: 0.1189,
    linkedRestaurantOrderId: "ord-ss-8275",
  },
  {
    id: "ord-ss-8280",
    code: "SS-8280",
    areaLabel: "Cambridge north",
    postcode: "CB5 8RX",
    customerName: "Walk-in guest",
    addressLine: "Milton Road retail park",
    placedAtLabel: "Today · 13:12",
    dispatchStatus: "unassigned",
    lat: 52.242,
    lng: 0.153,
    linkedRestaurantOrderId: "ord-ss-8280",
  },
  {
    id: "ord-del-501",
    code: "SS-8501",
    areaLabel: "Westminster core",
    postcode: "SW1A 2AB",
    customerName: "Priya Nair",
    addressLine: "6 Storey's Gate",
    placedAtLabel: "Today · 13:55",
    dispatchStatus: "unassigned",
    lat: 51.5012,
    lng: -0.1299,
  },
  {
    id: "ord-del-502",
    code: "SS-8502",
    areaLabel: "Holborn & City",
    postcode: "EC1A 1BB",
    customerName: "Noah Williams",
    addressLine: "45 Leather Lane",
    placedAtLabel: "Today · 13:20",
    dispatchStatus: "en_route",
    assignedAgentId: "ag-raj",
    lat: 51.5185,
    lng: -0.1075,
    linkedRestaurantOrderId: "ord-ss-8171",
  },
  {
    id: "ord-del-503",
    code: "SS-8503",
    areaLabel: "Holborn & City",
    postcode: "EC1A 1BB",
    customerName: "Studio 4 Catering",
    addressLine: "Farringdon station pickup",
    placedAtLabel: "Today · 12:40",
    dispatchStatus: "assigned",
    assignedAgentId: "ag-raj",
    lat: 51.5205,
    lng: -0.105,
  },
  {
    id: "ord-del-504",
    code: "SS-8504",
    areaLabel: "Soho",
    postcode: "W1D 4FA",
    customerName: "Riley Brooks",
    addressLine: "22 Wardour Street",
    placedAtLabel: "Today · 12:15",
    dispatchStatus: "unassigned",
    lat: 51.513,
    lng: -0.131,
    linkedRestaurantOrderId: "ord-ss-8142",
  },
  {
    id: "ord-del-505",
    code: "SS-8505",
    areaLabel: "Shoreditch & east",
    postcode: "E1 6AN",
    customerName: "Samira Khan",
    addressLine: "Brick Lane yard gate",
    placedAtLabel: "Today · 11:50",
    dispatchStatus: "en_route",
    assignedAgentId: "ag-amy",
    lat: 51.522,
    lng: -0.072,
  },
  {
    id: "ord-del-506",
    code: "SS-8506",
    areaLabel: "Cambridge fringe",
    postcode: "CB2 3QZ",
    customerName: "Studio Catering Ltd",
    addressLine: "Brooks Road industrial",
    placedAtLabel: "Mon · 12:48",
    dispatchStatus: "delivered",
    assignedAgentId: "ag-li",
    lat: 52.188,
    lng: 0.142,
    linkedRestaurantOrderId: "ord-ss-8138",
  },
  {
    id: "ord-del-507",
    code: "SS-8507",
    areaLabel: "Cambridge city",
    postcode: "CB2 1TP",
    customerName: "Oliver Chen",
    addressLine: "Parker's Piece kiosk",
    placedAtLabel: "Fri · 12:10",
    dispatchStatus: "delivered",
    assignedAgentId: "ag-li",
    lat: 52.203,
    lng: 0.124,
  },
  {
    id: "ord-del-508",
    code: "SS-8508",
    areaLabel: "Westminster core",
    postcode: "SW1A 1AA",
    customerName: "House account",
    addressLine: "Whitehall service entrance",
    placedAtLabel: "Wed · 12:05",
    dispatchStatus: "delivered",
    assignedAgentId: "ag-sam",
    lat: 51.5045,
    lng: -0.1275,
    linkedRestaurantOrderId: "ord-ss-8158",
  },
  {
    id: "ord-del-509",
    code: "SS-8509",
    areaLabel: "Cambridge north",
    postcode: "CB5 8RX",
    customerName: "Alex Morgan",
    addressLine: "Chesterton Road flats",
    placedAtLabel: "Wed · 18:20",
    dispatchStatus: "delivered",
    assignedAgentId: "ag-li",
    lat: 52.239,
    lng: 0.148,
  },
];

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** UK-style outward code for grouping (e.g. SW1A, CB2, E1). */
export function outwardUkPostcode(postcode: string): string {
  const pc = normalizeUkPostcode(postcode.replace(/\s+/g, ""));
  if (pc.length <= 3) return pc;
  return pc.slice(0, -3);
}

export function estimatedMinutesForStops(stops: RouteStop[]): number {
  if (stops.length === 0) return 0;
  let km = 0;
  let prev: { lat: number; lng: number } = DEPOT;
  for (const s of stops) {
    km += haversineKm(prev, s);
    prev = s;
  }
  const drive = km * 3.2;
  const drops = stops.length * 4;
  return Math.round(drive + drops);
}

function nearestNeighborFromDepot(orders: DeliveryOrder[]): DeliveryOrder[] {
  const remaining = [...orders];
  const ordered: DeliveryOrder[] = [];
  let current = DEPOT as { lat: number; lng: number };
  while (remaining.length) {
    let bestI = 0;
    let bestD = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(current, remaining[i]!);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    }
    const next = remaining.splice(bestI, 1)[0]!;
    ordered.push(next);
    current = next;
  }
  return ordered;
}

export function listDeliveryAgents(): DeliveryAgent[] {
  return [...DELIVERY_AGENTS_SEED];
}

export function listDeliveryOpsOrders(): DeliveryOrder[] {
  return DELIVERY_ORDERS_SEED.map((o) => ({ ...o }));
}

export function groupDeliveryOrdersByOutcode(
  orders: DeliveryOrder[],
): { outcode: string; areaLabel: string; orders: DeliveryOrder[] }[] {
  const map = new Map<
    string,
    { areaLabel: string; orders: DeliveryOrder[] }
  >();
  for (const o of orders) {
    const oc = outwardUkPostcode(o.postcode);
    const cur = map.get(oc);
    if (cur) {
      cur.orders.push(o);
    } else {
      map.set(oc, { areaLabel: o.areaLabel, orders: [o] });
    }
  }
  return [...map.entries()]
    .map(([outcode, v]) => ({
      outcode,
      areaLabel: v.areaLabel,
      orders: v.orders.sort((a, b) => a.code.localeCompare(b.code)),
    }))
    .sort((a, b) => a.outcode.localeCompare(b.outcode));
}

export function computeDeliveryAreaStats(
  orders: DeliveryOrder[],
): DeliveryAreaStat[] {
  const groups = groupDeliveryOrdersByOutcode(orders);
  return groups.map((g) => {
    let unassigned = 0;
    let assigned = 0;
    let enRoute = 0;
    let delivered = 0;
    for (const o of g.orders) {
      if (o.dispatchStatus === "unassigned") unassigned++;
      else if (o.dispatchStatus === "assigned") assigned++;
      else if (o.dispatchStatus === "en_route") enRoute++;
      else delivered++;
    }
    return {
      outcode: g.outcode,
      areaLabel: g.areaLabel,
      total: g.orders.length,
      unassigned,
      assigned,
      enRoute,
      delivered,
    };
  });
}

export function buildDeliveryRoutePlans(
  orders: DeliveryOrder[],
): DeliveryRoutePlan[] {
  const active = orders.filter(
    (o) =>
      (o.dispatchStatus === "assigned" || o.dispatchStatus === "en_route") &&
      o.assignedAgentId,
  );
  const byAgent = new Map<string, DeliveryOrder[]>();
  for (const o of active) {
    const id = o.assignedAgentId!;
    const list = byAgent.get(id) ?? [];
    list.push(o);
    byAgent.set(id, list);
  }
  const agents = new Map(DELIVERY_AGENTS_SEED.map((a) => [a.id, a]));
  const plans: DeliveryRoutePlan[] = [];
  for (const [agentId, agentOrders] of byAgent) {
    const agent = agents.get(agentId);
    if (!agent) continue;
    const sorted = nearestNeighborFromDepot(agentOrders);
    const stops: RouteStop[] = sorted.map((o, i) => ({
      orderId: o.id,
      sequence: i + 1,
      code: o.code,
      customerName: o.customerName,
      shortAddress: o.addressLine,
      postcode: o.postcode,
      lat: o.lat,
      lng: o.lng,
      linkedRestaurantOrderId: o.linkedRestaurantOrderId,
    }));
    plans.push({
      agentId,
      agentName: agent.name,
      vehicle: agent.vehicle,
      stops,
      estimatedMinutes: estimatedMinutesForStops(stops),
    });
  }
  return plans.sort((a, b) => a.agentName.localeCompare(b.agentName));
}

/** Depot + stops in visit order, normalised to 0–100 SVG coordinates. */
export function projectFullRouteSvg(
  stops: RouteStop[],
  padding = 8,
): { x: number; y: number }[] {
  const pts = [DEPOT, ...stops.map((s) => ({ lat: s.lat, lng: s.lng }))];
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latSpan = Math.max(maxLat - minLat, 0.004);
  const lngSpan = Math.max(maxLng - minLng, 0.004);
  const inner = 100 - padding * 2;
  return pts.map((p) => ({
    x: padding + ((p.lng - minLng) / lngSpan) * inner,
    y: padding + (1 - (p.lat - minLat) / latSpan) * inner,
  }));
}
