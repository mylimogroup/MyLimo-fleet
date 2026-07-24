"use client";

import { useEffect, useState } from "react";
import type {
  DeadlineTriggerType,
  VehicleDeadlineFormData,
} from "@/lib/types";
import {
  createEmptyDeadlineForm,
  DEADLINE_CATEGORIES,
} from "@/lib/vehicles/deadlines";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface DeadlineModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: VehicleDeadlineFormData) => void;
  initialData?: VehicleDeadlineFormData;
  isEditing?: boolean;
  defaultVehicleId?: string;
  lockVehicle?: boolean;
}

export function DeadlineModal({
  open,
  onClose,
  onSave,
  initialData,
  isEditing = false,
  defaultVehicleId,
  lockVehicle = false,
}: DeadlineModalProps) {
  const [formData, setFormData] = useState<VehicleDeadlineFormData>(() => {
    const base = initialData ?? createEmptyDeadlineForm(defaultVehicleId ?? "");
    if (defaultVehicleId && !base.vehicleId) {
      return { ...base, vehicleId: defaultVehicleId };
    }
    return base;
  });
  const [vehicles, setVehicles] = useState<
    { value: string; label: string; mileage: number }[]
  >([]);

  useEffect(() => {
    getVehicleRepository()
      .list()
      .then((list) => {
        setVehicles(
          list.map((v) => ({
            value: v.id,
            label: `${v.licensePlate} — ${v.brand} ${v.model}`,
            mileage: v.currentMileage,
          }))
        );
      });
  }, []);

  const handleChange = (partial: Partial<VehicleDeadlineFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const handleSave = () => {
    if (!formData.vehicleId) return;
    if (
      (formData.triggerType === "date" || formData.triggerType === "both") &&
      !formData.dueDate
    ) {
      return;
    }
    if (
      (formData.triggerType === "mileage" || formData.triggerType === "both") &&
      formData.targetMileage === ""
    ) {
      return;
    }
    onSave(formData);
    setFormData(createEmptyDeadlineForm(defaultVehicleId ?? ""));
    onClose();
  };

  const handleClose = () => {
    setFormData(initialData ?? createEmptyDeadlineForm(defaultVehicleId ?? ""));
    onClose();
  };

  const selectedVehicle = vehicles.find((v) => v.value === formData.vehicleId);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? "Edit Deadline" : "Add Deadline"}
      subtitle="Set when this vehicle needs attention"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Save Changes" : "Add Deadline"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Vehicle"
          value={formData.vehicleId}
          onChange={(e) => handleChange({ vehicleId: e.target.value })}
          disabled={lockVehicle}
          options={[
            { value: "", label: "Select vehicle..." },
            ...vehicles.map((v) => ({ value: v.value, label: v.label })),
          ]}
        />
        <Select
          label="Deadline Type"
          value={formData.category}
          onChange={(e) =>
            handleChange({
              category: e.target.value as VehicleDeadlineFormData["category"],
            })
          }
          options={DEADLINE_CATEGORIES.map((c) => ({
            value: c.value,
            label: c.label,
          }))}
        />
        <Select
          label="Trigger Type"
          value={formData.triggerType}
          onChange={(e) =>
            handleChange({
              triggerType: e.target.value as DeadlineTriggerType,
              dueDate:
                e.target.value === "mileage" ? null : formData.dueDate,
              targetMileage:
                e.target.value === "date" ? "" : formData.targetMileage,
            })
          }
          options={[
            { value: "date", label: "Date" },
            { value: "mileage", label: "Mileage" },
            { value: "both", label: "Date + Mileage" },
          ]}
        />

        {(formData.triggerType === "date" ||
          formData.triggerType === "both") && (
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate ?? ""}
            onChange={(e) =>
              handleChange({ dueDate: e.target.value || null })
            }
          />
        )}

        {(formData.triggerType === "mileage" ||
          formData.triggerType === "both") && (
          <div>
            <Input
              label="Target Mileage (km)"
              type="number"
              value={formData.targetMileage}
              onChange={(e) =>
                handleChange({
                  targetMileage: e.target.value
                    ? Number(e.target.value)
                    : "",
                })
              }
              min={0}
            />
            {selectedVehicle && (
              <p className="mt-1 text-xs text-muted">
                Current: {selectedVehicle.mileage.toLocaleString("it-IT")} km
              </p>
            )}
          </div>
        )}

        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange({ notes: e.target.value })}
          placeholder="Optional reminder or context..."
        />
      </div>
    </Modal>
  );
}
