export type VehicleStatus = "available" | "in_use" | "maintenance";

export type FuelType = "petrol" | "diesel" | "hybrid" | "electric" | "lpg";

export type TransmissionType = "automatic" | "manual";

export type TireSeason = "summer" | "winter" | "all_season";

export type ActivityType =
  | "mileage_update"
  | "maintenance"
  | "vehicle_added"
  | "deadline"
  | "assignment";

export interface VehicleDeadlines {
  insurance: string | null;
  roadTax: string | null;
  inspection: string | null;
  nccLicence: string | null;
  other: string | null;
}

export interface VehicleMaintenance {
  lastEngineService: string | null;
  nextEngineService: string | null;
  gearboxService: string | null;
  brakeService: string | null;
  battery: string | null;
  other: string | null;
}

export interface VehicleTires {
  season: TireSeason;
  replacementDate: string | null;
  replacementMileage: number | null;
}

export interface VehicleDocument {
  id: string;
  name: string;
  type: "pdf" | "image";
  url: string;
  uploadedAt: string;
}

export interface VehicleCostEntry {
  id: string;
  date: string;
  description: string;
  supplier: string;
  cost: number;
}

export interface Vehicle {
  id: string;
  photoUrl: string | null;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  color: string;
  fuel: FuelType;
  transmission: TransmissionType;
  seats: number;
  currentMileage: number;
  status: VehicleStatus;
  deadlines: VehicleDeadlines;
  maintenance: VehicleMaintenance;
  tires: VehicleTires;
  documents: VehicleDocument[];
  costs: VehicleCostEntry[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleListItem {
  id: string;
  photoUrl: string | null;
  licensePlate: string;
  brand: string;
  model: string;
  currentMileage: number;
  status: VehicleStatus;
  nextDeadline: {
    type: string;
    date: string;
    daysRemaining: number;
  } | null;
}

export interface VehicleFormData {
  photoUrl: string | null;
  licensePlate: string;
  brand: string;
  model: string;
  year: number | "";
  vin: string;
  color: string;
  fuel: FuelType;
  transmission: TransmissionType;
  seats: number | "";
  currentMileage: number | "";
  status: VehicleStatus;
  deadlines: VehicleDeadlines;
  maintenance: VehicleMaintenance;
  tires: VehicleTires;
  documents: VehicleDocument[];
  costs: VehicleCostEntry[];
  notes: string;
}

export interface Deadline {
  id: string;
  vehiclePlate: string;
  type: string;
  dueDate: string;
  daysRemaining: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  vehiclePlate?: string;
  timestamp: string;
}

export interface MonthlyCosts {
  total: number;
  fuel: number;
  maintenance: number;
  insurance: number;
  other: number;
}

export interface FleetStats {
  totalVehicles: number;
  available: number;
  inMaintenance: number;
  inUse: number;
  upcomingDeadlines: number;
  monthlyCosts: MonthlyCosts;
}

export interface VehicleFilters {
  status?: VehicleStatus | "all";
  brand?: string;
  search?: string;
}

// ─── Drivers ───────────────────────────────────────────────────────────────

export type DriverStatus = "active" | "on_duty" | "on_leave" | "inactive";

export type DriverContractType = "employee" | "collaborator" | "freelance";

export type DriverLeaveType = "vacation" | "sick" | "personal" | "other";

export type DriverLeaveStatus = "approved" | "pending" | "rejected";

export type DriverFileCategory =
  | "identity"
  | "license"
  | "contract"
  | "medical"
  | "other";

export interface DriverPersonal {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  address: string;
  taxCode: string;
  languages: string[];
}

export interface DriverDocuments {
  drivingLicenseNumber: string;
  drivingLicenseExpiration: string | null;
  cqcExpiration: string | null;
  nccLicenseNumber: string | null;
  nccLicenseExpiration: string | null;
  medicalCertificateExpiration: string | null;
}

export interface DriverOperational {
  status: DriverStatus;
  assignedVehicleId: string | null;
  hireDate: string | null;
  contractType: DriverContractType;
  employeeId: string;
}

export interface DriverFile {
  id: string;
  name: string;
  type: "pdf" | "image";
  category: DriverFileCategory;
  url: string;
  uploadedAt: string;
}

export interface DriverAssignment {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  startDate: string;
  endDate: string | null;
  notes: string;
}

export interface DriverLeave {
  id: string;
  type: DriverLeaveType;
  startDate: string;
  endDate: string;
  status: DriverLeaveStatus;
  notes: string;
}

export interface Driver {
  id: string;
  photoUrl: string | null;
  personal: DriverPersonal;
  documents: DriverDocuments;
  operational: DriverOperational;
  files: DriverFile[];
  assignments: DriverAssignment[];
  leaves: DriverLeave[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverListItem {
  id: string;
  photoUrl: string | null;
  fullName: string;
  phone: string;
  assignedVehicle: {
    id: string;
    plate: string;
    brand: string;
    model: string;
  } | null;
  status: DriverStatus;
  drivingLicenseExpiration: string | null;
  cqcExpiration: string | null;
  languages: string[];
}

export interface DriverFormData {
  photoUrl: string | null;
  personal: DriverPersonal;
  documents: DriverDocuments;
  operational: DriverOperational;
  files: DriverFile[];
  notes: string;
}

export interface DriverFilters {
  status?: DriverStatus | "all";
  vehicleId?: string;
  language?: string;
  search?: string;
}

// ─── Maintenance ───────────────────────────────────────────────────────────

export type MaintenanceCategory =
  | "oil_change"
  | "inspection"
  | "brakes"
  | "tyres"
  | "insurance"
  | "road_tax"
  | "mot"
  | "battery"
  | "air_conditioning"
  | "unexpected_repair";

export type MaintenanceStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "overdue"
  | "cancelled";

export type MaintenanceAttachmentType = "invoice" | "photo" | "pdf";

export interface MaintenanceAttachment {
  id: string;
  name: string;
  type: MaintenanceAttachmentType;
  url: string;
  uploadedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  category: MaintenanceCategory;
  status: MaintenanceStatus;
  description: string;
  workshop: string;
  invoiceNumber: string | null;
  scheduledDate: string;
  completedDate: string | null;
  mileage: number;
  labourCost: number;
  partsCost: number;
  totalCost: number;
  estimatedCost: number;
  nextServiceDate: string | null;
  nextServiceMileage: number | null;
  notes: string;
  attachments: MaintenanceAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceListItem {
  id: string;
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  licensePlate: string;
  category: MaintenanceCategory;
  status: MaintenanceStatus;
  workshop: string;
  scheduledDate: string;
  completedDate: string | null;
  mileage: number;
  estimatedCost: number;
  totalCost: number;
  nextServiceDate: string | null;
}

export interface MaintenanceFormData {
  vehicleId: string;
  category: MaintenanceCategory;
  status: MaintenanceStatus;
  description: string;
  workshop: string;
  invoiceNumber: string;
  scheduledDate: string;
  completedDate: string | null;
  mileage: number | "";
  labourCost: number | "";
  partsCost: number | "";
  estimatedCost: number | "";
  nextServiceDate: string | null;
  nextServiceMileage: number | null;
  notes: string;
  attachments: MaintenanceAttachment[];
}

export interface MaintenanceKPIs {
  vehiclesInMaintenance: number;
  upcomingServices: number;
  overdueMaintenance: number;
  monthlyMaintenanceCosts: number;
}

export type MaintenanceAlertType =
  | "service_overdue"
  | "insurance_expiring"
  | "road_tax_expiring"
  | "inspection_expiring"
  | "oil_service_due";

export interface MaintenanceAlert {
  vehicleId: string;
  licensePlate: string;
  type: MaintenanceAlertType;
  message: string;
  severity: "warning" | "danger";
  dueDate?: string;
  dueMileage?: number;
}

export interface MaintenanceFilters {
  search?: string;
  brand?: string;
  category?: MaintenanceCategory | "all";
  status?: MaintenanceStatus | "all";
  dateFrom?: string;
  dateTo?: string;
}
