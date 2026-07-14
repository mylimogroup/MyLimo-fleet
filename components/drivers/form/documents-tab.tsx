"use client";

import type { DriverFormData } from "@/lib/types";
import { Input } from "@/components/ui/input";

interface DocumentsTabProps {
  data: DriverFormData;
  onChange: (data: Partial<DriverFormData>) => void;
}

export function DocumentsTab({ data, onChange }: DocumentsTabProps) {
  const updateDocuments = (
    field: keyof DriverFormData["documents"],
    value: string | null
  ) => {
    onChange({ documents: { ...data.documents, [field]: value || null } });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input
        label="Driving License Number"
        value={data.documents.drivingLicenseNumber}
        onChange={(e) => updateDocuments("drivingLicenseNumber", e.target.value)}
        placeholder="MI1234567A"
        className="sm:col-span-2"
      />
      <Input
        label="Driving License Expiration"
        type="date"
        value={data.documents.drivingLicenseExpiration ?? ""}
        onChange={(e) => updateDocuments("drivingLicenseExpiration", e.target.value)}
      />
      <Input
        label="CQC Expiration"
        type="date"
        value={data.documents.cqcExpiration ?? ""}
        onChange={(e) => updateDocuments("cqcExpiration", e.target.value)}
      />
      <Input
        label="NCC License Number"
        value={data.documents.nccLicenseNumber ?? ""}
        onChange={(e) => updateDocuments("nccLicenseNumber", e.target.value)}
        placeholder="NCC-MI-2019-0041"
      />
      <Input
        label="NCC License Expiration"
        type="date"
        value={data.documents.nccLicenseExpiration ?? ""}
        onChange={(e) => updateDocuments("nccLicenseExpiration", e.target.value)}
      />
      <Input
        label="Medical Certificate Expiration"
        type="date"
        value={data.documents.medicalCertificateExpiration ?? ""}
        onChange={(e) => updateDocuments("medicalCertificateExpiration", e.target.value)}
        className="sm:col-span-2"
      />
    </div>
  );
}
