"use client";

import type { VehicleCostEntry, VehicleFormData } from "@/lib/types";
import { formatCurrency } from "@/lib/vehicles/utils";
import { Button } from "@/components/ui/button";

interface CostsTabProps {
  data: VehicleFormData;
  onChange: (data: Partial<VehicleFormData>) => void;
}

const emptyCost = (): VehicleCostEntry => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString().split("T")[0],
  description: "",
  supplier: "",
  cost: 0,
});

export function CostsTab({ data, onChange }: CostsTabProps) {
  const updateCost = (
    id: string,
    field: keyof Omit<VehicleCostEntry, "id">,
    value: string | number
  ) => {
    onChange({
      costs: data.costs.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const addCost = () => {
    onChange({ costs: [...data.costs, emptyCost()] });
  };

  const removeCost = (id: string) => {
    onChange({ costs: data.costs.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          Maintenance cost history for this vehicle
        </p>
        <Button variant="secondary" size="sm" onClick={addCost}>
          Add entry
        </Button>
      </div>

      {data.costs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <p className="text-sm text-muted">No cost entries yet</p>
          <Button variant="secondary" size="sm" onClick={addCost} className="mt-3">
            Add first entry
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border bg-background/60">
                <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Description</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Supplier</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Cost</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.costs.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateCost(entry.id, "date", e.target.value)}
                      className="h-8 w-full rounded border border-border bg-card px-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={entry.description}
                      onChange={(e) => updateCost(entry.id, "description", e.target.value)}
                      placeholder="Service description"
                      className="h-8 w-full rounded border border-border bg-card px-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={entry.supplier}
                      onChange={(e) => updateCost(entry.id, "supplier", e.target.value)}
                      placeholder="Supplier"
                      className="h-8 w-full rounded border border-border bg-card px-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={entry.cost || ""}
                      onChange={(e) =>
                        updateCost(entry.id, "cost", Number(e.target.value) || 0)
                      }
                      placeholder="0"
                      min={0}
                      className="h-8 w-full rounded border border-border bg-card px-2 text-right text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => removeCost(entry.id)}
                      className="rounded p-1 text-muted hover:text-red-600"
                      aria-label="Remove cost entry"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-background/60">
                <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium">
                  Total
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold">
                  {formatCurrency(
                    data.costs.reduce((sum, c) => sum + c.cost, 0)
                  )}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
