import type { Activity, Deadline, FleetStats } from "./types";

export const fleetStats: FleetStats = {
  totalVehicles: 12,
  available: 8,
  inMaintenance: 2,
  inUse: 2,
  upcomingDeadlines: 4,
  monthlyCosts: {
    total: 18420,
    fuel: 6240,
    maintenance: 3850,
    insurance: 7200,
    other: 1130,
  },
};

export const upcomingDeadlines: Deadline[] = [
  {
    id: "dl-1",
    vehiclePlate: "MI-LM 401",
    type: "Insurance renewal",
    dueDate: "2026-07-18",
    daysRemaining: 4,
  },
  {
    id: "dl-2",
    vehiclePlate: "MI-LM 207",
    type: "Scheduled service",
    dueDate: "2026-07-22",
    daysRemaining: 8,
  },
  {
    id: "dl-3",
    vehiclePlate: "MI-LM 115",
    type: "MOT inspection",
    dueDate: "2026-07-28",
    daysRemaining: 14,
  },
  {
    id: "dl-4",
    vehiclePlate: "MI-LM 309",
    type: "Tire replacement",
    dueDate: "2026-08-02",
    daysRemaining: 19,
  },
];

export const recentActivity: Activity[] = [
  {
    id: "act-1",
    type: "mileage_update",
    description: "Mileage updated to 48,320 km",
    vehiclePlate: "MI-LM 401",
    timestamp: "2026-07-14T08:42:00",
  },
  {
    id: "act-2",
    type: "maintenance",
    description: "Brake pad replacement completed",
    vehiclePlate: "MI-LM 118",
    timestamp: "2026-07-13T16:15:00",
  },
  {
    id: "act-3",
    type: "assignment",
    description: "Assigned to airport transfer — Malpensa T1",
    vehiclePlate: "MI-LM 205",
    timestamp: "2026-07-13T06:30:00",
  },
  {
    id: "act-4",
    type: "maintenance",
    description: "Entered workshop — transmission check",
    vehiclePlate: "MI-LM 207",
    timestamp: "2026-07-12T11:00:00",
  },
  {
    id: "act-5",
    type: "vehicle_added",
    description: "Mercedes-Benz V-Class added to fleet",
    vehiclePlate: "MI-LM 412",
    timestamp: "2026-07-11T14:20:00",
  },
  {
    id: "act-6",
    type: "deadline",
    description: "Insurance renewal reminder sent",
    vehiclePlate: "MI-LM 309",
    timestamp: "2026-07-10T09:00:00",
  },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date("2026-07-14T12:00:00");
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}
