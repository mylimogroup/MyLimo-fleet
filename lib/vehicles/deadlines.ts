import type {
  ComputedDeadline,
  DeadlineKPIs,
  DeadlineTriggerType,
  DeadlineUrgency,
  FleetDeadlineRow,
  MaintenanceCategory,
  MaintenanceFormData,
  Vehicle,
  VehicleDeadline,
  VehicleDeadlineCategory,
  VehicleDeadlineFormData,
  VehicleDocumentCategory,
  VehicleHistoryEntry,
  VehicleListItem,
} from "@/lib/types";
import { getDocumentCategoryLabel } from "@/lib/vehicles/documents";
import { getCategoryLabel } from "@/lib/maintenance/utils";

const ADMIN_DOC_CATEGORIES: VehicleDocumentCategory[] = [
  "insurance",
  "road_tax",
  "vehicle_inspection",
];

const ADMIN_CATEGORIES: VehicleDeadlineCategory[] = [
  "insurance",
  "road_tax",
  "vehicle_inspection",
  "ncc_license",
];

export const URGENCY_RANK: Record<DeadlineUrgency, number> = {
  overdue: 0,
  urgent: 1,
  approaching: 2,
  normal: 3,
};

export const DEADLINE_CATEGORY_LABELS: Record<VehicleDeadlineCategory, string> =
  {
    insurance: "Insurance",
    road_tax: "Road Tax",
    vehicle_inspection: "Vehicle Inspection / MOT",
    ncc_license: "NCC License / Authorization Renewal",
    scheduled_service: "Scheduled Service",
    oil_change: "Oil Change",
    automatic_transmission_service: "Automatic Transmission Service",
    tire_rotation: "Tire Rotation",
    tire_replacement: "Tire Replacement",
    brakes: "Brakes",
    battery: "Battery",
    custom: "Custom",
  };

export const DEADLINE_CATEGORIES: {
  value: VehicleDeadlineCategory;
  label: string;
  group: "administrative" | "maintenance";
}[] = [
  { value: "insurance", label: "Insurance", group: "administrative" },
  { value: "road_tax", label: "Road Tax", group: "administrative" },
  {
    value: "vehicle_inspection",
    label: "Vehicle Inspection / MOT",
    group: "administrative",
  },
  {
    value: "ncc_license",
    label: "NCC License / Authorization Renewal",
    group: "administrative",
  },
  { value: "scheduled_service", label: "Scheduled Service", group: "maintenance" },
  { value: "oil_change", label: "Oil Change", group: "maintenance" },
  {
    value: "automatic_transmission_service",
    label: "Automatic Transmission Service",
    group: "maintenance",
  },
  { value: "tire_replacement", label: "Tire Replacement", group: "maintenance" },
  { value: "tire_rotation", label: "Tire Rotation", group: "maintenance" },
  { value: "brakes", label: "Brakes", group: "maintenance" },
  { value: "battery", label: "Battery", group: "maintenance" },
  { value: "custom", label: "Custom", group: "maintenance" },
];

export function daysUntil(date: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDeadlineTriggerType(
  dueDate: string | null,
  targetMileage: number | null
): DeadlineTriggerType {
  if (dueDate && targetMileage !== null) return "both";
  if (targetMileage !== null) return "mileage";
  return "date";
}

export function getTriggerTypeLabel(type: DeadlineTriggerType): string {
  if (type === "date") return "Date";
  if (type === "mileage") return "Mileage";
  return "Date + Mileage";
}

function urgencyFromDays(daysRemaining: number | null): DeadlineUrgency | null {
  if (daysRemaining === null) return null;
  if (daysRemaining <= 0) return "overdue";
  if (daysRemaining <= 7) return "urgent";
  if (daysRemaining <= 30) return "approaching";
  return "normal";
}

function urgencyFromKm(remainingKm: number | null): DeadlineUrgency | null {
  if (remainingKm === null) return null;
  if (remainingKm <= 0) return "overdue";
  if (remainingKm <= 1000) return "urgent";
  if (remainingKm <= 3000) return "approaching";
  return "normal";
}

export function mostUrgent(
  a: DeadlineUrgency,
  b: DeadlineUrgency
): DeadlineUrgency {
  return URGENCY_RANK[a] <= URGENCY_RANK[b] ? a : b;
}

export function computeDeadlineUrgency(
  dueDate: string | null,
  targetMileage: number | null,
  currentMileage: number
): {
  urgency: DeadlineUrgency;
  daysRemaining: number | null;
  remainingKm: number | null;
} {
  const daysRemaining = dueDate ? daysUntil(dueDate) : null;
  const remainingKm =
    targetMileage !== null ? targetMileage - currentMileage : null;

  const dateUrgency = urgencyFromDays(daysRemaining);
  const kmUrgency = urgencyFromKm(remainingKm);

  if (dateUrgency && kmUrgency) {
    return {
      urgency: mostUrgent(dateUrgency, kmUrgency),
      daysRemaining,
      remainingKm,
    };
  }

  return {
    urgency: dateUrgency ?? kmUrgency ?? "normal",
    daysRemaining,
    remainingKm,
  };
}

export function getUrgencyLabel(urgency: DeadlineUrgency): string {
  if (urgency === "overdue") return "Critical";
  if (urgency === "urgent") return "Urgent";
  if (urgency === "approaching") return "Approaching";
  return "OK";
}

export function urgencyBadgeVariant(
  urgency: DeadlineUrgency
): "danger" | "warning" | "success" | "default" {
  if (urgency === "overdue") return "danger";
  if (urgency === "urgent") return "warning";
  if (urgency === "approaching") return "warning";
  return "success";
}

function docToDeadlineCategory(
  category: VehicleDocumentCategory
): VehicleDeadlineCategory | null {
  if (category === "insurance") return "insurance";
  if (category === "road_tax") return "road_tax";
  if (category === "vehicle_inspection") return "vehicle_inspection";
  return null;
}

export function isAdministrativeCategory(
  category: VehicleDeadlineCategory
): boolean {
  return ADMIN_CATEGORIES.includes(category);
}

export function maintenanceCategoryToDeadlineCategory(
  category: MaintenanceCategory
): VehicleDeadlineCategory {
  const map: Record<MaintenanceCategory, VehicleDeadlineCategory> = {
    scheduled_service: "scheduled_service",
    oil_change: "oil_change",
    automatic_transmission_service: "automatic_transmission_service",
    tire_replacement: "tire_replacement",
    tire_rotation: "tire_rotation",
    brakes: "brakes",
    battery: "battery",
    air_conditioning: "custom",
    mechanical_repair: "custom",
    bodywork: "custom",
    other: "custom",
  };
  return map[category];
}

const ADMIN_ONLY_CATEGORIES: VehicleDeadlineCategory[] = [
  "insurance",
  "road_tax",
  "vehicle_inspection",
  "ncc_license",
];

export function deadlineCategoryToMaintenanceCategory(
  category: VehicleDeadlineCategory
): MaintenanceCategory | null {
  if (ADMIN_ONLY_CATEGORIES.includes(category)) return null;
  if (category === "custom") return "other";
  return category as MaintenanceCategory;
}

export function canCompleteDeadlineAsMaintenance(
  deadline: ComputedDeadline
): boolean {
  return (
    !deadline.isAdministrative &&
    deadlineCategoryToMaintenanceCategory(deadline.category) !== null
  );
}

export function defaultRecurrenceForDeadline(
  deadline: ComputedDeadline
): { repeatEveryKm: number | null; repeatEveryMonths: number | null } {
  if (deadline.category === "tire_rotation") {
    return { repeatEveryKm: 10000, repeatEveryMonths: null };
  }
  if (deadline.category === "oil_change") {
    return { repeatEveryKm: 15000, repeatEveryMonths: null };
  }
  if (deadline.triggerType === "mileage" || deadline.triggerType === "both") {
    return { repeatEveryKm: 10000, repeatEveryMonths: null };
  }
  if (deadline.triggerType === "date") {
    return { repeatEveryKm: null, repeatEveryMonths: 12 };
  }
  return { repeatEveryKm: null, repeatEveryMonths: null };
}

export function createMaintenanceFormFromDeadline(
  deadline: ComputedDeadline,
  vehicleId: string,
  currentMileage: number
): MaintenanceFormData | null {
  const category = deadlineCategoryToMaintenanceCategory(deadline.category);
  if (!category) return null;

  const defaults = defaultRecurrenceForDeadline(deadline);

  return {
    vehicleId,
    category,
    description: `${deadline.label} completed`,
    workshop: "",
    completedDate: new Date().toISOString().split("T")[0],
    mileage: currentMileage,
    labourCost: "",
    totalCost: "",
    notes: deadline.notes,
    invoicePdfUrl: null,
    invoicePdfName: null,
    tireDetails: null,
    recurrence: {
      enabled:
        defaults.repeatEveryKm !== null || defaults.repeatEveryMonths !== null,
      repeatEveryKm: defaults.repeatEveryKm,
      repeatEveryMonths: defaults.repeatEveryMonths,
    },
    tireRotationReminder: {
      enabled: false,
      intervalKm: 10000,
    },
  };
}

function enrichDeadline(
  deadline: VehicleDeadline,
  vehicle: Vehicle,
  isAdministrative: boolean,
  isEditable: boolean
): ComputedDeadline {
  const { urgency, daysRemaining, remainingKm } = computeDeadlineUrgency(
    deadline.dueDate,
    deadline.targetMileage,
    vehicle.currentMileage
  );
  return {
    ...deadline,
    urgency,
    daysRemaining,
    remainingKm,
    currentMileage: vehicle.currentMileage,
    isAdministrative,
    triggerType: getDeadlineTriggerType(deadline.dueDate, deadline.targetMileage),
    isEditable,
  };
}

export function computeAdministrativeDeadlines(
  vehicle: Vehicle
): ComputedDeadline[] {
  const fromDocuments = vehicle.documents
    .filter(
      (doc) =>
        doc.expirationDate &&
        ADMIN_DOC_CATEGORIES.includes(doc.category)
    )
    .map((doc) => {
      const category = docToDeadlineCategory(doc.category)!;
      return enrichDeadline(
        {
          id: `doc-${doc.id}`,
          category,
          label: getDocumentCategoryLabel(doc.category),
          dueDate: doc.expirationDate,
          targetMileage: null,
          notes: "",
          sourceMaintenanceId: null,
          sourceDocumentId: doc.id,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        },
        vehicle,
        true,
        false
      );
    });

  const fromStored = vehicle.deadlines
    .filter((d) => isAdministrativeCategory(d.category))
    .map((d) => enrichDeadline(d, vehicle, true, true));

  return [...fromDocuments, ...fromStored];
}

export function computeMaintenanceDeadlines(
  vehicle: Vehicle
): ComputedDeadline[] {
  return vehicle.deadlines
    .filter((d) => !isAdministrativeCategory(d.category))
    .map((d) => enrichDeadline(d, vehicle, false, true));
}

export function computeAllDeadlines(vehicle: Vehicle): ComputedDeadline[] {
  return [
    ...computeAdministrativeDeadlines(vehicle),
    ...computeMaintenanceDeadlines(vehicle),
  ].sort((a, b) => {
    const rankDiff = URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency];
    if (rankDiff !== 0) return rankDiff;
    const aDays = a.daysRemaining ?? Infinity;
    const bDays = b.daysRemaining ?? Infinity;
    if (aDays !== bDays) return aDays - bDays;
    return (a.remainingKm ?? Infinity) - (b.remainingKm ?? Infinity);
  });
}

export function computeFleetDeadlines(vehicles: Vehicle[]): FleetDeadlineRow[] {
  return vehicles
    .flatMap((vehicle) =>
      computeAllDeadlines(vehicle).map((deadline) => ({
        ...deadline,
        vehicleId: vehicle.id,
        licensePlate: vehicle.licensePlate,
        vehicleBrand: vehicle.brand,
        vehicleModel: vehicle.model,
      }))
    )
    .sort((a, b) => {
      const rankDiff = URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency];
      if (rankDiff !== 0) return rankDiff;
      const aDays = a.daysRemaining ?? Infinity;
      const bDays = b.daysRemaining ?? Infinity;
      if (aDays !== bDays) return aDays - bDays;
      return (a.remainingKm ?? Infinity) - (b.remainingKm ?? Infinity);
    });
}

export function computeDeadlineKPIs(rows: FleetDeadlineRow[]): DeadlineKPIs {
  return {
    overdue: rows.filter((r) => r.urgency === "overdue").length,
    dueWithin7Days: rows.filter((r) => r.urgency === "urgent").length,
    dueWithin30Days: rows.filter((r) => r.urgency === "approaching").length,
    mileageAlerts: rows.filter(
      (r) => r.targetMileage !== null && r.urgency !== "normal"
    ).length,
  };
}

export function getNextDeadlineForVehicle(
  vehicle: Vehicle
): VehicleListItem["nextDeadline"] {
  const deadlines = computeAllDeadlines(vehicle).filter(
    (d) => d.urgency !== "normal"
  );

  const next =
    deadlines[0] ??
    computeAllDeadlines(vehicle).sort(
      (a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]
    )[0];

  if (!next) return null;

  return {
    label: next.label,
    urgency: next.urgency,
    dueDate: next.dueDate,
    targetMileage: next.targetMileage,
    daysRemaining: next.daysRemaining,
    remainingKm: next.remainingKm,
  };
}

function addMonths(dateStr: string, months: number): string {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split("T")[0];
}

export function formDataToDeadline(
  data: VehicleDeadlineFormData,
  id?: string
): VehicleDeadline {
  const now = new Date().toISOString();
  const targetMileage =
    typeof data.targetMileage === "number" ? data.targetMileage : null;

  let dueDate: string | null = null;
  let mileage: number | null = null;

  if (data.triggerType === "date" || data.triggerType === "both") {
    dueDate = data.dueDate;
  }
  if (data.triggerType === "mileage" || data.triggerType === "both") {
    mileage = targetMileage;
  }

  return {
    id: id ?? crypto.randomUUID(),
    category: data.category,
    label: DEADLINE_CATEGORY_LABELS[data.category],
    dueDate,
    targetMileage: mileage,
    notes: data.notes,
    sourceMaintenanceId: null,
    sourceDocumentId: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function deadlineToFormData(
  deadline: VehicleDeadline,
  vehicleId: string
): VehicleDeadlineFormData {
  return {
    vehicleId,
    category: deadline.category,
    triggerType: getDeadlineTriggerType(
      deadline.dueDate,
      deadline.targetMileage
    ),
    dueDate: deadline.dueDate,
    targetMileage: deadline.targetMileage ?? "",
    notes: deadline.notes,
  };
}

export function createEmptyDeadlineForm(
  vehicleId = ""
): VehicleDeadlineFormData {
  return {
    vehicleId,
    category: "oil_change",
    triggerType: "mileage",
    dueDate: null,
    targetMileage: "",
    notes: "",
  };
}

export function buildDeadlinesFromMaintenance(
  formData: MaintenanceFormData,
  recordId: string
): VehicleDeadline[] {
  const now = new Date().toISOString();
  const deadlines: VehicleDeadline[] = [];
  const mileage =
    typeof formData.mileage === "number" ? formData.mileage : 0;
  const deadlineCategory = maintenanceCategoryToDeadlineCategory(
    formData.category
  );
  const label =
    formData.category === "other" ||
    formData.category === "mechanical_repair" ||
    formData.category === "bodywork" ||
    formData.category === "air_conditioning"
      ? getCategoryLabel(formData.category)
      : DEADLINE_CATEGORY_LABELS[deadlineCategory];

  if (formData.recurrence.enabled) {
    const dueDate = formData.recurrence.repeatEveryMonths
      ? addMonths(formData.completedDate, formData.recurrence.repeatEveryMonths)
      : null;
    const targetMileage = formData.recurrence.repeatEveryKm
      ? mileage + formData.recurrence.repeatEveryKm
      : null;

    if (dueDate || targetMileage !== null) {
      deadlines.push({
        id: crypto.randomUUID(),
        category: deadlineCategory,
        label,
        dueDate,
        targetMileage,
        notes: "",
        sourceMaintenanceId: recordId,
        sourceDocumentId: null,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  if (
    formData.category === "tire_replacement" &&
    formData.tireRotationReminder.enabled &&
    formData.tireDetails
  ) {
    deadlines.push({
      id: crypto.randomUUID(),
      category: "tire_rotation",
      label: DEADLINE_CATEGORY_LABELS.tire_rotation,
      dueDate: null,
      targetMileage:
        formData.tireDetails.installationMileage +
        formData.tireRotationReminder.intervalKm,
      notes: "",
      sourceMaintenanceId: recordId,
      sourceDocumentId: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  return deadlines;
}

export function mergeVehicleDeadlines(
  existing: VehicleDeadline[],
  newDeadlines: VehicleDeadline[],
  completedCategory: VehicleDeadlineCategory
): VehicleDeadline[] {
  const filtered = existing.filter(
    (d) =>
      d.category !== completedCategory &&
      !newDeadlines.some((n) => n.sourceMaintenanceId === d.sourceMaintenanceId)
  );
  return [...newDeadlines, ...filtered];
}

export function maintenanceHistoryType(
  category: MaintenanceCategory
): VehicleHistoryEntry["type"] {
  if (category === "tire_replacement") return "tire_replacement";
  if (category === "tire_rotation") return "tire_rotation";
  if (category === "automatic_transmission_service")
    return "automatic_transmission_service";
  return "maintenance";
}

export function formatRemaining(deadline: ComputedDeadline): string {
  const parts: string[] = [];
  if (deadline.daysRemaining !== null) {
    parts.push(
      deadline.daysRemaining <= 0
        ? "Date overdue"
        : `${deadline.daysRemaining} days`
    );
  }
  if (deadline.remainingKm !== null) {
    parts.push(
      deadline.remainingKm <= 0
        ? "Mileage reached"
        : `${deadline.remainingKm.toLocaleString("it-IT")} km`
    );
  }
  return parts.length > 0 ? parts.join(" / ") : "—";
}
