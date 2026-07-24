import type { MaintenanceCategory } from "@/lib/types";

export const MAINTENANCE_CATEGORIES: {
  value: MaintenanceCategory;
  label: string;
}[] = [
  { value: "scheduled_service", label: "Scheduled Service" },
  { value: "oil_change", label: "Oil Change" },
  {
    value: "automatic_transmission_service",
    label: "Automatic Transmission Service",
  },
  { value: "tire_replacement", label: "Tire Replacement" },
  { value: "tire_rotation", label: "Tire Rotation" },
  { value: "brakes", label: "Brakes" },
  { value: "battery", label: "Battery" },
  { value: "air_conditioning", label: "Air Conditioning" },
  { value: "mechanical_repair", label: "Mechanical Repair" },
  { value: "bodywork", label: "Bodywork" },
  { value: "other", label: "Other" },
];

export const TIRE_ROTATION_INTERVALS = [
  { value: 10000, label: "10,000 km" },
  { value: 12000, label: "12,000 km" },
  { value: 15000, label: "15,000 km" },
] as const;
