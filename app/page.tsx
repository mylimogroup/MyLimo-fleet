import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { fleetStats, formatCurrency } from "@/lib/fleet-data";

export default function DashboardPage() {
  const { monthlyCosts } = fleetStats;

  return (
    <DashboardShell>
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
            value={String(fleetStats.upcomingDeadlines)}
            subtext="Next 30 days"
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
        <RecentActivity />
      </div>
    </DashboardShell>
  );
}
