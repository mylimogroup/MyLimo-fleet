import type {
  Vehicle,
  VehicleFilters,
  VehicleFormData,
  VehicleListItem,
} from "@/lib/types";

export interface VehicleRepository {
  list(filters?: VehicleFilters): Promise<VehicleListItem[]>;
  getById(id: string): Promise<Vehicle | null>;
  create(data: VehicleFormData): Promise<Vehicle>;
  update(id: string, data: Partial<VehicleFormData>): Promise<Vehicle>;
  delete(id: string): Promise<void>;
}

export function vehicleToListItem(vehicle: Vehicle): VehicleListItem {
  const deadlineEntries = [
    { type: "Insurance", date: vehicle.deadlines.insurance },
    { type: "Road Tax", date: vehicle.deadlines.roadTax },
    { type: "Inspection", date: vehicle.deadlines.inspection },
    { type: "NCC Licence", date: vehicle.deadlines.nccLicence },
    { type: "Other", date: vehicle.deadlines.other },
  ].filter((d): d is { type: string; date: string } => d.date !== null);

  const now = new Date();
  const sorted = deadlineEntries
    .map((d) => ({
      type: d.type,
      date: d.date,
      daysRemaining: Math.ceil(
        (new Date(d.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  return {
    id: vehicle.id,
    photoUrl: vehicle.photoUrl,
    licensePlate: vehicle.licensePlate,
    brand: vehicle.brand,
    model: vehicle.model,
    currentMileage: vehicle.currentMileage,
    status: vehicle.status,
    nextDeadline: sorted[0] ?? null,
  };
}

export function formDataToVehicle(
  data: VehicleFormData,
  id?: string
): Vehicle {
  const now = new Date().toISOString();
  return {
    id: id ?? crypto.randomUUID(),
    photoUrl: data.photoUrl,
    licensePlate: data.licensePlate,
    brand: data.brand,
    model: data.model,
    year: typeof data.year === "number" ? data.year : 0,
    vin: data.vin,
    color: data.color,
    fuel: data.fuel,
    transmission: data.transmission,
    seats: typeof data.seats === "number" ? data.seats : 0,
    currentMileage:
      typeof data.currentMileage === "number" ? data.currentMileage : 0,
    status: data.status,
    deadlines: data.deadlines,
    maintenance: data.maintenance,
    tires: data.tires,
    documents: data.documents,
    costs: data.costs,
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  };
}

export function createEmptyVehicleForm(): VehicleFormData {
  return {
    photoUrl: null,
    licensePlate: "",
    brand: "",
    model: "",
    year: "",
    vin: "",
    color: "",
    fuel: "diesel",
    transmission: "automatic",
    seats: "",
    currentMileage: "",
    status: "available",
    deadlines: {
      insurance: null,
      roadTax: null,
      inspection: null,
      nccLicence: null,
      other: null,
    },
    maintenance: {
      lastEngineService: null,
      nextEngineService: null,
      gearboxService: null,
      brakeService: null,
      battery: null,
      other: null,
    },
    tires: {
      season: "all_season",
      replacementDate: null,
      replacementMileage: null,
    },
    documents: [],
    costs: [],
    notes: "",
  };
}
