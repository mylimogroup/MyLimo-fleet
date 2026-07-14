"use client";

import type { VehicleFormData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface TiresTabProps {
  data: VehicleFormData;
  onChange: (data: Partial<VehicleFormData>) => void;
}

export function TiresTab({ data, onChange }: TiresTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Select
        label="Tire Type"
        value={data.tires.season}
        onChange={(e) =>
          onChange({
            tires: {
              ...data.tires,
              season: e.target.value as VehicleFormData["tires"]["season"],
            },
          })
        }
        options={[
          { value: "summer", label: "Summer" },
          { value: "winter", label: "Winter" },
          { value: "all_season", label: "All Season" },
        ]}
      />
      <Input
        label="Replacement Date"
        type="date"
        value={data.tires.replacementDate ?? ""}
        onChange={(e) =>
          onChange({
            tires: {
              ...data.tires,
              replacementDate: e.target.value || null,
            },
          })
        }
      />
      <Input
        label="Replacement Mileage"
        type="number"
        value={data.tires.replacementMileage ?? ""}
        onChange={(e) =>
          onChange({
            tires: {
              ...data.tires,
              replacementMileage: e.target.value
                ? Number(e.target.value)
                : null,
            },
          })
        }
        placeholder="35000"
        min={0}
        className="sm:col-span-2"
      />
    </div>
  );
}
