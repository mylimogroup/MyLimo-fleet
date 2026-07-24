"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

interface MileageUpdateModalProps {
  open: boolean;
  onClose: () => void;
  currentMileage: number;
  onSave: (mileage: number) => void;
}

export function MileageUpdateModal({
  open,
  onClose,
  currentMileage,
  onSave,
}: MileageUpdateModalProps) {
  const [mileage, setMileage] = useState(String(currentMileage));

  const handleSave = () => {
    const value = Number(mileage);
    if (!value || value < currentMileage) return;
    onSave(value);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Mileage"
      subtitle={`Current reading: ${currentMileage.toLocaleString("it-IT")} km`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Update Mileage</Button>
        </>
      }
    >
      <Input
        label="New Mileage (km)"
        type="number"
        value={mileage}
        onChange={(e) => setMileage(e.target.value)}
        min={currentMileage}
      />
    </Modal>
  );
}
