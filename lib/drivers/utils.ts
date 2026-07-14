import type { DriverStatus } from "@/lib/types";

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysUntil(date: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getExpirationUrgency(
  daysRemaining: number
): "normal" | "warning" | "danger" {
  if (daysRemaining <= 7) return "danger";
  if (daysRemaining <= 30) return "warning";
  return "normal";
}

const statusLabels: Record<DriverStatus, string> = {
  active: "Active",
  on_duty: "On Duty",
  on_leave: "On Leave",
  inactive: "Inactive",
};

export function getDriverStatusLabel(status: DriverStatus): string {
  return statusLabels[status];
}

export function formatPhone(phone: string): string {
  return phone;
}

export function formatLanguages(languages: string[]): string {
  return languages.join(", ");
}
