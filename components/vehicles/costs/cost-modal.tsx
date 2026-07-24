"use client";

import { useState } from "react";
import type { VehicleCostFormData } from "@/lib/types";
import { VEHICLE_COST_CATEGORIES, ITALIAN_VAT_RATES } from "@/lib/vehicles/cost-constants";
import type { ItalianVatRate } from "@/lib/types";
import {
  computeCostAmountsFromForm,
  createEmptyCostForm,
  formatCostAmount,
  normalizeCostFormData,
} from "@/lib/vehicles/costs";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CostModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: VehicleCostFormData) => void | Promise<void>;
  initialData?: VehicleCostFormData;
  isEditing?: boolean;
  defaultVehicleId?: string;
  currentMileage?: number;
}

export function CostModal({
  open,
  onClose,
  onSave,
  initialData,
  isEditing = false,
  defaultVehicleId,
  currentMileage,
}: CostModalProps) {
  const [formData, setFormData] = useState<VehicleCostFormData>(() => {
    const base = initialData ?? createEmptyCostForm(defaultVehicleId ?? "");
    if (defaultVehicleId && !base.vehicleId) {
      return { ...base, vehicleId: defaultVehicleId };
    }
    return base;
  });

  const handleChange = (partial: Partial<VehicleCostFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const computed = computeCostAmountsFromForm(formData);

  const handleSave = async () => {
    const normalized = normalizeCostFormData(formData);
    if (!normalized.description.trim() || normalized.totalAmount <= 0) return;
    await onSave(normalized);
    if (!isEditing) {
      setFormData(createEmptyCostForm(defaultVehicleId ?? ""));
    }
    onClose();
  };

  const handleClose = () => {
    setFormData(initialData ?? createEmptyCostForm(defaultVehicleId ?? ""));
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? "Edit Cost" : "Add Cost"}
      subtitle="Record an operating expense for this vehicle"
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Save Changes" : "Add Cost"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange({ date: e.target.value })}
          />
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) =>
              handleChange({
                category: e.target
                  .value as VehicleCostFormData["category"],
              })
            }
            options={VEHICLE_COST_CATEGORIES.map((c) => ({
              value: c.value,
              label: c.label,
            }))}
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange({ description: e.target.value })}
            className="sm:col-span-2"
            required
          />
          <Input
            label="Supplier / Workshop"
            value={formData.supplier}
            onChange={(e) => handleChange({ supplier: e.target.value })}
            className="sm:col-span-2"
          />
          <div>
            <Input
              label="Mileage (optional)"
              type="number"
              value={formData.mileage}
              onChange={(e) =>
                handleChange({
                  mileage: e.target.value ? Number(e.target.value) : "",
                })
              }
              min={0}
            />
            {currentMileage !== undefined && (
              <p className="mt-1 text-xs text-muted">
                Current: {currentMileage.toLocaleString("it-IT")} km
              </p>
            )}
          </div>
          <Input
            label="Net amount (€)"
            type="number"
            value={formData.netAmount}
            onChange={(e) =>
              handleChange({
                netAmount: e.target.value ? Number(e.target.value) : "",
              })
            }
            min={0}
            step={0.01}
          />
          <Select
            label="VAT rate"
            value={String(formData.vatRate)}
            onChange={(e) =>
              handleChange({
                vatRate: Number(e.target.value) as ItalianVatRate,
              })
            }
            options={ITALIAN_VAT_RATES.map((option) => ({
              value: String(option.value),
              label: option.label,
            }))}
          />
          <div>
            <p className="mb-1.5 block text-sm font-medium text-foreground">
              VAT amount (€)
            </p>
            <div className="flex h-10 items-center rounded-lg border border-border bg-background/50 px-3 text-sm tabular-nums text-muted">
              {computed.vatAmount !== null
                ? formatCostAmount(computed.vatAmount)
                : "—"}
            </div>
          </div>
          <div>
            <p className="mb-1.5 block text-sm font-medium text-foreground">
              Total amount (€)
            </p>
            <div className="flex h-10 items-center rounded-lg border border-border bg-background/50 px-3 text-sm font-semibold tabular-nums">
              {computed.totalAmount !== null
                ? formatCostAmount(computed.totalAmount)
                : "—"}
            </div>
          </div>
        </div>

        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange({ notes: e.target.value })}
          placeholder="Optional context..."
        />

        <FileUpload
          label="Invoice / Receipt PDF"
          accept=".pdf,application/pdf"
          onFilesSelected={(files) => {
            const file = files[0];
            if (file) {
              handleChange({
                invoicePdfUrl: URL.createObjectURL(file),
                invoicePdfName: file.name,
              });
            }
          }}
          hint="PDF only"
        />
        {formData.invoicePdfName && (
          <p className="text-sm text-muted">
            Attached: {formData.invoicePdfName}
          </p>
        )}
      </div>
    </Modal>
  );
}
