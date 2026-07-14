"use client";

import { useEffect, useMemo, useState } from "react";
import type { VehicleFormData, VehicleListItem, VehicleStatus } from "@/lib/types";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { createEmptyVehicleForm } from "@/lib/vehicles/repository";
import { VehicleModal } from "@/components/vehicles/vehicle-modal";
import { VehicleTable } from "@/components/vehicles/vehicle-table";
import { VehicleToolbar } from "@/components/vehicles/vehicle-toolbar";

export function VehicleListPage() {
  const repository = useMemo(() => getVehicleRepository(), []);

  const [allVehicles, setAllVehicles] = useState<VehicleListItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");
  const [brandFilter, setBrandFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<VehicleFormData | undefined>();

  useEffect(() => {
    let cancelled = false;

    repository.list().then((data) => {
      if (!cancelled) setAllVehicles(data);
    });

    return () => {
      cancelled = true;
    };
  }, [repository]);

  const vehicles = useMemo(() => {
    return allVehicles.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (brandFilter && item.brand !== brandFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack =
          `${item.licensePlate} ${item.brand} ${item.model}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allVehicles, search, statusFilter, brandFilter]);

  const refreshVehicles = async () => {
    const data = await repository.list();
    setAllVehicles(data);
  };

  const handleAddVehicle = () => {
    setEditingId(null);
    setEditFormData(undefined);
    setModalOpen(true);
  };

  const handleEdit = async (id: string) => {
    const vehicle = await repository.getById(id);
    if (!vehicle) return;

    setEditingId(id);
    setEditFormData({
      photoUrl: vehicle.photoUrl,
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin,
      color: vehicle.color,
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      seats: vehicle.seats,
      currentMileage: vehicle.currentMileage,
      status: vehicle.status,
      deadlines: vehicle.deadlines,
      maintenance: vehicle.maintenance,
      tires: vehicle.tires,
      documents: vehicle.documents,
      costs: vehicle.costs,
      notes: vehicle.notes,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await repository.delete(id);
    await refreshVehicles();
  };

  const handleSave = async (data: VehicleFormData) => {
    if (editingId) {
      await repository.update(editingId, data);
    } else {
      await repository.create(data);
    }
    await refreshVehicles();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Vehicles</h2>
        <p className="mt-1 text-sm text-muted">
          Manage your fleet — registration, maintenance, deadlines and costs
        </p>
      </div>

      <VehicleToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        brandFilter={brandFilter}
        onBrandFilterChange={setBrandFilter}
        onAddVehicle={handleAddVehicle}
        totalCount={allVehicles.length}
        filteredCount={vehicles.length}
      />

      <VehicleTable
        vehicles={vehicles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <VehicleModal
        key={editingId ?? "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setEditFormData(undefined);
        }}
        onSave={handleSave}
        initialData={editFormData ?? createEmptyVehicleForm()}
        mode={editingId ? "edit" : "create"}
      />
    </div>
  );
}
