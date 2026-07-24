import type { MaintenanceAlert, MaintenanceRecord } from "@/lib/types";
import { OIL_SERVICE_INTERVAL_KM } from "@/lib/maintenance/constants";
import { daysUntil } from "@/lib/maintenance/utils";
import { vehicles } from "@/lib/vehicles/data";

const EXPIRY_WARNING_DAYS = 30;
const EXPIRY_DANGER_DAYS = 7;

export function computeMaintenanceAlerts(
  records: MaintenanceRecord[]
): MaintenanceAlert[] {
  const alerts: MaintenanceAlert[] = [];

  for (const vehicle of vehicles) {
    if (vehicle.deadlines.insurance) {
      const days = daysUntil(vehicle.deadlines.insurance);
      if (days <= EXPIRY_WARNING_DAYS) {
        alerts.push({
          vehicleId: vehicle.id,
          licensePlate: vehicle.licensePlate,
          type: "insurance_expiring",
          message: `Insurance expires in ${days}d`,
          severity: days <= EXPIRY_DANGER_DAYS ? "danger" : "warning",
          dueDate: vehicle.deadlines.insurance,
        });
      }
    }

    if (vehicle.deadlines.roadTax) {
      const days = daysUntil(vehicle.deadlines.roadTax);
      if (days <= EXPIRY_WARNING_DAYS) {
        alerts.push({
          vehicleId: vehicle.id,
          licensePlate: vehicle.licensePlate,
          type: "road_tax_expiring",
          message: `Road tax due in ${days}d`,
          severity: days <= EXPIRY_DANGER_DAYS ? "danger" : "warning",
          dueDate: vehicle.deadlines.roadTax,
        });
      }
    }

    if (vehicle.deadlines.inspection) {
      const days = daysUntil(vehicle.deadlines.inspection);
      if (days <= EXPIRY_WARNING_DAYS) {
        alerts.push({
          vehicleId: vehicle.id,
          licensePlate: vehicle.licensePlate,
          type: "inspection_expiring",
          message: `Inspection due in ${days}d`,
          severity: days <= EXPIRY_DANGER_DAYS ? "danger" : "warning",
          dueDate: vehicle.deadlines.inspection,
        });
      }
    }

    const lastOilService = records
      .filter(
        (r) =>
          r.vehicleId === vehicle.id &&
          r.category === "oil_change" &&
          r.status === "completed"
      )
      .sort((a, b) => b.mileage - a.mileage)[0];

    if (lastOilService?.nextServiceMileage) {
      if (vehicle.currentMileage >= lastOilService.nextServiceMileage) {
        alerts.push({
          vehicleId: vehicle.id,
          licensePlate: vehicle.licensePlate,
          type: "oil_service_due",
          message: `Oil service due at ${vehicle.currentMileage.toLocaleString("it-IT")} km`,
          severity: "danger",
          dueMileage: lastOilService.nextServiceMileage,
        });
      } else if (
        vehicle.currentMileage >=
        lastOilService.nextServiceMileage - 2000
      ) {
        alerts.push({
          vehicleId: vehicle.id,
          licensePlate: vehicle.licensePlate,
          type: "oil_service_due",
          message: `Oil service approaching (${(lastOilService.nextServiceMileage - vehicle.currentMileage).toLocaleString("it-IT")} km remaining)`,
          severity: "warning",
          dueMileage: lastOilService.nextServiceMileage,
        });
      }
    } else if (vehicle.maintenance.lastEngineService && vehicle.currentMileage >= OIL_SERVICE_INTERVAL_KM) {
      alerts.push({
          vehicleId: vehicle.id,
          licensePlate: vehicle.licensePlate,
          type: "oil_service_due",
          message: "Oil service overdue by mileage",
          severity: "warning",
      });
    }
  }

  for (const record of records) {
    if (record.status === "overdue") {
      alerts.push({
        vehicleId: record.vehicleId,
        licensePlate:
          vehicles.find((v) => v.id === record.vehicleId)?.licensePlate ?? "—",
        type: "service_overdue",
        message: `${record.description} is overdue`,
        severity: "danger",
        dueDate: record.scheduledDate,
      });
    }
  }

  return alerts;
}

export function getAlertsForVehicle(
  vehicleId: string,
  records: MaintenanceRecord[]
): MaintenanceAlert[] {
  return computeMaintenanceAlerts(records).filter(
    (a) => a.vehicleId === vehicleId
  );
}
