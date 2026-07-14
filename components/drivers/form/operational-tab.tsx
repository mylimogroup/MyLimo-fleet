"use client";

import { useEffect, useState } from "react";
import type { DriverFormData } from "@/lib/types";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface OperationalTabProps {
  data: DriverFormData;
  onChange: (data: Partial<DriverFormData>) => void;
}

export function OperationalTab({ data, onChange }: OperationalTabProps) {
  const [vehicles, setVehicles] = useState<
    { value: string; label: string }[]
  >([{ value: "", label: "No vehicle assigned" }]);

  useEffect(() => {
    getVehicleRepository()
      .list()
      .then((list) => {
        setVehicles([
          { value: "", label: "No vehicle assigned" },
          ...list.map((v) => ({
            value: v.id,
            label: `${v.licensePlate} — ${v.brand} ${v.model}`,
          })),
        ]);
      });
  }, []);

  const updateOperational = (
    field: keyof DriverFormData["operational"],
    value: string | null
  ) => {
    onChange({
      operational: {
        ...data.operational,
        [field]:
          field === "assignedVehicleId"
            ? value || null
            : value,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Select
        label="Status"
        value={data.operational.status}
        onChange={(e) =>
          onChange({
            operational: {
              ...data.operational,
              status: e.target.value as DriverFormData["operational"]["status"],
            },
          })
        }
        options={[
          { value: "active", label: "Active" },
          { value: "on_duty", label: "On Duty" },
          { value: "on_leave", label: "On Leave" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
      <Select
        label="Assigned Vehicle"
        value={data.operational.assignedVehicleId ?? ""}
        onChange={(e) => updateOperational("assignedVehicleId", e.target.value)}
        options={vehicles}
      />
      <Input
        label="Hire Date"
        type="date"
        value={data.operational.hireDate ?? ""}
        onChange={(e) => updateOperational("hireDate", e.target.value || null)}
      />
      <Select
        label="Contract Type"
        value={data.operational.contractType}
        onChange={(e) =>
          onChange({
            operational: {
              ...data.operational,
              contractType: e.target.value as DriverFormData["operational"]["contractType"],
            },
          })
        }
        options={[
          { value: "employee", label: "Employee" },
          { value: "collaborator", label: "Collaborator" },
          { value: "freelance", label: "Freelance" },
        ]}
      />
      <Input
        label="Employee ID"
        value={data.operational.employeeId}
        onChange={(e) => updateOperational("employeeId", e.target.value)}
        placeholder="EMP-001"
        className="sm:col-span-2"
      />
    </div>
  );
}
