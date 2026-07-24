"use client";

import { useEffect, useState } from "react";
import type { MaintenanceRecord, Vehicle } from "@/lib/types";
import { getMaintenanceRepository } from "@/lib/maintenance/service";
import { formatCurrency, formatDate } from "@/lib/vehicles/utils";
import { EmptyState } from "@/components/ui/empty-state";

interface CostsTabProps {
  vehicle: Vehicle;
}

export function CostsTab({ vehicle }: CostsTabProps) {
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);

  useEffect(() => {
    getMaintenanceRepository()
      .listByVehicle(vehicle.id)
      .then(setMaintenanceRecords);
  }, [vehicle.id]);

  const maintenanceCosts = maintenanceRecords
    .filter((r) => r.totalCost > 0)
    .map((r) => ({
      id: r.id,
      date: r.completedDate,
      description: r.description,
      supplier: r.workshop,
      cost: r.totalCost,
      source: "Maintenance" as const,
    }));

  const vehicleCosts = vehicle.costs.map((c) => ({
    ...c,
    source: "Vehicle" as const,
  }));

  const allCosts = [...vehicleCosts, ...maintenanceCosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const total = allCosts.reduce((sum, c) => sum + c.cost, 0);

  if (allCosts.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25m2.25 0v.75c0 .621-.504 1.125-1.125 1.125H21m-2.25 0h.008v.008H18.75v-.008Zm0 3.75h.008v.008H18.75V8.25Zm-3.75 0h.008v.008H15V8.25Zm-3.75 0h.008v.008H11.25V8.25Zm-3.75 0h.008v.008H7.5V8.25Zm-3.75 0h.008v.008H3.75V8.25Z" />
          </svg>
        }
        title="No cost records"
        description="Costs from maintenance and vehicle entries will appear here"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
        <p className="text-sm text-muted">Total recorded costs</p>
        <p className="mt-1 text-2xl font-bold">{formatCurrency(total)}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50">
              {["Date", "Description", "Supplier", "Source", "Cost"].map(
                (col) => (
                  <th
                    key={col}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted ${
                      col === "Cost" ? "text-right" : "text-left"
                    }`}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allCosts.map((entry) => (
              <tr key={entry.id} className="hover:bg-background/40">
                <td className="px-4 py-3">{formatDate(entry.date)}</td>
                <td className="px-4 py-3">{entry.description}</td>
                <td className="px-4 py-3">{entry.supplier}</td>
                <td className="px-4 py-3 text-muted">{entry.source}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">
                  {formatCurrency(entry.cost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
