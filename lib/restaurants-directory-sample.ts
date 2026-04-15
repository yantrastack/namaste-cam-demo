import listing from "@/data/restaurant-listing-sample.json";

export type PartnerRestaurantStatus = "active" | "pending" | "inactive";

export type PartnerDirectoryRow = {
  id: string;
  name: string;
  imageSrc: string;
  manager: string;
  location: string;
  serviceMode: string;
  status: PartnerRestaurantStatus;
};

export type SalesLocationTrend = "up" | "down" | "flat";

export type SalesLocationCard = {
  id: string;
  name: string;
  serviceMode: string;
  revenue: string;
  deltaLabel: string;
  deltaCaption: string;
  trend: SalesLocationTrend;
  ordersLabel: string;
  highlight?: boolean;
};

export type PartnerDirectorySample = {
  rows: PartnerDirectoryRow[];
  salesByLocation: {
    periodLabel: string;
    locations: SalesLocationCard[];
  };
};

export function getPartnerDirectorySample(): PartnerDirectorySample {
  return listing as PartnerDirectorySample;
}

export function getPartnerDirectoryRowById(id: string): PartnerDirectoryRow | undefined {
  const { rows } = getPartnerDirectorySample();
  return rows.find((row) => row.id === id);
}
