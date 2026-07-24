import type { ItalianVatRate, VehicleCostCategory } from "@/lib/types";
import { ALLOWED_VAT_RATES, DEFAULT_VAT_RATE } from "@/lib/vehicles/money";

export const VEHICLE_COST_CATEGORIES: {
  value: VehicleCostCategory;
  label: string;
}[] = [
  { value: "maintenance", label: "Maintenance" },
  { value: "repairs", label: "Repairs" },
  { value: "tires", label: "Tires" },
  { value: "insurance", label: "Insurance" },
  { value: "road_tax", label: "Road Tax" },
  { value: "vehicle_inspection", label: "Vehicle Inspection / MOT" },
  { value: "ncc_license", label: "NCC License / Authorization" },
  { value: "cleaning", label: "Cleaning / Detailing" },
  { value: "parking", label: "Parking" },
  { value: "tolls", label: "Tolls" },
  { value: "fuel", label: "Fuel" },
  { value: "adblue", label: "AdBlue" },
  { value: "other", label: "Other" },
];

export const MAINTENANCE_REPAIR_CATEGORIES: VehicleCostCategory[] = [
  "maintenance",
  "repairs",
];

export const FUEL_CATEGORIES: VehicleCostCategory[] = ["fuel", "adblue"];

export { DEFAULT_VAT_RATE };

export const ITALIAN_VAT_RATES: {
  value: ItalianVatRate;
  label: string;
}[] = [
  { value: 22, label: "22% — Standard VAT" },
  { value: 10, label: "10% — Reduced VAT" },
  { value: 5, label: "5% — Reduced VAT" },
  { value: 4, label: "4% — Super-reduced VAT" },
  { value: 0, label: "0% — Exempt / Non-taxable" },
];

export { ALLOWED_VAT_RATES };
