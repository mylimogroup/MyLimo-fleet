import type { VehicleCostKPIs } from "@/lib/types";
import {
  formatCostAmount,
  formatCostPerKm,
} from "@/lib/vehicles/costs";
import { StatCard } from "@/components/dashboard/stat-card";

interface CostKpiCardsProps {
  kpis: VehicleCostKPIs;
}

export function CostKpiCards({ kpis }: CostKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        label="Total costs"
        value={formatCostAmount(kpis.totalYear)}
        subtext="Current year"
        accent="default"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25m2.25 0v.75c0 .621-.504 1.125-1.125 1.125H21m-2.25 0h.008v.008H18.75v-.008Zm0 3.75h.008v.008H18.75V8.25Zm-3.75 0h.008v.008H15V8.25Zm-3.75 0h.008v.008H11.25V8.25Zm-3.75 0h.008v.008H7.5V8.25Zm-3.75 0h.008v.008H3.75V8.25Z" />
          </svg>
        }
      />
      <StatCard
        label="Total costs"
        value={formatCostAmount(kpis.totalMonth)}
        subtext="Current month"
        accent="default"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        }
      />
      <StatCard
        label="Maintenance & Repairs"
        value={formatCostAmount(kpis.maintenanceRepairsYear)}
        subtext="Current year"
        accent="warning"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
        }
      />
      <StatCard
        label="Fuel"
        value={formatCostAmount(kpis.fuelYear)}
        subtext="Current year"
        accent="default"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 8.21 8.21 0 0 0-2.922-2.922A3.75 3.75 0 0 0 12 18Z" />
          </svg>
        }
      />
      <StatCard
        label="Cost per km"
        value={formatCostPerKm(kpis.costPerKm)}
        subtext="Current year"
        accent="default"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        }
      />
    </div>
  );
}
