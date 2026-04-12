export type PartnerRestaurantStatus = "active" | "pending" | "inactive";

export type PartnerDirectoryRow = {
  id: string;
  name: string;
  imageSrc: string;
  owner: string;
  location: string;
  cuisine: string;
  status: PartnerRestaurantStatus;
  /** Which action affordances to show in the last column */
  actionKind: "default" | "pending_review" | "inactive";
};

export type PartnerDirectorySample = {
  rows: PartnerDirectoryRow[];
  pendingCount: number;
  totalCount: number;
  kpis: {
    newApplications: { value: string; delta: string };
    revenueShare: { value: string; delta: string };
    satisfaction: { value: string };
    churn: { value: string; note: string };
  };
};

export function getPartnerDirectorySample(): PartnerDirectorySample {
  return {
    pendingCount: 48,
    totalCount: 1204,
    kpis: {
      newApplications: { value: "+14", delta: "+8%" },
      revenueShare: { value: "$284k", delta: "+12%" },
      satisfaction: { value: "4.8" },
      churn: { value: "0.4%", note: "Stable" },
    },
    rows: [
      {
        id: "RES-9283",
        name: "Le Petit Palais",
        imageSrc:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCfScIxUStx_eFLgv70o95oXW_cqjnhEJhfhhWeaZRkE6QePn_eR8dvlJr7PxnYcusRDc-06KYSGfUksLVBq88X7xjAEMrREljwNxiqyvP3ag_boaU3ftQ4lWaOVJxJodOhVB9xZyvvV5KXUcLLwMze0-KbDQRwGmKbhCmgmVN0VQrcQ6xIpEteD_IykDuiaWxZ0JtBLW5mvaMOpNx5AqAJSTS9107t3azn94ov6mJE71CbZzFtms90H4VYSZOWmGukpvkW04UPII4",
        owner: "Jean-Marc Duprie",
        location: "Downtown, SF",
        cuisine: "French Modern",
        status: "active",
        actionKind: "default",
      },
      {
        id: "RES-1042",
        name: "Sakura Zenith",
        imageSrc:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAsa4gGGpNcVlJB73hfaLIDtT57GPey_6CxvSwzp24YFnXsyZM06UscHqLl5P4tPb3GVcuowppYScgHfqaxVgipzdb7eZGEymgxzjFCKqDLWobOQaJLC5anhF94JuU52Dx_7vSsP1KzOCSN7NlW8PjBpEdHhVaiVPSoYVN0pgxGnAgcT5iQoevMc4XDhyOFx7A7CTSQIfSCOOPuW4_SABgBZs1bBcsqPe5HDsZAd_jhhoytOGegd7Vxg61dx9P_scB6QvbrdoSRDl4",
        owner: "Akira Sato",
        location: "Nob Hill, SF",
        cuisine: "Japanese Fusion",
        status: "pending",
        actionKind: "pending_review",
      },
      {
        id: "RES-5521",
        name: "Terra Pizza",
        imageSrc:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAvq6FCH5HxTRBVO5OzddsMlX7VqFYY3UD-YOazXAfCV7VUvn_X9wFiP-D45ygpoXV1hIMcTpCMD6CyQb6G1XHjNGotkkZ_4fpl8ZBbMs8kt3lU9XqndTDvbQBMJxUi0RvemhWw0Ua0L3alQL6D5oeXReOG5Dm6aKviRBSa0vSxItmMMe4Vo4wi7G_qu0_-G5mMNHo5gLp_7p2BOuUSGOJfUcRqJ0JaFlvr2Vua08pm_OTIPiv_mUHD9yhmQGknnvRNqkLLjQB1DjY",
        owner: "Marco Rossi",
        location: "Mission District, SF",
        cuisine: "Artisanal Pizza",
        status: "inactive",
        actionKind: "inactive",
      },
      {
        id: "RES-2201",
        name: "Aztec Soul",
        imageSrc:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBV19acRXmrBrSf5AiBG7Qqr3Z59uAj0qcBswLHxTp2TppLq5gnZQIWqsUpQpncgxLv0AU0imwEN033FN-aTroclWHnK7yGteUcxzlMlsroWLxn9j0jrx9Au1qodX7uGmjqB6yu9l2kvC2oBtzXJAumsrB2KASEuzV1E-4oyxsMD8dM3I-xB9yPf4YHTPL1EkT6TUdHMe2XLBLP7upBZUdwR-EXxiaJ39ldqqXr-BAz37o36XvIGNkyErtD0BREHYaK9gpMvZ8N5Ks",
        owner: "Elena Gomez",
        location: "Oakland, CA",
        cuisine: "Mexican Heritage",
        status: "active",
        actionKind: "default",
      },
    ],
  };
}
