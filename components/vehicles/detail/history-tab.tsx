"use client";

import type { Vehicle } from "@/lib/types";
import { formatRelativeTime } from "@/lib/fleet-data";
import { EmptyState } from "@/components/ui/empty-state";

interface HistoryTabProps {
  vehicle: Vehicle;
}

const typeLabels: Record<string, string> = {
  mileage_update: "Mileage Update",
  vehicle_created: "Vehicle Created",
  vehicle_updated: "Vehicle Updated",
  document_added: "Document Added",
  document_updated: "Document Updated",
  document_deleted: "Document Deleted",
  cost_added: "Cost Added",
  maintenance: "Maintenance",
  insurance_renewal: "Insurance Renewal",
  road_tax_payment: "Road Tax Payment",
  inspection: "Inspection",
  tire_replacement: "Tire Replacement",
  tire_rotation: "Tire Rotation",
  automatic_transmission_service: "Automatic Transmission Service",
  vehicle_purchase: "Vehicle Purchase",
};

export function HistoryTab({ vehicle }: HistoryTabProps) {
  if (vehicle.history.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
        title="No history yet"
        description="Vehicle changes and mileage updates will be logged here"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <ul className="divide-y divide-border">
        {vehicle.history.map((entry) => (
          <li
            key={entry.id}
            className="flex items-start justify-between gap-4 px-5 py-4"
          >
            <div>
              <p className="text-sm font-medium">{entry.description}</p>
              <p className="mt-0.5 text-xs text-muted">
                {typeLabels[entry.type] ?? entry.type}
              </p>
            </div>
            <time className="shrink-0 text-xs text-muted">
              {formatRelativeTime(entry.timestamp)}
            </time>
          </li>
        ))}
      </ul>
    </div>
  );
}
