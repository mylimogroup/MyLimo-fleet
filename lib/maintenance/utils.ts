import type {
  MaintenanceCategory,
  MaintenanceStatus,
} from "@/lib/types";
import { MAINTENANCE_CATEGORIES } from "@/lib/maintenance/constants";

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

export function formatMileage(km: number): string {
  return new Intl.NumberFormat("it-IT").format(km) + " km";
}

export function daysUntil(date: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const categoryLabels = Object.fromEntries(
  MAINTENANCE_CATEGORIES.map((c) => [c.value, c.label])
) as Record<MaintenanceCategory, string>;

export function getCategoryLabel(category: MaintenanceCategory): string {
  return categoryLabels[category] ?? category;
}

const statusLabels: Record<MaintenanceStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export function getStatusLabel(status: MaintenanceStatus): string {
  return statusLabels[status];
}

export function isWithinDays(date: string, days: number): boolean {
  const remaining = daysUntil(date);
  return remaining >= 0 && remaining <= days;
}

export function isCurrentMonth(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}
