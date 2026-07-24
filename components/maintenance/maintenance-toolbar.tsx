"use client";

import type { MaintenanceCategory, MaintenanceStatus } from "@/lib/types";
import { MAINTENANCE_CATEGORIES } from "@/lib/maintenance/constants";
import { vehicleBrands } from "@/lib/vehicles/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

interface MaintenanceToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  brandFilter: string;
  onBrandFilterChange: (value: string) => void;
  categoryFilter: MaintenanceCategory | "all";
  onCategoryFilterChange: (value: MaintenanceCategory | "all") => void;
  statusFilter: MaintenanceStatus | "all";
  onStatusFilterChange: (value: MaintenanceStatus | "all") => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  onAddRecord: () => void;
  totalCount: number;
  filteredCount: number;
}

export function MaintenanceToolbar({
  search,
  onSearchChange,
  brandFilter,
  onBrandFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onAddRecord,
  totalCount,
  filteredCount,
}: MaintenanceToolbarProps) {
  const hasFilters =
    search !== "" ||
    brandFilter !== "" ||
    categoryFilter !== "all" ||
    statusFilter !== "all" ||
    dateFrom !== "" ||
    dateTo !== "";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            placeholder="Search vehicle, plate or workshop..."
            className="sm:max-w-sm"
          />

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={brandFilter}
              onChange={(e) => onBrandFilterChange(e.target.value)}
              options={[
                { value: "", label: "All brands" },
                ...vehicleBrands.map((b) => ({ value: b, label: b })),
              ]}
              aria-label="Filter by brand"
              className="w-auto min-w-[140px]"
            />
            <Select
              value={categoryFilter}
              onChange={(e) =>
                onCategoryFilterChange(
                  e.target.value as MaintenanceCategory | "all"
                )
              }
              options={[
                { value: "all", label: "All types" },
                ...MAINTENANCE_CATEGORIES.map((c) => ({
                  value: c.value,
                  label: c.label,
                })),
              ]}
              aria-label="Filter by maintenance type"
              className="w-auto min-w-[160px]"
            />
            <Select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as MaintenanceStatus | "all")
              }
              options={[
                { value: "all", label: "All statuses" },
                { value: "scheduled", label: "Scheduled" },
                { value: "in_progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
                { value: "overdue", label: "Overdue" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              aria-label="Filter by status"
              className="w-auto min-w-[140px]"
            />
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <Input
              label="From"
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="w-auto min-w-[150px]"
            />
            <Input
              label="To"
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="w-auto min-w-[150px]"
            />
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                  onBrandFilterChange("");
                  onCategoryFilterChange("all");
                  onStatusFilterChange("all");
                  onDateFromChange("");
                  onDateToChange("");
                }}
                className="mb-2.5 text-xs font-medium text-muted hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <Button onClick={onAddRecord} className="shrink-0">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Record
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted">
        Showing {filteredCount} of {totalCount} records
      </p>
    </div>
  );
}
