import type {
  Activity,
  ActivityType,
  FleetDeadlineRow,
  VehicleHistoryType,
} from "@/lib/types";
import { computeFleetDeadlines } from "@/lib/vehicles/deadlines";
import { getVehicleStore } from "@/lib/vehicles/service";

function historyTypeToActivityType(type: VehicleHistoryType): ActivityType {
  if (type === "vehicle_created") return "vehicle_added";
  if (type === "deadline") return "deadline";
  if (type === "mileage_update") return "mileage_update";
  if (
    type === "maintenance" ||
    type === "tire_rotation" ||
    type === "tire_replacement" ||
    type === "automatic_transmission_service" ||
    type === "inspection" ||
    type === "insurance_renewal" ||
    type === "road_tax_payment"
  ) {
    return "maintenance";
  }
  return "maintenance";
}

export function getLiveUpcomingDeadlines(): FleetDeadlineRow[] {
  return computeFleetDeadlines(getVehicleStore())
    .filter((d) => d.urgency !== "normal")
    .slice(0, 5);
}

export function getLiveUpcomingDeadlinesCount(): number {
  return computeFleetDeadlines(getVehicleStore()).filter(
    (d) => d.urgency !== "normal"
  ).length;
}

export function getLiveRecentActivity(): Activity[] {
  const vehicles = getVehicleStore();

  return vehicles
    .flatMap((vehicle) =>
      vehicle.history.map((entry) => ({
        id: `${vehicle.id}-${entry.id}`,
        type: historyTypeToActivityType(entry.type),
        description: entry.description,
        vehiclePlate: vehicle.licensePlate,
        timestamp: entry.timestamp,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 12);
}
