"use client";

import { useEffect, useState } from "react";
import type { DriverStatus } from "@/lib/types";
import { DRIVER_LANGUAGES } from "@/lib/drivers/data";
import { getVehicleRepository } from "@/lib/vehicles/service";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

interface DriverToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: DriverStatus | "all";
  onStatusFilterChange: (value: DriverStatus | "all") => void;
  vehicleFilter: string;
  onVehicleFilterChange: (value: string) => void;
  languageFilter: string;
  onLanguageFilterChange: (value: string) => void;
  onAddDriver: () => void;
  totalCount: number;
  filteredCount: number;
}

export function DriverToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  vehicleFilter,
  onVehicleFilterChange,
  languageFilter,
  onLanguageFilterChange,
  onAddDriver,
  totalCount,
  filteredCount,
}: DriverToolbarProps) {
  const [vehicles, setVehicles] = useState<
    { value: string; label: string }[]
  >([{ value: "", label: "All vehicles" }]);

  useEffect(() => {
    getVehicleRepository()
      .list()
      .then((list) => {
        setVehicles([
          { value: "", label: "All vehicles" },
          ...list.map((v) => ({
            value: v.id,
            label: v.licensePlate,
          })),
        ]);
      });
  }, []);

  const hasFilters =
    statusFilter !== "all" ||
    vehicleFilter !== "" ||
    languageFilter !== "" ||
    search !== "";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            placeholder="Search by name or phone..."
            className="sm:max-w-xs"
          />

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as DriverStatus | "all")
              }
              options={[
                { value: "all", label: "All statuses" },
                { value: "active", label: "Active" },
                { value: "on_duty", label: "On Duty" },
                { value: "on_leave", label: "On Leave" },
                { value: "inactive", label: "Inactive" },
              ]}
              aria-label="Filter by status"
              className="w-auto min-w-[140px]"
            />
            <Select
              value={vehicleFilter}
              onChange={(e) => onVehicleFilterChange(e.target.value)}
              options={vehicles}
              aria-label="Filter by vehicle"
              className="w-auto min-w-[140px]"
            />
            <Select
              value={languageFilter}
              onChange={(e) => onLanguageFilterChange(e.target.value)}
              options={[
                { value: "", label: "All languages" },
                ...DRIVER_LANGUAGES.map((l) => ({ value: l, label: l })),
              ]}
              aria-label="Filter by language"
              className="w-auto min-w-[140px]"
            />
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                  onStatusFilterChange("all");
                  onVehicleFilterChange("");
                  onLanguageFilterChange("");
                }}
                className="text-xs font-medium text-muted hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <Button onClick={onAddDriver} className="shrink-0">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Driver
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted">
        Showing {filteredCount} of {totalCount} drivers
      </p>
    </div>
  );
}
