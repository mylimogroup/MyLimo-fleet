"use client";

import { useState } from "react";
import type { DriverFormData } from "@/lib/types";
import { createEmptyDriverForm } from "@/lib/drivers/repository";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { DocumentsTab } from "@/components/drivers/form/documents-tab";
import { OperationalTab } from "@/components/drivers/form/operational-tab";
import { PersonalTab } from "@/components/drivers/form/personal-tab";
import { UploadsTab } from "@/components/drivers/form/uploads-tab";

const MODAL_TABS = [
  { id: "personal", label: "Personal Data" },
  { id: "documents", label: "Documents" },
  { id: "operational", label: "Operational" },
  { id: "uploads", label: "File Uploads" },
];

interface DriverModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DriverFormData) => void;
  initialData?: DriverFormData;
  mode?: "create" | "edit";
}

export function DriverModal({
  open,
  onClose,
  onSave,
  initialData,
  mode = "create",
}: DriverModalProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState<DriverFormData>(
    initialData ?? createEmptyDriverForm()
  );

  const handleChange = (partial: Partial<DriverFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const handleSave = () => {
    if (
      !formData.personal.firstName.trim() ||
      !formData.personal.lastName.trim() ||
      !formData.personal.phone.trim()
    ) {
      setActiveTab("personal");
      return;
    }
    onSave(formData);
    setFormData(createEmptyDriverForm());
    setActiveTab("personal");
    onClose();
  };

  const handleClose = () => {
    setFormData(initialData ?? createEmptyDriverForm());
    setActiveTab("personal");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === "create" ? "Add Driver" : "Edit Driver"}
      subtitle="Complete all sections for accurate driver records"
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "create" ? "Add Driver" : "Save Changes"}
          </Button>
        </>
      }
    >
      <Tabs tabs={MODAL_TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "personal" && (
          <PersonalTab data={formData} onChange={handleChange} />
        )}
        {activeTab === "documents" && (
          <DocumentsTab data={formData} onChange={handleChange} />
        )}
        {activeTab === "operational" && (
          <OperationalTab data={formData} onChange={handleChange} />
        )}
        {activeTab === "uploads" && (
          <UploadsTab data={formData} onChange={handleChange} />
        )}
      </div>
    </Modal>
  );
}
