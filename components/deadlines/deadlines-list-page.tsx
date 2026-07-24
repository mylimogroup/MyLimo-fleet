"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ComputedDeadline,
  DeadlineKPIs,
  DeadlineTriggerType,
  DeadlineUrgency,
  FleetDeadlineRow,
  MaintenanceFormData,
  VehicleDeadlineCategory,
  VehicleDeadlineFormData,
} from "@/lib/types";
import {
  computeDeadlineKPIs,
  computeFleetDeadlines,
  createEmptyDeadlineForm,
  createMaintenanceFormFromDeadline,
  deadlineToFormData,
} from "@/lib/vehicles/deadlines";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { getMaintenanceRepository } from "@/lib/maintenance/service";
import { DeadlineKpiCards } from "@/components/deadlines/deadline-kpi-cards";
import { DeadlineModal } from "@/components/deadlines/deadline-modal";
import { DeadlineTable } from "@/components/deadlines/deadline-table";
import { DeadlineToolbar } from "@/components/deadlines/deadline-toolbar";
import { MaintenanceModal } from "@/components/maintenance/maintenance-modal";

type DeadlineRow = ComputedDeadline | FleetDeadlineRow;

function isFleetRow(row: DeadlineRow): row is FleetDeadlineRow {
  return "vehicleId" in row;
}

export function DeadlinesListPage() {
  const repository = useMemo(() => getVehicleRepository(), []);
  const maintenanceRepository = useMemo(() => getMaintenanceRepository(), []);

  const [allRows, setAllRows] = useState<FleetDeadlineRow[]>([]);
  const [kpis, setKpis] = useState<DeadlineKPIs>({
    overdue: 0,
    dueWithin7Days: 0,
    dueWithin30Days: 0,
    mileageAlerts: 0,
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    VehicleDeadlineCategory | "all"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    DeadlineUrgency | "all"
  >("all");
  const [triggerFilter, setTriggerFilter] = useState<
    DeadlineTriggerType | "all"
  >("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<FleetDeadlineRow | null>(null);
  const [editFormData, setEditFormData] = useState<
    VehicleDeadlineFormData | undefined
  >();

  const [completeOpen, setCompleteOpen] = useState(false);
  const [completingRow, setCompletingRow] = useState<FleetDeadlineRow | null>(
    null
  );
  const [completeFormData, setCompleteFormData] = useState<
    MaintenanceFormData | undefined
  >();

  const loadData = async () => {
    const vehicles = await Promise.all(
      (await repository.list()).map((v) => repository.getById(v.id))
    );
    const valid = vehicles.filter((v): v is NonNullable<typeof v> => v !== null);
    const rows = computeFleetDeadlines(valid);
    setAllRows(rows);
    setKpis(computeDeadlineKPIs(rows));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const vehicles = await Promise.all(
        (await repository.list()).map((v) => repository.getById(v.id))
      );
      if (cancelled) return;
      const valid = vehicles.filter((v): v is NonNullable<typeof v> => v !== null);
      const rows = computeFleetDeadlines(valid);
      setAllRows(rows);
      setKpis(computeDeadlineKPIs(rows));
    })();
    return () => { cancelled = true; };
  }, [repository]);

  const rows = useMemo(() => {
    return allRows.filter((row) => {
      if (categoryFilter !== "all" && row.category !== categoryFilter)
        return false;
      if (priorityFilter !== "all" && row.urgency !== priorityFilter)
        return false;
      if (triggerFilter !== "all" && row.triggerType !== triggerFilter)
        return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack =
          `${row.vehicleBrand} ${row.vehicleModel} ${row.licensePlate} ${row.label}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allRows, search, categoryFilter, priorityFilter, triggerFilter]);

  const handleAdd = () => {
    setEditingRow(null);
    setEditFormData(undefined);
    setModalOpen(true);
  };

  const handleEdit = async (row: DeadlineRow) => {
    if (!isFleetRow(row)) return;
    const vehicle = await repository.getById(row.vehicleId);
    if (!vehicle) return;
    const stored = vehicle.deadlines.find((d) => d.id === row.id);
    if (!stored) return;
    setEditingRow(row);
    setEditFormData(deadlineToFormData(stored, row.vehicleId));
    setModalOpen(true);
  };

  const handleDelete = async (row: DeadlineRow) => {
    if (!isFleetRow(row)) return;
    await repository.deleteDeadline(row.vehicleId, row.id);
    await loadData();
  };

  const handleSave = async (data: VehicleDeadlineFormData) => {
    if (editingRow) {
      await repository.updateDeadline(editingRow.vehicleId, editingRow.id, data);
    } else {
      await repository.addDeadline(data.vehicleId, data);
    }
    await loadData();
  };

  const handleComplete = async (row: DeadlineRow) => {
    if (!isFleetRow(row)) return;
    const form = createMaintenanceFormFromDeadline(
      row,
      row.vehicleId,
      row.currentMileage
    );
    if (!form) return;
    setCompletingRow(row);
    setCompleteFormData(form);
    setCompleteOpen(true);
  };

  const handleCompleteSave = async (data: MaintenanceFormData) => {
    await maintenanceRepository.create(data);
    await loadData();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Deadlines</h2>
        <p className="mt-1 text-sm text-muted">
          Vehicle compliance and maintenance schedule — sorted by urgency
        </p>
      </div>

      <DeadlineKpiCards kpis={kpis} />

      <DeadlineToolbar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        triggerFilter={triggerFilter}
        onTriggerFilterChange={setTriggerFilter}
        onAddDeadline={handleAdd}
        totalCount={allRows.length}
        filteredCount={rows.length}
      />

      <DeadlineTable
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />

      <DeadlineModal
        key={editingRow?.id ?? "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRow(null);
          setEditFormData(undefined);
        }}
        onSave={handleSave}
        initialData={editFormData ?? createEmptyDeadlineForm()}
        isEditing={!!editingRow}
      />

      <MaintenanceModal
        key={completingRow?.id ?? "complete"}
        open={completeOpen}
        onClose={() => {
          setCompleteOpen(false);
          setCompletingRow(null);
          setCompleteFormData(undefined);
        }}
        onSave={handleCompleteSave}
        initialData={completeFormData}
        mode="complete"
        defaultVehicleId={completingRow?.vehicleId}
        lockVehicle
        lockCategory
        completeLabel={
          completingRow ? `Complete ${completingRow.label}` : undefined
        }
      />
    </div>
  );
}
