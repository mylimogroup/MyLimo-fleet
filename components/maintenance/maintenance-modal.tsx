"use client";

import { useEffect, useState } from "react";
import type { MaintenanceFormData, TireType } from "@/lib/types";
import {
  MAINTENANCE_CATEGORIES,
  TIRE_ROTATION_INTERVALS,
} from "@/lib/maintenance/constants";
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
  mode?: "create" | "edit" | "complete";
  defaultVehicleId?: string;
  lockVehicle?: boolean;
  lockCategory?: boolean;
  completeLabel?: string;
}

function emptyTireDetails() {
  return {
    tireType: "all_season" as TireType,
    brand: "",
    model: "",
    size: "",
    installationDate: new Date().toISOString().split("T")[0],
    installationMileage: 0,
  };
}

export function MaintenanceModal({
  open,
  onClose,
  onSave,
  initialData,
  mode = "create",
  defaultVehicleId,
  lockVehicle = false,
  lockCategory = false,
  completeLabel,
}: MaintenanceModalProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>(() => {
    const base = initialData ?? createEmptyMaintenanceForm();
    if (defaultVehicleId && !base.vehicleId) {
      return { ...base, vehicleId: defaultVehicleId };
    }
    return base;
  });
  const [vehicles, setVehicles] = useState<
    { value: string; label: string; mileage: number }[]
  >([]);
  const [customRotationKm, setCustomRotationKm] = useState(false);

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

  const handleChange = (partial: Partial<MaintenanceFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
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

  const isTireReplacement = formData.category === "tire_replacement";
  const selectedVehicle = vehicles.find((v) => v.value === formData.vehicleId);
  const modalTitle =
    mode === "complete"
      ? completeLabel ?? "Complete Maintenance"
      : mode === "create"
        ? "Log Maintenance"
        : "Edit Maintenance Record";
  const modalSubtitle =
    mode === "complete"
      ? "Log the completed operation and schedule the next deadline if needed"
      : "Record a completed workshop or mechanical operation";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "complete"
              ? "Complete & Schedule"
              : mode === "create"
                ? "Save Record"
                : "Save Changes"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Vehicle"
            value={formData.vehicleId}
            onChange={(e) => {
              const vehicle = vehicles.find((v) => v.value === e.target.value);
              handleChange({
                vehicleId: e.target.value,
                mileage: vehicle?.mileage ?? formData.mileage,
              });
            }}
            disabled={lockVehicle}
            options={[
              { value: "", label: "Select vehicle..." },
              ...vehicles.map((v) => ({ value: v.value, label: v.label })),
            ]}
            className="sm:col-span-2"
          />
          <Select
            label="Maintenance Type"
            value={formData.category}
            onChange={(e) => {
              const category = e.target
                .value as MaintenanceFormData["category"];
              handleChange({
                category,
                tireDetails:
                  category === "tire_replacement"
                    ? formData.tireDetails ?? emptyTireDetails()
                    : null,
              });
            }}
            disabled={lockCategory}
            options={MAINTENANCE_CATEGORIES.map((c) => ({
              value: c.value,
              label: c.label,
            }))}
            className="sm:col-span-2"
          />
          <Input
            label="Date"
            type="date"
            value={formData.completedDate}
            onChange={(e) => handleChange({ completedDate: e.target.value })}
          />
          <div>
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
            {selectedVehicle && (
              <p className="mt-1 text-xs text-muted">
                Current: {selectedVehicle.mileage.toLocaleString("it-IT")} km
              </p>
            )}
          </div>
          <Input
            label="Workshop"
            value={formData.workshop}
            onChange={(e) => handleChange({ workshop: e.target.value })}
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange({ description: e.target.value })}
            className="sm:col-span-2"
            required
          />
          <Input
            label="Labor Cost (€)"
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
            label="Total Cost (€)"
            type="number"
            value={formData.totalCost}
            onChange={(e) =>
              handleChange({
                totalCost: e.target.value ? Number(e.target.value) : "",
              })
            }
            min={0}
          />
        </div>

        {isTireReplacement && (
          <div className="rounded-xl border border-border bg-background/50 p-4 space-y-4">
            <p className="text-sm font-semibold">Tire Details</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Tire Type"
                value={formData.tireDetails?.tireType ?? "all_season"}
                onChange={(e) =>
                  handleChange({
                    tireDetails: {
                      ...(formData.tireDetails ?? emptyTireDetails()),
                      tireType: e.target.value as TireType,
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
                label="Brand"
                value={formData.tireDetails?.brand ?? ""}
                onChange={(e) =>
                  handleChange({
                    tireDetails: {
                      ...(formData.tireDetails ?? emptyTireDetails()),
                      brand: e.target.value,
                    },
                  })
                }
              />
              <Input
                label="Model"
                value={formData.tireDetails?.model ?? ""}
                onChange={(e) =>
                  handleChange({
                    tireDetails: {
                      ...(formData.tireDetails ?? emptyTireDetails()),
                      model: e.target.value,
                    },
                  })
                }
              />
              <Input
                label="Size"
                value={formData.tireDetails?.size ?? ""}
                onChange={(e) =>
                  handleChange({
                    tireDetails: {
                      ...(formData.tireDetails ?? emptyTireDetails()),
                      size: e.target.value,
                    },
                  })
                }
                placeholder="e.g. 245/45 R19"
              />
              <Input
                label="Installation Date"
                type="date"
                value={formData.tireDetails?.installationDate ?? ""}
                onChange={(e) =>
                  handleChange({
                    tireDetails: {
                      ...(formData.tireDetails ?? emptyTireDetails()),
                      installationDate: e.target.value,
                    },
                  })
                }
              />
              <Input
                label="Installation Mileage"
                type="number"
                value={formData.tireDetails?.installationMileage ?? ""}
                onChange={(e) =>
                  handleChange({
                    tireDetails: {
                      ...(formData.tireDetails ?? emptyTireDetails()),
                      installationMileage: Number(e.target.value) || 0,
                    },
                    mileage: Number(e.target.value) || formData.mileage,
                  })
                }
                min={0}
              />
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={formData.tireRotationReminder.enabled}
                  onChange={(e) =>
                    handleChange({
                      tireRotationReminder: {
                        ...formData.tireRotationReminder,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-border"
                />
                Create tire rotation reminder?
              </label>
              {formData.tireRotationReminder.enabled && (
                <div className="flex flex-wrap gap-2">
                  {TIRE_ROTATION_INTERVALS.map((interval) => (
                    <button
                      key={interval.value}
                      type="button"
                      onClick={() => {
                        setCustomRotationKm(false);
                        handleChange({
                          tireRotationReminder: {
                            enabled: true,
                            intervalKm: interval.value,
                          },
                        });
                      }}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                        !customRotationKm &&
                        formData.tireRotationReminder.intervalKm ===
                          interval.value
                          ? "border-accent bg-accent/10 font-medium"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      {interval.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomRotationKm(true)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      customRotationKm
                        ? "border-accent bg-accent/10 font-medium"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    Custom
                  </button>
                  {customRotationKm && (
                    <Input
                      type="number"
                      value={formData.tireRotationReminder.intervalKm}
                      onChange={(e) =>
                        handleChange({
                          tireRotationReminder: {
                            enabled: true,
                            intervalKm: Number(e.target.value) || 10000,
                          },
                        })
                      }
                      min={1000}
                      className="w-32"
                      aria-label="Custom rotation interval km"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {!isTireReplacement && (
          <div className="rounded-xl border border-border bg-background/50 p-4 space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={formData.recurrence.enabled}
                onChange={(e) =>
                  handleChange({
                    recurrence: {
                      ...formData.recurrence,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="rounded border-border"
              />
              Repeat this maintenance?
            </label>
            {formData.recurrence.enabled && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Repeat every (km)"
                  type="number"
                  value={formData.recurrence.repeatEveryKm ?? ""}
                  onChange={(e) =>
                    handleChange({
                      recurrence: {
                        ...formData.recurrence,
                        repeatEveryKm: e.target.value
                          ? Number(e.target.value)
                          : null,
                      },
                    })
                  }
                  min={1000}
                  placeholder="e.g. 15000"
                />
                <Input
                  label="Repeat every (months)"
                  type="number"
                  value={formData.recurrence.repeatEveryMonths ?? ""}
                  onChange={(e) =>
                    handleChange({
                      recurrence: {
                        ...formData.recurrence,
                        repeatEveryMonths: e.target.value
                          ? Number(e.target.value)
                          : null,
                      },
                    })
                  }
                  min={1}
                  placeholder="e.g. 12"
                />
              </div>
            )}
          </div>
        )}

        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange({ notes: e.target.value })}
          placeholder="Additional details, follow-up actions..."
        />

        <FileUpload
          label="Invoice PDF"
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
