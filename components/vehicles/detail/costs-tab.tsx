"use client";

import { useMemo, useState } from "react";
import type { Vehicle, VehicleCostEntry, VehicleCostFormData } from "@/lib/types";
import {
  computeVehicleCostKPIs,
  costEntryToFormData,
  createEmptyCostForm,
} from "@/lib/vehicles/costs";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { Button } from "@/components/ui/button";
import { CostDeleteModal } from "@/components/vehicles/costs/cost-delete-modal";
import { CostKpiCards } from "@/components/vehicles/costs/cost-kpi-cards";
import { CostModal } from "@/components/vehicles/costs/cost-modal";
import { CostTable } from "@/components/vehicles/costs/cost-table";
import { CostViewModal } from "@/components/vehicles/costs/cost-view-modal";

interface CostsTabProps {
  vehicle: Vehicle;
  onRefresh: () => void;
}

export function CostsTab({ vehicle, onRefresh }: CostsTabProps) {
  const repository = useMemo(() => getVehicleRepository(), []);
  const kpis = useMemo(() => computeVehicleCostKPIs(vehicle), [vehicle]);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingCost, setViewingCost] = useState<VehicleCostEntry | null>(null);
  const [deletingCost, setDeletingCost] = useState<VehicleCostEntry | null>(
    null
  );
  const [editFormData, setEditFormData] = useState<
    VehicleCostFormData | undefined
  >();

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setEditFormData(undefined);
  };

  const handleAdd = () => {
    setEditingId(null);
    setEditFormData(undefined);
    setModalOpen(true);
  };

  const handleView = (cost: VehicleCostEntry) => {
    setViewingCost(cost);
    setViewOpen(true);
  };

  const handleEdit = (cost: VehicleCostEntry) => {
    setEditingId(cost.id);
    setEditFormData(costEntryToFormData(cost, vehicle.id));
    setViewOpen(false);
    setViewingCost(null);
    setModalOpen(true);
  };

  const handleDeleteRequest = (cost: VehicleCostEntry) => {
    setDeletingCost(cost);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCost) return;
    await repository.deleteCost(vehicle.id, deletingCost.id);
    setDeleteOpen(false);
    setDeletingCost(null);
    await onRefresh();
  };

  const handleSave = async (data: VehicleCostFormData) => {
    if (editingId) {
      await repository.updateCost(vehicle.id, editingId, data);
    } else {
      await repository.addCost(vehicle.id, data);
    }
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <CostKpiCards kpis={kpis} />

      <div className="flex justify-end">
        <Button size="sm" onClick={handleAdd}>
          Add Cost
        </Button>
      </div>

      <CostTable
        costs={vehicle.costs}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <CostModal
        key={editingId ?? "new"}
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialData={editFormData ?? createEmptyCostForm(vehicle.id)}
        isEditing={!!editingId}
        defaultVehicleId={vehicle.id}
        currentMileage={vehicle.currentMileage}
      />

      <CostViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setViewingCost(null);
        }}
        cost={viewingCost}
        onEdit={
          viewingCost ? () => handleEdit(viewingCost) : undefined
        }
      />

      <CostDeleteModal
        open={deleteOpen}
        cost={deletingCost}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingCost(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
