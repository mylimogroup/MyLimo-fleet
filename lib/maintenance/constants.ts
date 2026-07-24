import type { MaintenanceCategory } from "@/lib/types";

export const MAINTENANCE_CATEGORIES: {
  value: MaintenanceCategory;
  label: string;
}[] = [
  { value: "oil_change", label: "Oil Change" },
  { value: "inspection", label: "Inspection" },
  { value: "brakes", label: "Brakes" },
  { value: "tyres", label: "Tyres" },
  { value: "insurance", label: "Insurance" },
  { value: "road_tax", label: "Road Tax" },
  { value: "mot", label: "MOT" },
  { value: "battery", label: "Battery" },
  { value: "air_conditioning", label: "Air Conditioning" },
  { value: "unexpected_repair", label: "Unexpected Repair" },
];

export const OIL_SERVICE_INTERVAL_KM = 15000;
