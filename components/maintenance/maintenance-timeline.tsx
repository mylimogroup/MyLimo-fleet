"use client";

import type { MaintenanceRecord } from "@/lib/types";
import {
  formatCurrency,
  formatDate,
  formatMileage,
  getCategoryLabel,
} from "@/lib/maintenance/utils";
import { Timeline } from "@/components/ui/timeline";

interface MaintenanceTimelineProps {
  records: MaintenanceRecord[];
  showUpcoming?: boolean;
}

export function MaintenanceTimeline({ records }: MaintenanceTimelineProps) {
  const items = records.map((record) => ({
    id: record.id,
    date: formatDate(record.completedDate),
    title: getCategoryLabel(record.category),
    subtitle: record.workshop,
    children: (
      <div className="space-y-4">
        <p className="text-sm">{record.description}</p>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted">Mileage</dt>
            <dd className="font-medium">{formatMileage(record.mileage)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Labor</dt>
            <dd className="font-medium">
              {record.labourCost > 0
                ? formatCurrency(record.labourCost)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Total</dt>
            <dd className="font-semibold">{formatCurrency(record.totalCost)}</dd>
          </div>
          {record.tireDetails && (
            <>
              <div>
                <dt className="text-xs text-muted">Tire Type</dt>
                <dd className="font-medium capitalize">
                  {record.tireDetails.tireType.replace("_", " ")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Tire Brand</dt>
                <dd className="font-medium">{record.tireDetails.brand}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Size</dt>
                <dd className="font-medium">{record.tireDetails.size}</dd>
              </div>
            </>
          )}
          {record.recurrence?.enabled && (
            <div className="sm:col-span-3">
              <dt className="text-xs text-muted">Next Service</dt>
              <dd className="font-medium">
                {[
                  record.recurrence.repeatEveryKm
                    ? `+${record.recurrence.repeatEveryKm.toLocaleString("it-IT")} km`
                    : null,
                  record.recurrence.repeatEveryMonths
                    ? `+${record.recurrence.repeatEveryMonths} months`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </dd>
            </div>
          )}
        </dl>

        {record.notes && (
          <p className="rounded-lg bg-background px-3 py-2 text-sm text-muted">
            {record.notes}
          </p>
        )}

        {record.invoicePdfUrl && (
          <a
            href={record.invoicePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            {record.invoicePdfName ?? "View Invoice PDF"}
          </a>
        )}
      </div>
    ),
  }));

  return <Timeline items={items} />;
}
