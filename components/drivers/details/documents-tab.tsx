"use client";

import type { Driver } from "@/lib/types";
import { formatDate } from "@/lib/drivers/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { ExpirationCell } from "@/components/ui/expiration-cell";
import { Badge } from "@/components/ui/badge";

interface DocumentsTabProps {
  driver: Driver;
}

const categoryLabels: Record<string, string> = {
  identity: "Identity",
  license: "License",
  contract: "Contract",
  medical: "Medical",
  other: "Other",
};

export function DocumentsTab({ driver }: DocumentsTabProps) {
  const { documents, files } = driver;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          License & Compliance
        </h3>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">Driving License</dt>
            <dd className="mt-1 text-sm font-medium">
              {documents.drivingLicenseNumber || "—"}
            </dd>
            <div className="mt-1">
              <ExpirationCell date={documents.drivingLicenseExpiration} />
            </div>
          </div>
          <div>
            <dt className="text-xs text-muted">CQC</dt>
            <dd className="mt-1">
              <ExpirationCell date={documents.cqcExpiration} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">NCC License</dt>
            <dd className="mt-1 text-sm font-medium">
              {documents.nccLicenseNumber || "—"}
            </dd>
            <div className="mt-1">
              <ExpirationCell date={documents.nccLicenseExpiration} />
            </div>
          </div>
          <div>
            <dt className="text-xs text-muted">Medical Certificate</dt>
            <dd className="mt-1">
              <ExpirationCell date={documents.medicalCertificateExpiration} />
            </dd>
          </div>
        </dl>
      </div>

      {files.length === 0 ? (
        <EmptyState
          icon={
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          }
          title="No uploaded files"
          description="Upload documents from the driver edit form"
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-3">
            <h3 className="text-sm font-semibold">Uploaded Files</h3>
          </div>
          <ul className="divide-y divide-border">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted">
                    {file.type === "pdf" ? "PDF" : "IMG"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted">
                      {formatDate(file.uploadedAt.split("T")[0])}
                    </p>
                  </div>
                </div>
                <Badge variant="default">
                  {categoryLabels[file.category] ?? file.category}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
