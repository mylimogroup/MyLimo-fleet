import type {
  Vehicle,
  VehicleDocument,
  VehicleFilters,
  VehicleFormData,
  VehicleHistoryEntry,
  VehicleListItem,
} from "@/lib/types";
import { getNextDeadlineForVehicle } from "@/lib/vehicles/deadlines";

export interface VehicleRepository {
  list(filters?: VehicleFilters): Promise<VehicleListItem[]>;
  getById(id: string): Promise<Vehicle | null>;
  create(data: VehicleFormData): Promise<Vehicle>;
  update(id: string, data: Partial<VehicleFormData>): Promise<Vehicle>;
  updateMileage(id: string, mileage: number): Promise<Vehicle>;
  updateDocuments(id: string, documents: VehicleDocument[]): Promise<Vehicle>;
  updateCosts(
    id: string,
    costs: Vehicle["costs"]
  ): Promise<Vehicle>;
  delete(id: string): Promise<void>;
}

function getNextDeadline(vehicle: Vehicle): VehicleListItem["nextDeadline"] {
  return getNextDeadlineForVehicle(vehicle);
}

export function vehicleToListItem(vehicle: Vehicle): VehicleListItem {
  return {
    id: vehicle.id,
    licensePlate: vehicle.licensePlate,
    brand: vehicle.brand,
    model: vehicle.model,
    version: vehicle.version,
    currentMileage: vehicle.currentMileage,
    nextDeadline: getNextDeadline(vehicle),
  };
}

function appendHistory(
  vehicle: Vehicle,
  entry: Omit<VehicleHistoryEntry, "id">
): VehicleHistoryEntry[] {
  return [
    {
      id: crypto.randomUUID(),
      ...entry,
    },
    ...vehicle.history,
  ];
}

export function formDataToVehicle(
  data: VehicleFormData,
  id?: string,
  existing?: Vehicle
): Vehicle {
  const now = new Date().toISOString();
  const mileage =
    typeof data.currentMileage === "number" ? data.currentMileage : 0;

  if (existing) {
    return {
      ...existing,
      licensePlate: data.licensePlate,
      brand: data.brand,
      model: data.model,
      version: data.version,
      year: typeof data.year === "number" ? data.year : existing.year,
      firstRegistrationDate: data.firstRegistrationDate,
      vin: data.vin,
      currentMileage: mileage,
      notes: data.notes,
      purchaseDate: data.purchaseDate,
      purchasePrice:
        typeof data.purchasePrice === "number" ? data.purchasePrice : null,
      updatedAt: now,
      history: appendHistory(existing, {
        type: "vehicle_updated",
        description: "Vehicle master data updated",
        timestamp: now,
      }),
    };
  }

  return {
    id: id ?? crypto.randomUUID(),
    licensePlate: data.licensePlate,
    brand: data.brand,
    model: data.model,
    version: data.version,
    year: typeof data.year === "number" ? data.year : 0,
    firstRegistrationDate: data.firstRegistrationDate,
    vin: data.vin,
    currentMileage: mileage,
    lastMileageUpdateDate: mileage > 0 ? now.split("T")[0] : null,
    notes: data.notes,
    purchaseDate: data.purchaseDate,
    purchasePrice:
      typeof data.purchasePrice === "number" ? data.purchasePrice : null,
    documents: [],
    costs: [],
    deadlines: [],
    history: [
      {
        id: crypto.randomUUID(),
        type: "vehicle_created",
        description: "Vehicle added to fleet",
        timestamp: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export function vehicleToFormData(vehicle: Vehicle): VehicleFormData {
  return {
    licensePlate: vehicle.licensePlate,
    brand: vehicle.brand,
    model: vehicle.model,
    version: vehicle.version,
    year: vehicle.year,
    firstRegistrationDate: vehicle.firstRegistrationDate,
    vin: vehicle.vin,
    currentMileage: vehicle.currentMileage,
    notes: vehicle.notes,
    purchaseDate: vehicle.purchaseDate,
    purchasePrice: vehicle.purchasePrice ?? "",
  };
}

export function createEmptyVehicleForm(): VehicleFormData {
  return {
    licensePlate: "",
    brand: "",
    model: "",
    version: "",
    year: "",
    firstRegistrationDate: null,
    vin: "",
    currentMileage: "",
    notes: "",
    purchaseDate: null,
    purchasePrice: "",
  };
}

export function applyMileageUpdate(vehicle: Vehicle, mileage: number): Vehicle {
  const now = new Date().toISOString();
  const today = now.split("T")[0];
  return {
    ...vehicle,
    currentMileage: mileage,
    lastMileageUpdateDate: today,
    updatedAt: now,
    history: appendHistory(vehicle, {
      type: "mileage_update",
      description: `Mileage updated to ${mileage.toLocaleString("it-IT")} km`,
      timestamp: now,
    }),
  };
}
