"use client";

import { useMemo } from "react";
import type { ActivityType } from "@/lib/types";
import { fleetStats, formatCurrency } from "@/lib/fleet-data";
import {
  getLiveRecentActivity,
  getLiveUpcomingDeadlines,
  getLiveUpcomingDeadlinesCount,
} from "@/lib/fleet-live-data";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatCard } from "@/components/dashboard/stat-card";

const activityIcons: Record<ActivityType, React.ReactNode> = {
  mileage_update: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  maintenance: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  ),
  vehicle_added: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  deadline: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  assignment: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  ),
};

const activityColors: Record<ActivityType, string> = {
  mileage_update: "bg-blue-500/10 text-blue-600",
  maintenance: "bg-amber-500/10 text-amber-600",
  vehicle_added: "bg-emerald-500/10 text-emerald-600",
  deadline: "bg-red-500/10 text-red-600",
  assignment: "bg-violet-500/10 text-violet-600",
};

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

function urgencyBadgeClass(urgency: string): string {
  if (urgency === "overdue") return "bg-red-500/10 text-red-600";
  if (urgency === "urgent") return "bg-red-500/10 text-red-600";
  return "bg-amber-500/10 text-amber-600";
}

function urgencyLabel(urgency: string, daysRemaining: number | null, remainingKm: number | null): string {
  if (urgency === "overdue") return "Critical";
  if (daysRemaining !== null && daysRemaining <= 7) return `${daysRemaining}d`;
  if (remainingKm !== null && remainingKm <= 1000) return `${remainingKm.toLocaleString("it-IT")} km`;
  if (daysRemaining !== null) return `${daysRemaining}d`;
  if (remainingKm !== null) return `${remainingKm.toLocaleString("it-IT")} km`;
  return urgency;
}

export function DashboardPageContent() {
  const { monthlyCosts } = fleetStats;
  const activity = useMemo(() => getLiveRecentActivity(), []);
  const upcomingCount = useMemo(() => getLiveUpcomingDeadlinesCount(), []);
  const upcomingDeadlines = useMemo(() => getLiveUpcomingDeadlines(), []);

  const displayActivity = useMemo(
    () => activity.slice(0, 6),
    [activity]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Fleet vehicles"
          value={String(fleetStats.totalVehicles)}
          subtext={`${fleetStats.inUse} currently assigned`}
          accent="default"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a49.902 49.902 0 0 0-.244-3.716 3.05 3.05 0 0 0-2.12-2.136 47.664 47.664 0 0 0-8.838 0 3.05 3.05 0 0 0-2.12 2.136 49.903 49.903 0 0 0-.244 3.716c-.039.62.469 1.124 1.09 1.124H21M8.25 6.75h7.5M8.25 6.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m0 0V4.875C5.25 3.84 6.09 3 7.125 3H8.25m7.5 3.75h1.125c1.035 0 1.875.84 1.875 1.875V6.75m-9 0V4.875c0-1.036.84-1.875 1.875-1.875" />
            </svg>
          }
        />
        <StatCard
          label="Vehicles available"
          value={String(fleetStats.available)}
          subtext="Ready for dispatch"
          accent="success"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
        <StatCard
          label="Vehicles in maintenance"
          value={String(fleetStats.inMaintenance)}
          subtext="Out of service"
          accent="warning"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
          }
        />
        <StatCard
          label="Upcoming deadlines"
          value={String(upcomingCount)}
          subtext="Non-OK priority"
          accent="danger"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
        <StatCard
          label="Monthly costs"
          value={formatCurrency(monthlyCosts.total)}
          subtext={`Fuel ${formatCurrency(monthlyCosts.fuel)} · Maint. ${formatCurrency(monthlyCosts.maintenance)}`}
          accent="default"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25m2.25 0v.75c0 .621-.504 1.125-1.125 1.125H21m-2.25 0h.008v.008H18.75v-.008Zm0 3.75h.008v.008H18.75V8.25Zm-3.75 0h.008v.008H15V8.25Zm-3.75 0h.008v.008H11.25V8.25Zm-3.75 0h.008v.008H7.5V8.25Zm-3.75 0h.008v.008H3.75V8.25Z" />
            </svg>
          }
        />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold">Recent activity</h2>
            </div>
            <ul className="divide-y divide-border">
              {displayActivity.map((item) => (
                <li key={item.id} className="flex items-start gap-4 px-5 py-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activityColors[item.type]}`}
                  >
                    {activityIcons[item.type]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.description}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
                      {item.vehiclePlate && (
                        <span className="font-mono">{item.vehiclePlate}</span>
                      )}
                      {item.vehiclePlate && <span>·</span>}
                      <span>{formatRelativeTime(item.timestamp)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold">Upcoming deadlines</h2>
            </div>
            <ul className="divide-y divide-border">
              {upcomingDeadlines.map((deadline) => (
                <li key={deadline.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{deadline.label}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted">
                        {deadline.licensePlate}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${urgencyBadgeClass(deadline.urgency)}`}
                    >
                      {urgencyLabel(
                        deadline.urgency,
                        deadline.daysRemaining,
                        deadline.remainingKm
                      )}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">
                    {deadline.dueDate
                      ? `Due ${new Date(deadline.dueDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}`
                      : deadline.targetMileage !== null
                        ? `Target ${deadline.targetMileage.toLocaleString("it-IT")} km`
                        : "—"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
