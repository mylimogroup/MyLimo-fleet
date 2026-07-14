import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: ReactNode;
  accent?: "default" | "success" | "warning" | "danger";
}

const accentStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-500/10 text-amber-600",
  danger: "bg-red-500/10 text-red-600",
};

export function StatCard({ label, value, subtext, icon, accent = "default" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
          {subtext && (
            <p className="mt-1 text-xs text-muted">{subtext}</p>
          )}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accentStyles[accent]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
