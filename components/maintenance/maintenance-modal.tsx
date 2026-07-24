"use client";

import { useEffect, useState } from "react";
import type {
  MaintenanceAttachment,
  MaintenanceFormData,
} from "@/lib/types";
import { MAINTENANCE_CATEGORIES } from "@/lib/maintenance/constants";
import { createEmptyMaintenanceForm } from "@/lib/maintenance/repository";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface MaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MaintenanceFormData) => void;
  initialData?: MaintenanceFormData;
  mode?: "create" | "edit";
  defaultVehicleId?: string;
}

export function MaintenanceModal({
  open,
  onClose,
  onSave,
  initialData,
  mode = "create",
  defaultVehicleId,
}: MaintenanceModalProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>(() => {
    const base = initialData ?? createEmptyMaintenanceForm();
    if (defaultVehicleId && !base.vehicleId) {
      return { ...base, vehicleId: defaultVehicleId };
    }
    return base;
  });
  const [vehicles, setVehicles] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    getVehicleRepository()
      .list()
      .then((list) => {
        setVehicles(
          list.map((v) => ({
            value: v.id,
            label: `${v.licensePlate} — ${v.brand} ${v.model}`,
          }))
        );
      });
  }, []);

  const handleChange = (partial: Partial<MaintenanceFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const addAttachments = (
    files: File[],
    type: MaintenanceAttachment["type"]
  ) => {
    const newAttachments: MaintenanceAttachment[] = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    }));
    handleChange({ attachments: [...formData.attachments, ...newAttachments] });
  };

  const removeAttachment = (id: string) => {
    handleChange({
      attachments: formData.attachments.filter((a) => a.id !== id),
    });
  };

  const handleSave = () => {
    if (!formData.vehicleId || !formData.description.trim()) return;
    onSave(formData);
    setFormData(createEmptyMaintenanceForm());
    onClose();
  };

  const handleClose = () => {
    setFormData(initialData ?? createEmptyMaintenanceForm());
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === "create" ? "Add Maintenance Record" : "Edit Record"}
      subtitle="Log service, compliance or repair operations"
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "create" ? "Add Record" : "Save Changes"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Vehicle"
            value={formData.vehicleId}
            onChange={(e) => handleChange({ vehicleId: e.target.value })}
            options={[
              { value: "", label: "Select vehicle..." },
              ...vehicles,
            ]}
            className="sm:col-span-2"
          />
          <Select
            label="Maintenance Type"
            value={formData.category}
            onChange={(e) =>
              handleChange({
                category: e.target.value as MaintenanceFormData["category"],
              })
            }
            options={MAINTENANCE_CATEGORIES.map((c) => ({
              value: c.value,
              label: c.label,
            }))}
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              handleChange({
                status: e.target.value as MaintenanceFormData["status"],
              })
            }
            options={[
              { value: "scheduled", label: "Scheduled" },
              { value: "in_progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
              { value: "overdue", label: "Overdue" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange({ description: e.target.value })}
            className="sm:col-span-2"
            required
          />
          <Input
            label="Workshop"
            value={formData.workshop}
            onChange={(e) => handleChange({ workshop: e.target.value })}
          />
          <Input
            label="Invoice Number"
            value={formData.invoiceNumber}
            onChange={(e) => handleChange({ invoiceNumber: e.target.value })}
          />
          <Input
            label="Scheduled Date"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => handleChange({ scheduledDate: e.target.value })}
          />
          <Input
            label="Completed Date"
            type="date"
            value={formData.completedDate ?? ""}
            onChange={(e) =>
              handleChange({ completedDate: e.target.value || null })
            }
          />
          <Input
            label="Mileage"
            type="number"
            value={formData.mileage}
            onChange={(e) =>
              handleChange({
                mileage: e.target.value ? Number(e.target.value) : "",
              })
            }
            min={0}
          />
          <Input
            label="Estimated Cost (€)"
            type="number"
            value={formData.estimatedCost}
            onChange={(e) =>
              handleChange({
                estimatedCost: e.target.value ? Number(e.target.value) : "",
              })
            }
            min={0}
          />
          <Input
            label="Labour Cost (€)"
            type="number"
            value={formData.labourCost}
            onChange={(e) =>
              handleChange({
                labourCost: e.target.value ? Number(e.target.value) : "",
              })
            }
            min={0}
          />
          <Input
            label="Parts Cost (€)"
            type="number"
            value={formData.partsCost}
            onChange={(e) =>
              handleChange({
                partsCost: e.target.value ? Number(e.target.value) : "",
              })
            }
            min={0}
          />
          <Input
            label="Next Service Date"
            type="date"
            value={formData.nextServiceDate ?? ""}
            onChange={(e) =>
              handleChange({ nextServiceDate: e.target.value || null })
            }
          />
          <Input
            label="Next Service Mileage"
            type="number"
            value={formData.nextServiceMileage ?? ""}
            onChange={(e) =>
              handleChange({
                nextServiceMileage: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
            min={0}
          />
        </div>

        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange({ notes: e.target.value })}
          placeholder="Additional details, parts used, follow-up actions..."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FileUpload
            label="Invoices"
            accept=".pdf,application/pdf"
            multiple
            onFilesSelected={(files) => addAttachments(files, "invoice")}
            hint="PDF invoices"
          />
          <FileUpload
            label="Photos"
            accept="image/*"
            multiple
            onFilesSelected={(files) => addAttachments(files, "photo")}
            hint="Work photos"
          />
          <FileUpload
            label="Documents"
            accept=".pdf,application/pdf"
            multiple
            onFilesSelected={(files) => addAttachments(files, "pdf")}
            hint="Service reports"
          />
        </div>

        {formData.attachments.length > 0 && (
          <ul className="divide-y divide-border rounded-xl border border-border">
            {formData.attachments.map((att) => (
              <li
                key={att.id}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <span className="truncate text-sm">{att.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted capitalize">{att.type}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="rounded p-1 text-muted hover:text-red-600"
                    aria-label={`Remove ${att.name}`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
