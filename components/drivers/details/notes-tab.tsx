"use client";

import { useState } from "react";
import type { Driver } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface NotesTabProps {
  driver: Driver;
  onSaveNotes?: (notes: string) => void;
}

export function NotesTab({ driver, onSaveNotes }: NotesTabProps) {
  const [notes, setNotes] = useState(driver.notes);
  const [dirty, setDirty] = useState(false);

  const handleSave = () => {
    onSaveNotes?.(notes);
    setDirty(false);
  };

  return (
    <div className="space-y-4">
      <Textarea
        label="Internal Notes"
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setDirty(true);
        }}
        placeholder="Internal notes about this driver — performance, preferences, compliance reminders..."
        className="min-h-[240px]"
      />
      {onSaveNotes && dirty && (
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSave}>
            Save Notes
          </Button>
        </div>
      )}
    </div>
  );
}
