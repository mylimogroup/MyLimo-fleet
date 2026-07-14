import type { VehicleStatus } from "@/lib/types";

export function formatMileage(km: number): string {
  return new Intl.NumberFormat("it-IT").format(km) + " km";
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const statusLabels: Record<VehicleStatus, string> = {
  available: "Available",
  in_use: "In Use",
  maintenance: "Maintenance",
};

export function getStatusLabel(status: VehicleStatus): string {
  return statusLabels[status];
}

export function getDeadlineUrgency(
  daysRemaining: number
): "normal" | "warning" | "danger" {
  if (daysRemaining <= 7) return "danger";
  if (daysRemaining <= 30) return "warning";
  return "normal";
}
