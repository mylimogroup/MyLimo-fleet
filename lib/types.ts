export type ActivityType =
  | "mileage_update"
  | "maintenance"
  | "vehicle_added"
  | "deadline"
  | "assignment";

export type VehicleDocumentCategory =
  | "registration_certificate"
  | "insurance"
  | "vehicle_inspection"
  | "road_tax"
  | "leasing_contract";

export interface VehicleDocument {
  id: string;
  category: VehicleDocumentCategory;
  issueDate: string | null;
  expirationDate: string | null;
  pdfUrl: string | null;
  pdfName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleCostEntry {
  id: string;
  date: string;
  description: string;
  supplier: string;
  cost: number;
}

export type VehicleHistoryType =
  | "mileage_update"
  | "vehicle_created"
  | "vehicle_updated"
  | "document_added"
  | "document_updated"
  | "document_deleted"
  | "cost_added"
  | "maintenance"
  | "insurance_renewal"
  | "road_tax_payment"
  | "inspection"
  | "tire_replacement"
  | "tire_rotation"
  | "automatic_transmission_service"
  | "vehicle_purchase";

export type VehicleDeadlineCategory =
  | "insurance"
  | "road_tax"
  | "vehicle_inspection"
  | "scheduled_service"
  | "oil_change"
  | "automatic_transmission_service"
  | "tire_rotation"
  | "tire_replacement"
  | "brakes"
  | "battery"
  | "custom";

export type DeadlineUrgency = "overdue" | "urgent" | "approaching" | "normal";

export interface VehicleDeadline {
  id: string;
  category: VehicleDeadlineCategory;
  label: string;
  dueDate: string | null;
  targetMileage: number | null;
  sourceMaintenanceId: string | null;
  sourceDocumentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ComputedDeadline extends VehicleDeadline {
  urgency: DeadlineUrgency;
  daysRemaining: number | null;
  remainingKm: number | null;
  currentMileage: number;
  isAdministrative: boolean;
}

export interface VehicleHistoryEntry {
  id: string;
  type: VehicleHistoryType;
  description: string;
  timestamp: string;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  firstRegistrationDate: string | null;
  vin: string;
  currentMileage: number;
  lastMileageUpdateDate: string | null;
  notes: string;
  purchaseDate: string | null;
  purchasePrice: number | null;
  documents: VehicleDocument[];
  costs: VehicleCostEntry[];
  deadlines: VehicleDeadline[];
  history: VehicleHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface VehicleListItem {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  version: string;
  currentMileage: number;
  nextDeadline: {
    label: string;
    urgency: DeadlineUrgency;
    dueDate: string | null;
    targetMileage: number | null;
    daysRemaining: number | null;
    remainingKm: number | null;
  } | null;
}

export interface VehicleFormData {
  licensePlate: string;
  brand: string;
  model: string;
  version: string;
  year: number | "";
  firstRegistrationDate: string | null;
  vin: string;
  currentMileage: number | "";
  notes: string;
  purchaseDate: string | null;
  purchasePrice: number | "";
}

export interface VehicleDocumentFormData {
  category: VehicleDocumentCategory;
  issueDate: string | null;
  expirationDate: string | null;
  pdfUrl: string | null;
  pdfName: string | null;
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
  | "scheduled_service"
  | "oil_change"
  | "automatic_transmission_service"
  | "tire_replacement"
  | "tire_rotation"
  | "brakes"
  | "battery"
  | "air_conditioning"
  | "mechanical_repair"
  | "bodywork"
  | "other";

export type TireType = "summer" | "winter" | "all_season";

export interface TireDetails {
  tireType: TireType;
  brand: string;
  model: string;
  size: string;
  installationDate: string;
  installationMileage: number;
}

export interface MaintenanceRecurrence {
  enabled: boolean;
  repeatEveryKm: number | null;
  repeatEveryMonths: number | null;
}

export interface TireRotationReminder {
  enabled: boolean;
  intervalKm: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  category: MaintenanceCategory;
  description: string;
  workshop: string;
  completedDate: string;
  mileage: number;
  labourCost: number;
  totalCost: number;
  notes: string;
  invoicePdfUrl: string | null;
  invoicePdfName: string | null;
  tireDetails: TireDetails | null;
  recurrence: MaintenanceRecurrence | null;
  generatedDeadlineIds: string[];
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
  workshop: string;
  completedDate: string;
  mileage: number;
  labourCost: number;
  totalCost: number;
}

export interface MaintenanceFormData {
  vehicleId: string;
  category: MaintenanceCategory;
  description: string;
  workshop: string;
  completedDate: string;
  mileage: number | "";
  labourCost: number | "";
  totalCost: number | "";
  notes: string;
  invoicePdfUrl: string | null;
  invoicePdfName: string | null;
  tireDetails: TireDetails | null;
  recurrence: MaintenanceRecurrence;
  tireRotationReminder: TireRotationReminder;
}

export interface MaintenanceKPIs {
  vehiclesRequiringAttention: number;
  upcomingMaintenance: number;
  overdueDeadlines: number;
  monthlyMaintenanceCosts: number;
}

export type MaintenanceAlertType =
  | "insurance"
  | "road_tax"
  | "vehicle_inspection"
  | "maintenance";

export interface MaintenanceAlert {
  vehicleId: string;
  licensePlate: string;
  type: MaintenanceAlertType;
  label: string;
  message: string;
  urgency: DeadlineUrgency;
  dueDate?: string;
  targetMileage?: number;
  daysRemaining?: number;
  remainingKm?: number;
}

export interface MaintenanceFilters {
  search?: string;
  brand?: string;
  category?: MaintenanceCategory | "all";
  dateFrom?: string;
  dateTo?: string;
}
