"use client";

import type { Vehicle } from "@/lib/types";
import { formatCurrency, formatDate, formatMileage } from "@/lib/vehicles/utils";

interface OverviewTabProps {
  vehicle: Vehicle;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium text-right">{value}</dd>
    </div>
  );
}

export function OverviewTab({ vehicle }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Identification
        </h3>
        <dl className="mt-4 divide-y divide-border">
          <InfoRow
            label="Brand + Model + Version"
            value={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`.trim()}
          />
          <InfoRow label="License Plate" value={vehicle.licensePlate} />
          <InfoRow
            label="Current Mileage"
            value={formatMileage(vehicle.currentMileage)}
          />
          <InfoRow
            label="Last Mileage Update"
            value={
              vehicle.lastMileageUpdateDate
                ? formatDate(vehicle.lastMileageUpdateDate)
                : "—"
            }
          />
          <InfoRow
            label="First Registration"
            value={
              vehicle.firstRegistrationDate
                ? formatDate(vehicle.firstRegistrationDate)
                : "—"
            }
          />
          <InfoRow label="Year" value={String(vehicle.year)} />
          <InfoRow label="VIN" value={vehicle.vin || "—"} />
        </dl>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Acquisition
        </h3>
        <dl className="mt-4 divide-y divide-border">
          <InfoRow
            label="Purchase Date"
            value={
              vehicle.purchaseDate ? formatDate(vehicle.purchaseDate) : "—"
            }
          />
          <InfoRow
            label="Purchase Price"
            value={
              vehicle.purchasePrice
                ? formatCurrency(vehicle.purchasePrice)
                : "—"
            }
          />
        </dl>
        {vehicle.notes && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-medium text-muted">Notes</p>
            <p className="mt-2 text-sm">{vehicle.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
