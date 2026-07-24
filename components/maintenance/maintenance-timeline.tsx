"use client";

import type { MaintenanceRecord } from "@/lib/types";
import {
  formatCurrency,
  formatDate,
  formatMileage,
  getCategoryLabel,
} from "@/lib/maintenance/utils";
import { Timeline } from "@/components/ui/timeline";
import { MaintenanceStatusBadge } from "@/components/maintenance/maintenance-status-badge";

interface MaintenanceTimelineProps {
  records: MaintenanceRecord[];
}

export function MaintenanceTimeline({ records }: MaintenanceTimelineProps) {
  const items = records.map((record) => ({
    id: record.id,
    date: formatDate(record.scheduledDate),
    title: getCategoryLabel(record.category),
    subtitle: record.workshop,
    status: <MaintenanceStatusBadge status={record.status} />,
    children: (
      <div className="space-y-4">
        <p className="text-sm">{record.description}</p>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          {record.invoiceNumber && (
            <div>
              <dt className="text-xs text-muted">Invoice</dt>
              <dd className="font-medium">{record.invoiceNumber}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-muted">Mileage</dt>
            <dd className="font-medium">{formatMileage(record.mileage)}</dd>
          </div>
          {record.completedDate && (
            <div>
              <dt className="text-xs text-muted">Completed</dt>
              <dd className="font-medium">{formatDate(record.completedDate)}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-muted">Labour</dt>
            <dd className="font-medium">
              {record.labourCost > 0
                ? formatCurrency(record.labourCost)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Parts</dt>
            <dd className="font-medium">
              {record.partsCost > 0
                ? formatCurrency(record.partsCost)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Total</dt>
            <dd className="font-semibold">
              {record.totalCost > 0
                ? formatCurrency(record.totalCost)
                : formatCurrency(record.estimatedCost) + " (est.)"}
            </dd>
          </div>
          {record.nextServiceDate && (
            <div>
              <dt className="text-xs text-muted">Next Service</dt>
              <dd className="font-medium">{formatDate(record.nextServiceDate)}</dd>
            </div>
          )}
          {record.nextServiceMileage && (
            <div>
              <dt className="text-xs text-muted">Next at KM</dt>
              <dd className="font-medium">
                {formatMileage(record.nextServiceMileage)}
              </dd>
            </div>
          )}
        </dl>

        {record.notes && (
          <p className="rounded-lg bg-background px-3 py-2 text-sm text-muted">
            {record.notes}
          </p>
        )}

        {record.attachments.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted">Attachments</p>
            <ul className="flex flex-wrap gap-2">
              {record.attachments.map((att) => (
                <li
                  key={att.id}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
                >
                  {att.name}
                  <span className="ml-1.5 text-muted capitalize">
                    ({att.type})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ),
  }));

  return <Timeline items={items} />;
}
