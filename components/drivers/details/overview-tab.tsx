"use client";

import type { Driver } from "@/lib/types";
import { formatDate, formatLanguages } from "@/lib/drivers/utils";
import { ExpirationCell } from "@/components/ui/expiration-cell";
import { DriverStatusBadge } from "@/components/drivers/driver-status-badge";

interface OverviewTabProps {
  driver: Driver;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium text-right">{value}</dd>
    </div>
  );
}

export function OverviewTab({ driver }: OverviewTabProps) {
  const { personal, documents, operational } = driver;
  const fullName = `${personal.firstName} ${personal.lastName}`;
  const activeAssignment = driver.assignments.find((a) => !a.endDate);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Personal Information
        </h3>
        <dl className="mt-4 divide-y divide-border">
          <InfoRow label="Full Name" value={fullName} />
          <InfoRow label="Email" value={personal.email || "—"} />
          <InfoRow label="Phone" value={personal.phone} />
          <InfoRow
            label="Date of Birth"
            value={personal.dateOfBirth ? formatDate(personal.dateOfBirth) : "—"}
          />
          <InfoRow label="Address" value={personal.address || "—"} />
          <InfoRow label="Tax Code" value={personal.taxCode || "—"} />
          <InfoRow
            label="Languages"
            value={
              personal.languages.length > 0
                ? formatLanguages(personal.languages)
                : "—"
            }
          />
        </dl>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Operational
          </h3>
          <dl className="mt-4 divide-y divide-border">
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-sm text-muted">Status</dt>
              <dd>
                <DriverStatusBadge status={operational.status} />
              </dd>
            </div>
            <InfoRow
              label="Employee ID"
              value={operational.employeeId || "—"}
            />
            <InfoRow
              label="Contract Type"
              value={
                operational.contractType.charAt(0).toUpperCase() +
                operational.contractType.slice(1)
              }
            />
            <InfoRow
              label="Hire Date"
              value={
                operational.hireDate ? formatDate(operational.hireDate) : "—"
              }
            />
            <InfoRow
              label="Assigned Vehicle"
              value={
                activeAssignment
                  ? `${activeAssignment.vehiclePlate} — ${activeAssignment.vehicleBrand} ${activeAssignment.vehicleModel}`
                  : "—"
              }
            />
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Document Expirations
          </h3>
          <dl className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted">Driving License</dt>
              <dd>
                <ExpirationCell date={documents.drivingLicenseExpiration} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted">CQC</dt>
              <dd>
                <ExpirationCell date={documents.cqcExpiration} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted">NCC License</dt>
              <dd>
                <ExpirationCell date={documents.nccLicenseExpiration} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted">Medical Certificate</dt>
              <dd>
                <ExpirationCell date={documents.medicalCertificateExpiration} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
