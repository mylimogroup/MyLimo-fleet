"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  MaintenanceAlert,
  MaintenanceCategory,
  MaintenanceFormData,
  MaintenanceKPIs,
  MaintenanceListItem,
  MaintenanceStatus,
} from "@/lib/types";
import { getMaintenanceRepository, getMaintenanceAlerts, getMaintenanceKPIs } from "@/lib/maintenance/service";
import {
  createEmptyMaintenanceForm,
  recordToFormData,
} from "@/lib/maintenance/repository";
import { MaintenanceKpiCards } from "@/components/maintenance/maintenance-kpi-cards";
import { MaintenanceModal } from "@/components/maintenance/maintenance-modal";
import { MaintenanceTable } from "@/components/maintenance/maintenance-table";
import { MaintenanceToolbar } from "@/components/maintenance/maintenance-toolbar";

export function MaintenanceListPage() {
  const repository = useMemo(() => getMaintenanceRepository(), []);

  const [allRecords, setAllRecords] = useState<MaintenanceListItem[]>([]);
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [kpis, setKpis] = useState<MaintenanceKPIs>({
    vehiclesInMaintenance: 0,
    upcomingServices: 0,
    overdueMaintenance: 0,
    monthlyMaintenanceCosts: 0,
  });

  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    MaintenanceCategory | "all"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    MaintenanceStatus | "all"
  >("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<
    MaintenanceFormData | undefined
  >();

  useEffect(() => {
    let cancelled = false;
    repository.list().then((data) => {
      if (!cancelled) {
        setAllRecords(data);
        setKpis(getMaintenanceKPIs());
        setAlerts(getMaintenanceAlerts());
      }
    });
    return () => { cancelled = true; };
  }, [repository]);

  const refresh = async () => {
    const data = await repository.list();
    setAllRecords(data);
    setKpis(getMaintenanceKPIs());
    setAlerts(getMaintenanceAlerts());
  };

  const records = useMemo(() => {
    return allRecords.filter((record) => {
      if (brandFilter && record.vehicleBrand !== brandFilter) return false;
      if (categoryFilter !== "all" && record.category !== categoryFilter)
        return false;
      if (statusFilter !== "all" && record.status !== statusFilter)
        return false;
      if (dateFrom && record.scheduledDate < dateFrom) return false;
      if (dateTo && record.scheduledDate > dateTo) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack =
          `${record.vehicleBrand} ${record.vehicleModel} ${record.licensePlate} ${record.workshop}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [
    allRecords,
    search,
    brandFilter,
    categoryFilter,
    statusFilter,
    dateFrom,
    dateTo,
  ]);

  const handleAdd = () => {
    setEditingId(null);
    setEditFormData(undefined);
    setModalOpen(true);
  };

  const handleEdit = async (id: string) => {
    const record = await repository.getById(id);
    if (!record) return;
    setEditingId(id);
    setEditFormData(recordToFormData(record));
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await repository.delete(id);
    await refresh();
  };

  const handleSave = async (data: MaintenanceFormData) => {
    if (editingId) {
      await repository.update(editingId, data);
    } else {
      await repository.create(data);
    }
    await refresh();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Maintenance</h2>
        <p className="mt-1 text-sm text-muted">
          Fleet service history, compliance deadlines and workshop operations
        </p>
      </div>

      <MaintenanceKpiCards kpis={kpis} />

      <MaintenanceToolbar
        search={search}
        onSearchChange={setSearch}
        brandFilter={brandFilter}
        onBrandFilterChange={setBrandFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onAddRecord={handleAdd}
        totalCount={allRecords.length}
        filteredCount={records.length}
      />

      <MaintenanceTable
        records={records}
        alerts={alerts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MaintenanceModal
        key={editingId ?? "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setEditFormData(undefined);
        }}
        onSave={handleSave}
        initialData={editFormData ?? createEmptyMaintenanceForm()}
        mode={editingId ? "edit" : "create"}
      />
    </div>
  );
}
