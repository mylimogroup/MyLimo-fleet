"use client";

import type { VehicleFormData } from "@/lib/types";
import { Input } from "@/components/ui/input";

interface DeadlinesTabProps {
  data: VehicleFormData;
  onChange: (data: Partial<VehicleFormData>) => void;
}

export function DeadlinesTab({ data, onChange }: DeadlinesTabProps) {
  const updateDeadline = (
    field: keyof VehicleFormData["deadlines"],
    value: string
  ) => {
    onChange({
      deadlines: {
        ...data.deadlines,
        [field]: value || null,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input
        label="Insurance"
        type="date"
        value={data.deadlines.insurance ?? ""}
        onChange={(e) => updateDeadline("insurance", e.target.value)}
      />
      <Input
        label="Road Tax"
        type="date"
        value={data.deadlines.roadTax ?? ""}
        onChange={(e) => updateDeadline("roadTax", e.target.value)}
      />
      <Input
        label="Inspection"
        type="date"
        value={data.deadlines.inspection ?? ""}
        onChange={(e) => updateDeadline("inspection", e.target.value)}
      />
      <Input
        label="NCC Licence"
        type="date"
        value={data.deadlines.nccLicence ?? ""}
        onChange={(e) => updateDeadline("nccLicence", e.target.value)}
      />
      <Input
        label="Other"
        type="date"
        value={data.deadlines.other ?? ""}
        onChange={(e) => updateDeadline("other", e.target.value)}
        className="sm:col-span-2"
      />
    </div>
  );
}
