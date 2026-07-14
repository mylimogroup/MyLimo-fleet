"use client";

import { useEffect, useMemo, useState } from "react";
import type { DriverFormData, DriverListItem, DriverStatus } from "@/lib/types";
import { getDriverRepository } from "@/lib/drivers/service";
import {
  createEmptyDriverForm,
  driverToFormData,
} from "@/lib/drivers/repository";
import { DriverModal } from "@/components/drivers/driver-modal";
import { DriverTable } from "@/components/drivers/driver-table";
import { DriverToolbar } from "@/components/drivers/driver-toolbar";

export function DriverListPage() {
  const repository = useMemo(() => getDriverRepository(), []);

  const [allDrivers, setAllDrivers] = useState<DriverListItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "all">("all");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<DriverFormData | undefined>();

  useEffect(() => {
    let cancelled = false;
    repository.list().then((data) => {
      if (!cancelled) setAllDrivers(data);
    });
    return () => { cancelled = true; };
  }, [repository]);

  const drivers = useMemo(() => {
    return allDrivers.filter((driver) => {
      if (statusFilter !== "all" && driver.status !== statusFilter) return false;
      if (vehicleFilter && driver.assignedVehicle?.id !== vehicleFilter) return false;
      if (languageFilter && !driver.languages.includes(languageFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${driver.fullName} ${driver.phone}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allDrivers, search, statusFilter, vehicleFilter, languageFilter]);

  const refreshDrivers = async () => {
    const data = await repository.list();
    setAllDrivers(data);
  };

  const handleAddDriver = () => {
    setEditingId(null);
    setEditFormData(undefined);
    setModalOpen(true);
  };

  const handleEdit = async (id: string) => {
    const driver = await repository.getById(id);
    if (!driver) return;
    setEditingId(id);
    setEditFormData(driverToFormData(driver));
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await repository.delete(id);
    await refreshDrivers();
  };

  const handleSave = async (data: DriverFormData) => {
    if (editingId) {
      await repository.update(editingId, data);
    } else {
      await repository.create(data);
    }
    await refreshDrivers();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Drivers</h2>
        <p className="mt-1 text-sm text-muted">
          Manage chauffeurs — documents, assignments, leaves and compliance
        </p>
      </div>

      <DriverToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        vehicleFilter={vehicleFilter}
        onVehicleFilterChange={setVehicleFilter}
        languageFilter={languageFilter}
        onLanguageFilterChange={setLanguageFilter}
        onAddDriver={handleAddDriver}
        totalCount={allDrivers.length}
        filteredCount={drivers.length}
      />

      <DriverTable
        drivers={drivers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DriverModal
        key={editingId ?? "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setEditFormData(undefined);
        }}
        onSave={handleSave}
        initialData={editFormData ?? createEmptyDriverForm()}
        mode={editingId ? "edit" : "create"}
      />
    </div>
  );
}
