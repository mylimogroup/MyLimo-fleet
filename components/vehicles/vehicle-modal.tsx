"use client";

import { useState } from "react";
import type { VehicleFormData } from "@/lib/types";
import { createEmptyVehicleForm } from "@/lib/vehicles/repository";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { CostsTab } from "@/components/vehicles/form/costs-tab";
import { DeadlinesTab } from "@/components/vehicles/form/deadlines-tab";
import { DocumentsTab } from "@/components/vehicles/form/documents-tab";
import { GeneralTab } from "@/components/vehicles/form/general-tab";
import { MaintenanceTab } from "@/components/vehicles/form/maintenance-tab";
import { NotesTab } from "@/components/vehicles/form/notes-tab";
import { TiresTab } from "@/components/vehicles/form/tires-tab";

const MODAL_TABS = [
  { id: "general", label: "General" },
  { id: "deadlines", label: "Deadlines" },
  { id: "maintenance", label: "Maintenance" },
  { id: "tires", label: "Tires" },
  { id: "documents", label: "Documents" },
  { id: "costs", label: "Costs" },
  { id: "notes", label: "Notes" },
];

interface VehicleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: VehicleFormData) => void;
  initialData?: VehicleFormData;
  mode?: "create" | "edit";
}

export function VehicleModal({
  open,
  onClose,
  onSave,
  initialData,
  mode = "create",
}: VehicleModalProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState<VehicleFormData>(
    initialData ?? createEmptyVehicleForm()
  );

  const handleChange = (partial: Partial<VehicleFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const handleSave = () => {
    if (!formData.licensePlate.trim() || !formData.brand.trim() || !formData.model.trim()) {
      setActiveTab("general");
      return;
    }
    onSave(formData);
    setFormData(createEmptyVehicleForm());
    setActiveTab("general");
    onClose();
  };

  const handleClose = () => {
    setFormData(initialData ?? createEmptyVehicleForm());
    setActiveTab("general");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === "create" ? "Add Vehicle" : "Edit Vehicle"}
      subtitle="Complete all relevant sections for accurate fleet records"
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "create" ? "Add Vehicle" : "Save Changes"}
          </Button>
        </>
      }
    >
      <Tabs tabs={MODAL_TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "general" && (
          <GeneralTab data={formData} onChange={handleChange} />
        )}
        {activeTab === "deadlines" && (
          <DeadlinesTab data={formData} onChange={handleChange} />
        )}
        {activeTab === "maintenance" && (
          <MaintenanceTab data={formData} onChange={handleChange} />
        )}
        {activeTab === "tires" && (
          <TiresTab data={formData} onChange={handleChange} />
        )}
        {activeTab === "documents" && (
          <DocumentsTab data={formData} onChange={handleChange} />
        )}
        {activeTab === "costs" && (
          <CostsTab data={formData} onChange={handleChange} />
        )}
        {activeTab === "notes" && (
          <NotesTab data={formData} onChange={handleChange} />
        )}
      </div>
    </Modal>
  );
}
