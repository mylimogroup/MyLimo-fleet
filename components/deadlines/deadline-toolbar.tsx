"use client";

import type {
  DeadlineTriggerType,
  DeadlineUrgency,
  VehicleDeadlineCategory,
} from "@/lib/types";
import { DEADLINE_CATEGORIES } from "@/lib/vehicles/deadlines";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

interface DeadlineToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: VehicleDeadlineCategory | "all";
  onCategoryFilterChange: (value: VehicleDeadlineCategory | "all") => void;
  priorityFilter: DeadlineUrgency | "all";
  onPriorityFilterChange: (value: DeadlineUrgency | "all") => void;
  triggerFilter: DeadlineTriggerType | "all";
  onTriggerFilterChange: (value: DeadlineTriggerType | "all") => void;
  onAddDeadline: () => void;
  totalCount: number;
  filteredCount: number;
}

export function DeadlineToolbar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  triggerFilter,
  onTriggerFilterChange,
  onAddDeadline,
  totalCount,
  filteredCount,
}: DeadlineToolbarProps) {
  const hasFilters =
    search !== "" ||
    categoryFilter !== "all" ||
    priorityFilter !== "all" ||
    triggerFilter !== "all";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            placeholder="Search vehicle or plate..."
            className="sm:max-w-sm"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={categoryFilter}
              onChange={(e) =>
                onCategoryFilterChange(
                  e.target.value as VehicleDeadlineCategory | "all"
                )
              }
              options={[
                { value: "all", label: "All types" },
                ...DEADLINE_CATEGORIES.map((c) => ({
                  value: c.value,
                  label: c.label,
                })),
              ]}
              aria-label="Filter by deadline type"
              className="w-auto min-w-[180px]"
            />
            <Select
              value={priorityFilter}
              onChange={(e) =>
                onPriorityFilterChange(e.target.value as DeadlineUrgency | "all")
              }
              options={[
                { value: "all", label: "All priorities" },
                { value: "overdue", label: "Critical" },
                { value: "urgent", label: "Urgent" },
                { value: "approaching", label: "Approaching" },
                { value: "normal", label: "OK" },
              ]}
              aria-label="Filter by priority"
              className="w-auto min-w-[150px]"
            />
            <Select
              value={triggerFilter}
              onChange={(e) =>
                onTriggerFilterChange(
                  e.target.value as DeadlineTriggerType | "all"
                )
              }
              options={[
                { value: "all", label: "All triggers" },
                { value: "date", label: "Date based" },
                { value: "mileage", label: "Mileage based" },
                { value: "both", label: "Date + Mileage" },
              ]}
              aria-label="Filter by trigger type"
              className="w-auto min-w-[160px]"
            />
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                  onCategoryFilterChange("all");
                  onPriorityFilterChange("all");
                  onTriggerFilterChange("all");
                }}
                className="text-xs font-medium text-muted hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
        <Button onClick={onAddDeadline} className="shrink-0">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Deadline
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted">
        Showing {filteredCount} of {totalCount} deadlines — sorted by urgency
      </p>
    </div>
  );
}
