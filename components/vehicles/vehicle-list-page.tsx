"use client";

import { useEffect, useMemo, useState } from "react";
import type { VehicleFormData, VehicleListItem } from "@/lib/types";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { VehicleModal } from "@/components/vehicles/vehicle-modal";
import { VehicleTable } from "@/components/vehicles/vehicle-table";
import { VehicleToolbar } from "@/components/vehicles/vehicle-toolbar";

export function VehicleListPage() {
  const repository = useMemo(() => getVehicleRepository(), []);

  const [allVehicles, setAllVehicles] = useState<VehicleListItem[]>([]);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    repository.list().then((data) => {
      if (!cancelled) setAllVehicles(data);
    });
    return () => { cancelled = true; };
  }, [repository]);

  const vehicles = useMemo(() => {
    return allVehicles.filter((item) => {
      if (brandFilter && item.brand !== brandFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack =
          `${item.licensePlate} ${item.brand} ${item.model} ${item.version}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allVehicles, search, brandFilter]);

  const refreshVehicles = async () => {
    const data = await repository.list();
    setAllVehicles(data);
  };

  const handleSave = async (data: VehicleFormData) => {
    await repository.create(data);
    await refreshVehicles();
  };

  const handleDelete = async (id: string) => {
    await repository.delete(id);
    await refreshVehicles();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Vehicles</h2>
        <p className="mt-1 text-sm text-muted">
          Fleet registry — identification, documents, maintenance and costs
        </p>
      </div>

      <VehicleToolbar
        search={search}
        onSearchChange={setSearch}
        brandFilter={brandFilter}
        onBrandFilterChange={setBrandFilter}
        onAddVehicle={() => setModalOpen(true)}
        totalCount={allVehicles.length}
        filteredCount={vehicles.length}
      />

      <VehicleTable vehicles={vehicles} onDelete={handleDelete} />

      <VehicleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        mode="create"
      />
    </div>
  );
}
