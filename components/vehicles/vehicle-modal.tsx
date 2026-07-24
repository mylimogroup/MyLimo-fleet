"use client";

import { useState } from "react";
import type { VehicleFormData } from "@/lib/types";
import { createEmptyVehicleForm } from "@/lib/vehicles/repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";

interface VehicleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: VehicleFormData) => void;
  initialData?: VehicleFormData;
  mode?: "create" | "edit";
}

export function VehicleModal({
  open,
  onClose,
  onSave,
  initialData,
  mode = "create",
}: VehicleModalProps) {
  return (
    <VehicleModalInner
      key={mode === "edit" ? "edit" : "new"}
      open={open}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData ?? createEmptyVehicleForm()}
      mode={mode}
    />
  );
}

function VehicleModalInner({
  open,
  onClose,
  onSave,
  initialData,
  mode,
}: Required<Pick<VehicleModalProps, "open" | "onClose" | "onSave" | "mode">> & {
  initialData: VehicleFormData;
}) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (partial: Partial<VehicleFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const handleSave = () => {
    if (
      !formData.licensePlate.trim() ||
      !formData.brand.trim() ||
      !formData.model.trim()
    ) {
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Add Vehicle" : "Edit Vehicle"}
      subtitle="Master identification data"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "create" ? "Add Vehicle" : "Save Changes"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="License Plate"
          value={formData.licensePlate}
          onChange={(e) => handleChange({ licensePlate: e.target.value })}
          placeholder="MI-LM 401"
          required
        />
        <Input
          label="Brand"
          value={formData.brand}
          onChange={(e) => handleChange({ brand: e.target.value })}
          placeholder="Mercedes-Benz"
          required
        />
        <Input
          label="Model"
          value={formData.model}
          onChange={(e) => handleChange({ model: e.target.value })}
          placeholder="S-Class"
          required
        />
        <Input
          label="Version"
          value={formData.version}
          onChange={(e) => handleChange({ version: e.target.value })}
          placeholder="S 350 d L"
        />
        <Input
          label="Year"
          type="number"
          value={formData.year}
          onChange={(e) =>
            handleChange({ year: e.target.value ? Number(e.target.value) : "" })
          }
          min={1990}
          max={2030}
        />
        <Input
          label="First Registration Date"
          type="date"
          value={formData.firstRegistrationDate ?? ""}
          onChange={(e) =>
            handleChange({ firstRegistrationDate: e.target.value || null })
          }
        />
        <Input
          label="VIN / Chassis Number"
          value={formData.vin}
          onChange={(e) => handleChange({ vin: e.target.value })}
          className="sm:col-span-2"
        />
        <Input
          label="Current Mileage"
          type="number"
          value={formData.currentMileage}
          onChange={(e) =>
            handleChange({
              currentMileage: e.target.value ? Number(e.target.value) : "",
            })
          }
          min={0}
        />
        <Input
          label="Purchase Date"
          type="date"
          value={formData.purchaseDate ?? ""}
          onChange={(e) =>
            handleChange({ purchaseDate: e.target.value || null })
          }
        />
        <Input
          label="Purchase Price (€)"
          type="number"
          value={formData.purchasePrice}
          onChange={(e) =>
            handleChange({
              purchasePrice: e.target.value ? Number(e.target.value) : "",
            })
          }
          min={0}
          className="sm:col-span-2"
        />
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange({ notes: e.target.value })}
          className="sm:col-span-2"
        />
      </div>
    </Modal>
  );
}
