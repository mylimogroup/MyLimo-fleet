"use client";

import { useState } from "react";
import type { Vehicle, VehicleDeadlineFormData } from "@/lib/types";
import {
  computeAllDeadlines,
  createEmptyDeadlineForm,
  createMaintenanceFormFromDeadline,
  deadlineToFormData,
} from "@/lib/vehicles/deadlines";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { getMaintenanceRepository } from "@/lib/maintenance/service";
import { Button } from "@/components/ui/button";
import { DeadlineModal } from "@/components/deadlines/deadline-modal";
import { DeadlineTable } from "@/components/deadlines/deadline-table";
import { MaintenanceModal } from "@/components/maintenance/maintenance-modal";

interface DeadlinesTabProps {
  vehicle: Vehicle;
  onRefresh: () => void;
}

export function DeadlinesTab({ vehicle, onRefresh }: DeadlinesTabProps) {
  const repository = getVehicleRepository();
  const maintenanceRepository = getMaintenanceRepository();
  const deadlines = computeAllDeadlines(vehicle);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<
    VehicleDeadlineFormData | undefined
  >();

  const [completeOpen, setCompleteOpen] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completeFormData, setCompleteFormData] = useState<
    ReturnType<typeof createMaintenanceFormFromDeadline> | undefined
  >();
  const [completingLabel, setCompletingLabel] = useState("");

  const handleAdd = () => {
    setEditingId(null);
    setEditFormData(undefined);
    setModalOpen(true);
  };

  const handleEdit = (row: (typeof deadlines)[0]) => {
    const stored = vehicle.deadlines.find((d) => d.id === row.id);
    if (!stored) return;
    setEditingId(row.id);
    setEditFormData(deadlineToFormData(stored, vehicle.id));
    setModalOpen(true);
  };

  const handleDelete = async (row: (typeof deadlines)[0]) => {
    await repository.deleteDeadline(vehicle.id, row.id);
    onRefresh();
  };

  const handleSave = async (data: VehicleDeadlineFormData) => {
    if (editingId) {
      await repository.updateDeadline(vehicle.id, editingId, data);
    } else {
      await repository.addDeadline(vehicle.id, data);
    }
    onRefresh();
  };

  const handleComplete = (row: (typeof deadlines)[0]) => {
    const form = createMaintenanceFormFromDeadline(
      row,
      vehicle.id,
      vehicle.currentMileage
    );
    if (!form) return;
    setCompletingId(row.id);
    setCompletingLabel(row.label);
    setCompleteFormData(form);
    setCompleteOpen(true);
  };

  const handleCompleteSave = async (
    data: NonNullable<typeof completeFormData>
  ) => {
    await maintenanceRepository.create(data);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={handleAdd}>
          Add Deadline
        </Button>
      </div>

      <DeadlineTable
        rows={deadlines}
        showVehicle={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />

      <DeadlineModal
        key={editingId ?? "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setEditFormData(undefined);
        }}
        onSave={handleSave}
        initialData={
          editFormData ?? createEmptyDeadlineForm(vehicle.id)
        }
        defaultVehicleId={vehicle.id}
        lockVehicle
        isEditing={!!editingId}
      />

      {completeFormData && (
        <MaintenanceModal
          key={completingId ?? "complete"}
          open={completeOpen}
          onClose={() => {
            setCompleteOpen(false);
            setCompletingId(null);
            setCompleteFormData(undefined);
          }}
          onSave={handleCompleteSave}
          initialData={completeFormData}
          mode="complete"
          defaultVehicleId={vehicle.id}
          lockVehicle
          lockCategory
          completeLabel={`Complete ${completingLabel}`}
        />
      )}
    </div>
  );
}
