"use client";

import type { VehicleStatus } from "@/lib/types";
import { vehicleBrands } from "@/lib/vehicles/data";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

interface VehicleToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: VehicleStatus | "all";
  onStatusFilterChange: (value: VehicleStatus | "all") => void;
  brandFilter: string;
  onBrandFilterChange: (value: string) => void;
  onAddVehicle: () => void;
  totalCount: number;
  filteredCount: number;
}

export function VehicleToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  brandFilter,
  onBrandFilterChange,
  onAddVehicle,
  totalCount,
  filteredCount,
}: VehicleToolbarProps) {
  const hasFilters = statusFilter !== "all" || brandFilter !== "" || search !== "";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            placeholder="Search by plate, brand or model..."
            className="sm:max-w-xs"
          />

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as VehicleStatus | "all")
              }
              options={[
                { value: "all", label: "All statuses" },
                { value: "available", label: "Available" },
                { value: "in_use", label: "In Use" },
                { value: "maintenance", label: "Maintenance" },
              ]}
              aria-label="Filter by status"
              className="w-auto min-w-[140px]"
            />
            <Select
              value={brandFilter}
              onChange={(e) => onBrandFilterChange(e.target.value)}
              options={[
                { value: "", label: "All brands" },
                ...vehicleBrands.map((b) => ({ value: b, label: b })),
              ]}
              aria-label="Filter by brand"
              className="w-auto min-w-[160px]"
            />
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                  onStatusFilterChange("all");
                  onBrandFilterChange("");
                }}
                className="text-xs font-medium text-muted hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <Button onClick={onAddVehicle} className="shrink-0">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Vehicle
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted">
        Showing {filteredCount} of {totalCount} vehicles
      </p>
    </div>
  );
}
