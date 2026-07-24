import type { VehicleDocumentCategory } from "@/lib/types";

export const VEHICLE_DOCUMENT_CATEGORIES: {
  value: VehicleDocumentCategory;
  label: string;
}[] = [
  { value: "registration_certificate", label: "Registration Certificate" },
  { value: "insurance", label: "Insurance" },
  { value: "vehicle_inspection", label: "Vehicle Inspection / MOT" },
  { value: "road_tax", label: "Road Tax" },
  { value: "leasing_contract", label: "Leasing / Rental Contract" },
];

export function getDocumentCategoryLabel(
  category: VehicleDocumentCategory
): string {
  return (
    VEHICLE_DOCUMENT_CATEGORIES.find((c) => c.value === category)?.label ??
    category
  );
}
