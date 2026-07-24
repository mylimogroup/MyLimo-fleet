import type {
  ItalianVatRate,
  Vehicle,
  VehicleCostCategory,
  VehicleCostEntry,
  VehicleCostFormData,
  VehicleCostKPIs,
  VehicleHistoryEntry,
} from "@/lib/types";
import {
  DEFAULT_VAT_RATE,
  FUEL_CATEGORIES,
  MAINTENANCE_REPAIR_CATEGORIES,
  VEHICLE_COST_CATEGORIES,
} from "@/lib/vehicles/cost-constants";
import {
  calculateCostFromNetAndRate,
  isAllowedVatRate,
  parseItalianVatRate,
  parseMoneyField,
  resolveVatRateFromAmounts,
  sumMoneyAmounts,
} from "@/lib/vehicles/money";

interface MileagePoint {
  date: string;
  mileage: number;
}

function isInYear(dateStr: string, year: number): boolean {
  return new Date(dateStr).getFullYear() === year;
}

function isInMonth(dateStr: string, year: number, month: number): boolean {
  const d = new Date(dateStr);
  return d.getFullYear() === year && d.getMonth() === month;
}

function parseMileageFromHistory(entry: VehicleHistoryEntry): number | null {
  if (entry.type !== "mileage_update") return null;
  const match = entry.description.match(/([\d.,]+)\s*km/i);
  if (!match) return null;
  const normalized = match[1].replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function collectMileagePoints(vehicle: Vehicle): MileagePoint[] {
  const points: MileagePoint[] = [];

  for (const entry of vehicle.history) {
    const mileage = parseMileageFromHistory(entry);
    if (mileage !== null) {
      points.push({ date: entry.timestamp.split("T")[0], mileage });
    }
  }

  for (const cost of vehicle.costs) {
    if (cost.mileage !== null) {
      points.push({ date: cost.date, mileage: cost.mileage });
    }
  }

  if (vehicle.lastMileageUpdateDate && vehicle.currentMileage > 0) {
    points.push({
      date: vehicle.lastMileageUpdateDate,
      mileage: vehicle.currentMileage,
    });
  }

  const byDate = new Map<string, number>();
  for (const point of points) {
    byDate.set(point.date, point.mileage);
  }

  return [...byDate.entries()]
    .map(([date, mileage]) => ({ date, mileage }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function computeYearKmDriven(
  vehicle: Vehicle,
  referenceDate = new Date()
): number | null {
  const year = referenceDate.getFullYear();
  const yearStart = `${year}-01-01`;
  const today = referenceDate.toISOString().split("T")[0];
  const points = collectMileagePoints(vehicle);

  if (points.length < 2) return null;

  const startCandidates = points.filter((p) => p.date <= yearStart);
  const startPoint =
    startCandidates.length > 0
      ? startCandidates[startCandidates.length - 1]
      : points.find((p) => isInYear(p.date, year));

  const inYearPoints = points.filter(
    (p) => p.date >= yearStart && p.date <= today
  );
  const endPoint =
    inYearPoints.length > 0
      ? inYearPoints[inYearPoints.length - 1]
      : points[points.length - 1];

  if (!startPoint || !endPoint) return null;

  const kmDriven = endPoint.mileage - startPoint.mileage;
  if (kmDriven <= 0) return null;

  return kmDriven;
}

export function computeVehicleCostKPIs(
  vehicle: Vehicle,
  referenceDate = new Date()
): VehicleCostKPIs {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const yearCosts = vehicle.costs.filter((c) => isInYear(c.date, year));
  const monthCosts = vehicle.costs.filter((c) =>
    isInMonth(c.date, year, month)
  );

  const totalYear = sumMoneyAmounts(...yearCosts.map((c) => c.totalAmount));
  const totalMonth = sumMoneyAmounts(...monthCosts.map((c) => c.totalAmount));
  const maintenanceRepairsYear = sumMoneyAmounts(
    ...yearCosts
      .filter((c) => MAINTENANCE_REPAIR_CATEGORIES.includes(c.category))
      .map((c) => c.totalAmount)
  );
  const fuelYear = sumMoneyAmounts(
    ...yearCosts
      .filter((c) => FUEL_CATEGORIES.includes(c.category))
      .map((c) => c.totalAmount)
  );

  const kmDriven = computeYearKmDriven(vehicle, referenceDate);
  const costPerKm =
    kmDriven !== null && kmDriven > 0 ? totalYear / kmDriven : null;

  return {
    totalYear,
    totalMonth,
    maintenanceRepairsYear,
    fuelYear,
    costPerKm,
  };
}

export function getCostCategoryLabel(category: VehicleCostCategory): string {
  return (
    VEHICLE_COST_CATEGORIES.find((c) => c.value === category)?.label ?? category
  );
}

export function resolveStoredVatRate(entry: VehicleCostEntry): ItalianVatRate {
  if (entry.vatRate != null && isAllowedVatRate(entry.vatRate)) {
    return entry.vatRate;
  }
  return resolveVatRateFromAmounts(entry.netAmount, entry.vatAmount);
}

export function computeCostAmountsFromForm(data: {
  netAmount: number | "";
  vatRate: ItalianVatRate;
}): { vatAmount: number | null; totalAmount: number | null } {
  const net = parseMoneyField(data.netAmount);
  if (net === null) return { vatAmount: null, totalAmount: null };
  const rate = parseItalianVatRate(data.vatRate);
  const { vatAmount, totalAmount } = calculateCostFromNetAndRate(net, rate);
  return { vatAmount, totalAmount };
}

export function normalizeCostFormData(
  data: VehicleCostFormData
): VehicleCostFormData & { vatAmount: number; totalAmount: number } {
  const netAmount = parseMoneyField(data.netAmount);
  const vatRate = parseItalianVatRate(data.vatRate);

  if (netAmount === null) {
    return {
      ...data,
      netAmount: "",
      vatRate,
      vatAmount: 0,
      totalAmount: 0,
    };
  }

  const { vatAmount, totalAmount } = calculateCostFromNetAndRate(
    netAmount,
    vatRate
  );

  return {
    ...data,
    netAmount,
    vatRate,
    vatAmount,
    totalAmount,
  };
}

export function formDataToCostEntry(
  data: VehicleCostFormData,
  id?: string,
  existing?: VehicleCostEntry
): VehicleCostEntry {
  const now = new Date().toISOString();
  const normalized = normalizeCostFormData(data);
  const netAmount =
    typeof normalized.netAmount === "number" ? normalized.netAmount : null;
  const vatAmount = normalized.vatAmount;
  const vatRate = normalized.vatRate;
  const totalAmount = normalized.totalAmount;
  const mileage = typeof data.mileage === "number" ? data.mileage : null;

  return {
    id: id ?? crypto.randomUUID(),
    date: data.date,
    category: data.category,
    description: data.description,
    supplier: data.supplier,
    netAmount,
    vatAmount,
    vatRate,
    totalAmount,
    mileage,
    notes: data.notes,
    invoicePdfUrl: data.invoicePdfUrl,
    invoicePdfName: data.invoicePdfName,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export function addCostToList(
  costs: VehicleCostEntry[],
  data: VehicleCostFormData
): VehicleCostEntry[] {
  return [formDataToCostEntry(data), ...costs];
}

export function updateCostInList(
  costs: VehicleCostEntry[],
  costId: string,
  data: VehicleCostFormData
): VehicleCostEntry[] {
  const existing = costs.find((cost) => cost.id === costId);
  if (!existing) {
    throw new Error(`Cost ${costId} not found`);
  }

  const updated = formDataToCostEntry(data, costId, existing);
  return costs.map((cost) => (cost.id === costId ? updated : cost));
}

export function deleteCostFromList(
  costs: VehicleCostEntry[],
  costId: string
): VehicleCostEntry[] {
  if (!costs.some((cost) => cost.id === costId)) {
    throw new Error(`Cost ${costId} not found`);
  }

  return costs.filter((cost) => cost.id !== costId);
}

export function computeYearCostTotal(
  costs: VehicleCostEntry[],
  year: number
): number {
  const yearCosts = costs.filter(
    (cost) => new Date(cost.date).getFullYear() === year
  );
  return sumMoneyAmounts(...yearCosts.map((cost) => cost.totalAmount));
}

export function costEntryToFormData(
  entry: VehicleCostEntry,
  vehicleId: string
): VehicleCostFormData {
  return {
    vehicleId,
    date: entry.date,
    category: entry.category,
    description: entry.description,
    supplier: entry.supplier,
    netAmount: entry.netAmount ?? "",
    vatRate: resolveStoredVatRate(entry),
    mileage: entry.mileage ?? "",
    notes: entry.notes,
    invoicePdfUrl: entry.invoicePdfUrl,
    invoicePdfName: entry.invoicePdfName,
  };
}

export function createEmptyCostForm(vehicleId = ""): VehicleCostFormData {
  return {
    vehicleId,
    date: new Date().toISOString().split("T")[0],
    category: "maintenance",
    description: "",
    supplier: "",
    netAmount: "",
    vatRate: DEFAULT_VAT_RATE,
    mileage: "",
    notes: "",
    invoicePdfUrl: null,
    invoicePdfName: null,
  };
}

export function sortCostsNewestFirst(costs: VehicleCostEntry[]): VehicleCostEntry[] {
  return [...costs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function formatCostAmount(amount: number | null): string {
  if (amount === null) return "—";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCostPerKm(amount: number | null): string {
  if (amount === null) return "—";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + "/km";
}
