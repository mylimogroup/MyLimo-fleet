import type {
  ComputedDeadline,
  DeadlineUrgency,
  MaintenanceCategory,
  MaintenanceFormData,
  Vehicle,
  VehicleDeadline,
  VehicleDeadlineCategory,
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

const URGENCY_RANK: Record<DeadlineUrgency, number> = {
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
    scheduled_service: "Scheduled Service",
    oil_change: "Oil Change",
    automatic_transmission_service: "Automatic Transmission Service",
    tire_rotation: "Tire Rotation",
    tire_replacement: "Tire Replacement",
    brakes: "Brakes",
    battery: "Battery",
    custom: "Custom Maintenance",
  };

export function daysUntil(date: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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

function docToDeadlineCategory(
  category: VehicleDocumentCategory
): VehicleDeadlineCategory | null {
  if (category === "insurance") return "insurance";
  if (category === "road_tax") return "road_tax";
  if (category === "vehicle_inspection") return "vehicle_inspection";
  return null;
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

export function computeAdministrativeDeadlines(
  vehicle: Vehicle
): ComputedDeadline[] {
  return vehicle.documents
    .filter(
      (doc) =>
        doc.expirationDate &&
        ADMIN_DOC_CATEGORIES.includes(doc.category)
    )
    .map((doc) => {
      const category = docToDeadlineCategory(doc.category)!;
      const { urgency, daysRemaining, remainingKm } = computeDeadlineUrgency(
        doc.expirationDate,
        null,
        vehicle.currentMileage
      );
      return {
        id: `doc-${doc.id}`,
        category,
        label: getDocumentCategoryLabel(doc.category),
        dueDate: doc.expirationDate,
        targetMileage: null,
        sourceMaintenanceId: null,
        sourceDocumentId: doc.id,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        urgency,
        daysRemaining,
        remainingKm,
        currentMileage: vehicle.currentMileage,
        isAdministrative: true,
      };
    });
}

export function computeMaintenanceDeadlines(
  vehicle: Vehicle
): ComputedDeadline[] {
  return vehicle.deadlines.map((deadline) => {
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
      isAdministrative: false,
    };
  });
}

export function computeAllDeadlines(vehicle: Vehicle): ComputedDeadline[] {
  return [
    ...computeAdministrativeDeadlines(vehicle),
    ...computeMaintenanceDeadlines(vehicle),
  ].sort((a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]);
}

export function getNextDeadlineForVehicle(
  vehicle: Vehicle
): VehicleListItem["nextDeadline"] {
  const deadlines = computeAllDeadlines(vehicle).filter(
    (d) => d.urgency !== "normal"
  );

  if (deadlines.length === 0) {
    const all = computeAllDeadlines(vehicle);
    if (all.length === 0) return null;
    const next = all.sort((a, b) => {
      const rankDiff = URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency];
      if (rankDiff !== 0) return rankDiff;
      const aDays = a.daysRemaining ?? Infinity;
      const bDays = b.daysRemaining ?? Infinity;
      if (aDays !== bDays) return aDays - bDays;
      return (a.remainingKm ?? Infinity) - (b.remainingKm ?? Infinity);
    })[0];
    return {
      label: next.label,
      urgency: next.urgency,
      dueDate: next.dueDate,
      targetMileage: next.targetMileage,
      daysRemaining: next.daysRemaining,
      remainingKm: next.remainingKm,
    };
  }

  const next = deadlines[0];
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

export function urgencyBadgeVariant(
  urgency: DeadlineUrgency
): "danger" | "warning" | "default" {
  if (urgency === "overdue" || urgency === "urgent") return "danger";
  if (urgency === "approaching") return "warning";
  return "default";
}
