import type { MaintenanceKPIs } from "@/lib/types";
import { formatCurrency } from "@/lib/maintenance/utils";
import { StatCard } from "@/components/dashboard/stat-card";

interface MaintenanceKpiCardsProps {
  kpis: MaintenanceKPIs;
}

export function MaintenanceKpiCards({ kpis }: MaintenanceKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Vehicles requiring attention"
        value={String(kpis.vehiclesRequiringAttention)}
        subtext="Overdue or urgent deadlines"
        accent="warning"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        }
      />
      <StatCard
        label="Upcoming maintenance"
        value={String(kpis.upcomingMaintenance)}
        subtext="Approaching or urgent"
        accent="default"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        }
      />
      <StatCard
        label="Overdue deadlines"
        value={String(kpis.overdueDeadlines)}
        subtext="Requires immediate action"
        accent="danger"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        }
      />
      <StatCard
        label="Monthly maintenance costs"
        value={formatCurrency(kpis.monthlyMaintenanceCosts)}
        subtext="Completed this month"
        accent="default"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25m2.25 0v.75c0 .621-.504 1.125-1.125 1.125H21m-2.25 0h.008v.008H18.75v-.008Zm0 3.75h.008v.008H18.75V8.25Zm-3.75 0h.008v.008H15V8.25Zm-3.75 0h.008v.008H11.25V8.25Zm-3.75 0h.008v.008H7.5V8.25Zm-3.75 0h.008v.008H3.75V8.25Z" />
          </svg>
        }
      />
    </div>
  );
}
