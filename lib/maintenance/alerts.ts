import type { MaintenanceAlert, Vehicle } from "@/lib/types";
import {
  computeAllDeadlines,
  DEADLINE_CATEGORY_LABELS,
} from "@/lib/vehicles/deadlines";

function alertTypeFromCategory(
  category: string
): MaintenanceAlert["type"] {
  if (category === "insurance") return "insurance";
  if (category === "road_tax") return "road_tax";
  if (category === "vehicle_inspection") return "vehicle_inspection";
  if (category === "ncc_license") return "ncc_license";
  return "maintenance";
}

function buildAlertMessage(deadline: ReturnType<typeof computeAllDeadlines>[0]): string {
  const parts: string[] = [];
  if (deadline.daysRemaining !== null) {
    if (deadline.daysRemaining <= 0) {
      parts.push("date overdue");
    } else {
      parts.push(`${deadline.daysRemaining}d remaining`);
    }
  }
  if (deadline.remainingKm !== null) {
    if (deadline.remainingKm <= 0) {
      parts.push("mileage reached");
    } else {
      parts.push(`${deadline.remainingKm.toLocaleString("it-IT")} km remaining`);
    }
  }
  return parts.length > 0
    ? `${deadline.label} — ${parts.join(", ")}`
    : deadline.label;
}

export function computeMaintenanceAlerts(
  vehicleList: Vehicle[]
): MaintenanceAlert[] {
  const alerts: MaintenanceAlert[] = [];

  for (const vehicle of vehicleList) {
    const deadlines = computeAllDeadlines(vehicle).filter(
      (d) => d.urgency !== "normal"
    );

    for (const deadline of deadlines) {
      alerts.push({
        vehicleId: vehicle.id,
        licensePlate: vehicle.licensePlate,
        type: alertTypeFromCategory(deadline.category),
        label: deadline.label,
        message: buildAlertMessage(deadline),
        urgency: deadline.urgency,
        dueDate: deadline.dueDate ?? undefined,
        targetMileage: deadline.targetMileage ?? undefined,
        daysRemaining: deadline.daysRemaining ?? undefined,
        remainingKm: deadline.remainingKm ?? undefined,
      });
    }
  }

  return alerts;
}

export function getAlertsForVehicle(
  vehicle: Vehicle
): MaintenanceAlert[] {
  return computeMaintenanceAlerts([vehicle]);
}

export { DEADLINE_CATEGORY_LABELS };
