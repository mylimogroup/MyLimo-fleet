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


export function getDeadlineUrgency(
  daysRemaining: number
): "normal" | "warning" | "danger" {
  if (daysRemaining <= 7) return "danger";
  if (daysRemaining <= 30) return "warning";
  return "normal";
}

export function daysUntil(date: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
