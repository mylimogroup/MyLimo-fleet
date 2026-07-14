"use client";

import type { VehicleFormData } from "@/lib/types";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface GeneralTabProps {
  data: VehicleFormData;
  onChange: (data: Partial<VehicleFormData>) => void;
}

export function GeneralTab({ data, onChange }: GeneralTabProps) {
  return (
    <div className="space-y-6">
      <FileUpload
        label="Vehicle Photo"
        accept="image/*"
        onFilesSelected={(files) => {
          const file = files[0];
          if (file) {
            const url = URL.createObjectURL(file);
            onChange({ photoUrl: url });
          }
        }}
        hint="JPG, PNG or WebP — max 5 MB"
      />

      {data.photoUrl && (
        <div className="relative h-32 w-48 overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt="Vehicle preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="License Plate"
          value={data.licensePlate}
          onChange={(e) => onChange({ licensePlate: e.target.value })}
          placeholder="MI-LM 401"
          required
        />
        <Input
          label="Brand"
          value={data.brand}
          onChange={(e) => onChange({ brand: e.target.value })}
          placeholder="Mercedes-Benz"
          required
        />
        <Input
          label="Model"
          value={data.model}
          onChange={(e) => onChange({ model: e.target.value })}
          placeholder="S-Class"
          required
        />
        <Input
          label="Year"
          type="number"
          value={data.year}
          onChange={(e) =>
            onChange({ year: e.target.value ? Number(e.target.value) : "" })
          }
          placeholder="2024"
          min={1990}
          max={2030}
        />
        <Input
          label="VIN"
          value={data.vin}
          onChange={(e) => onChange({ vin: e.target.value })}
          placeholder="WDDUG8CB5PA123456"
        />
        <Input
          label="Color"
          value={data.color}
          onChange={(e) => onChange({ color: e.target.value })}
          placeholder="Obsidian Black"
        />
        <Select
          label="Fuel"
          value={data.fuel}
          onChange={(e) =>
            onChange({ fuel: e.target.value as VehicleFormData["fuel"] })
          }
          options={[
            { value: "petrol", label: "Petrol" },
            { value: "diesel", label: "Diesel" },
            { value: "hybrid", label: "Hybrid" },
            { value: "electric", label: "Electric" },
            { value: "lpg", label: "LPG" },
          ]}
        />
        <Select
          label="Transmission"
          value={data.transmission}
          onChange={(e) =>
            onChange({
              transmission: e.target.value as VehicleFormData["transmission"],
            })
          }
          options={[
            { value: "automatic", label: "Automatic" },
            { value: "manual", label: "Manual" },
          ]}
        />
        <Input
          label="Seats"
          type="number"
          value={data.seats}
          onChange={(e) =>
            onChange({ seats: e.target.value ? Number(e.target.value) : "" })
          }
          placeholder="4"
          min={1}
          max={20}
        />
        <Input
          label="Current Mileage"
          type="number"
          value={data.currentMileage}
          onChange={(e) =>
            onChange({
              currentMileage: e.target.value ? Number(e.target.value) : "",
            })
          }
          placeholder="48320"
          min={0}
        />
        <Select
          label="Status"
          value={data.status}
          onChange={(e) =>
            onChange({ status: e.target.value as VehicleFormData["status"] })
          }
          options={[
            { value: "available", label: "Available" },
            { value: "in_use", label: "In Use" },
            { value: "maintenance", label: "Maintenance" },
          ]}
        />
      </div>
    </div>
  );
}
