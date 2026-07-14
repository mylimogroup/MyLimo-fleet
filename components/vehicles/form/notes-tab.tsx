"use client";

import type { VehicleFormData } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

interface NotesTabProps {
  data: VehicleFormData;
  onChange: (data: Partial<VehicleFormData>) => void;
}

export function NotesTab({ data, onChange }: NotesTabProps) {
  return (
    <Textarea
      label="Notes"
      value={data.notes}
      onChange={(e) => onChange({ notes: e.target.value })}
      placeholder="Internal notes about this vehicle — assignments, condition, special requirements..."
      className="min-h-[200px]"
    />
  );
}
