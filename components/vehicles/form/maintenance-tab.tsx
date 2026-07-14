"use client";

import type { VehicleFormData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MaintenanceTabProps {
  data: VehicleFormData;
  onChange: (data: Partial<VehicleFormData>) => void;
}

export function MaintenanceTab({ data, onChange }: MaintenanceTabProps) {
  const updateMaintenance = (
    field: keyof VehicleFormData["maintenance"],
    value: string
  ) => {
    onChange({
      maintenance: {
        ...data.maintenance,
        [field]: value || null,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Last Engine Service"
          type="date"
          value={data.maintenance.lastEngineService ?? ""}
          onChange={(e) => updateMaintenance("lastEngineService", e.target.value)}
        />
        <Input
          label="Next Engine Service"
          type="date"
          value={data.maintenance.nextEngineService ?? ""}
          onChange={(e) => updateMaintenance("nextEngineService", e.target.value)}
        />
        <Input
          label="Gearbox Service"
          type="date"
          value={data.maintenance.gearboxService ?? ""}
          onChange={(e) => updateMaintenance("gearboxService", e.target.value)}
        />
        <Input
          label="Brake Service"
          type="date"
          value={data.maintenance.brakeService ?? ""}
          onChange={(e) => updateMaintenance("brakeService", e.target.value)}
        />
        <Input
          label="Battery"
          type="date"
          value={data.maintenance.battery ?? ""}
          onChange={(e) => updateMaintenance("battery", e.target.value)}
        />
      </div>
      <Textarea
        label="Other"
        value={data.maintenance.other ?? ""}
        onChange={(e) => updateMaintenance("other", e.target.value)}
        placeholder="Additional maintenance notes..."
      />
    </div>
  );
}
