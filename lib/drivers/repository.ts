import type {
  Driver,
  DriverFormData,
  DriverListItem,
} from "@/lib/types";
import { vehicles } from "@/lib/vehicles/data";

export interface DriverRepository {
  list(): Promise<DriverListItem[]>;
  getById(id: string): Promise<Driver | null>;
  create(data: DriverFormData): Promise<Driver>;
  update(id: string, data: Partial<DriverFormData>): Promise<Driver>;
  delete(id: string): Promise<void>;
}

function resolveVehicle(vehicleId: string | null) {
  if (!vehicleId) return null;
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return null;
  return {
    id: vehicle.id,
    plate: vehicle.licensePlate,
    brand: vehicle.brand,
    model: vehicle.model,
  };
}

export function driverToListItem(driver: Driver): DriverListItem {
  return {
    id: driver.id,
    photoUrl: driver.photoUrl,
    fullName: `${driver.personal.firstName} ${driver.personal.lastName}`,
    phone: driver.personal.phone,
    assignedVehicle: resolveVehicle(driver.operational.assignedVehicleId),
    status: driver.operational.status,
    drivingLicenseExpiration: driver.documents.drivingLicenseExpiration,
    cqcExpiration: driver.documents.cqcExpiration,
    languages: driver.personal.languages,
  };
}

export function formDataToDriver(data: DriverFormData, id?: string): Driver {
  const now = new Date().toISOString();
  const vehicle = resolveVehicle(data.operational.assignedVehicleId);

  const currentAssignment =
    data.operational.assignedVehicleId && vehicle
      ? {
          id: crypto.randomUUID(),
          vehicleId: vehicle.id,
          vehiclePlate: vehicle.plate,
          vehicleBrand: vehicle.brand,
          vehicleModel: vehicle.model,
          startDate: new Date().toISOString().split("T")[0],
          endDate: null,
          notes: "",
        }
      : null;

  return {
    id: id ?? crypto.randomUUID(),
    photoUrl: data.photoUrl,
    personal: data.personal,
    documents: data.documents,
    operational: data.operational,
    files: data.files,
    assignments: currentAssignment ? [currentAssignment] : [],
    leaves: [],
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  };
}

export function createEmptyDriverForm(): DriverFormData {
  return {
    photoUrl: null,
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: null,
      address: "",
      taxCode: "",
      languages: [],
    },
    documents: {
      drivingLicenseNumber: "",
      drivingLicenseExpiration: null,
      cqcExpiration: null,
      nccLicenseNumber: null,
      nccLicenseExpiration: null,
      medicalCertificateExpiration: null,
    },
    operational: {
      status: "active",
      assignedVehicleId: null,
      hireDate: null,
      contractType: "employee",
      employeeId: "",
    },
    files: [],
    notes: "",
  };
}

export function driverToFormData(driver: Driver): DriverFormData {
  return {
    photoUrl: driver.photoUrl,
    personal: driver.personal,
    documents: driver.documents,
    operational: driver.operational,
    files: driver.files,
    notes: driver.notes,
  };
}
