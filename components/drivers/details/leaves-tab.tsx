"use client";

import type { Driver, DriverLeaveStatus, DriverLeaveType } from "@/lib/types";
import { formatDate } from "@/lib/drivers/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

interface LeavesTabProps {
  driver: Driver;
}

const leaveTypeLabels: Record<DriverLeaveType, string> = {
  vacation: "Vacation",
  sick: "Sick Leave",
  personal: "Personal",
  other: "Other",
};

const leaveStatusVariants: Record<
  DriverLeaveStatus,
  "success" | "warning" | "danger"
> = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
};

export function LeavesTab({ driver }: LeavesTabProps) {
  if (driver.leaves.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        }
        title="No leave records"
        description="No vacation, sick or personal leave on file"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Type
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Start
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                End
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {driver.leaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-background/40">
                <td className="px-5 py-3 font-medium">
                  {leaveTypeLabels[leave.type]}
                </td>
                <td className="px-5 py-3">{formatDate(leave.startDate)}</td>
                <td className="px-5 py-3">{formatDate(leave.endDate)}</td>
                <td className="px-5 py-3">
                  <Badge variant={leaveStatusVariants[leave.status]}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-muted">
                  {leave.notes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
