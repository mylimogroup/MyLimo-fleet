"use client";

import { useState } from "react";
import type { VehicleDocument, VehicleDocumentFormData } from "@/lib/types";
import { VEHICLE_DOCUMENT_CATEGORIES } from "@/lib/vehicles/documents";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: VehicleDocumentFormData) => void;
  initialData?: VehicleDocument;
  mode?: "create" | "edit";
}

function emptyForm(): VehicleDocumentFormData {
  return {
    category: "insurance",
    issueDate: null,
    expirationDate: null,
    pdfUrl: null,
    pdfName: null,
  };
}

export function DocumentModal({
  open,
  onClose,
  onSave,
  initialData,
  mode = "create",
}: DocumentModalProps) {
  const [formData, setFormData] = useState<VehicleDocumentFormData>(() =>
    initialData
      ? {
          category: initialData.category,
          issueDate: initialData.issueDate,
          expirationDate: initialData.expirationDate,
          pdfUrl: initialData.pdfUrl,
          pdfName: initialData.pdfName,
        }
      : emptyForm()
  );

  const handleSave = () => {
    onSave(formData);
    setFormData(emptyForm());
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Add Document" : "Edit Document"}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "create" ? "Add Document" : "Save Changes"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              category: e.target.value as VehicleDocumentFormData["category"],
            }))
          }
          options={VEHICLE_DOCUMENT_CATEGORIES.map((c) => ({
            value: c.value,
            label: c.label,
          }))}
        />
        <Input
          label="Issue Date"
          type="date"
          value={formData.issueDate ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              issueDate: e.target.value || null,
            }))
          }
        />
        <Input
          label="Expiration Date"
          type="date"
          value={formData.expirationDate ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              expirationDate: e.target.value || null,
            }))
          }
        />
        <FileUpload
          label="PDF Attachment"
          accept=".pdf,application/pdf"
          onFilesSelected={(files) => {
            const file = files[0];
            if (file) {
              setFormData((prev) => ({
                ...prev,
                pdfUrl: URL.createObjectURL(file),
                pdfName: file.name,
              }));
            }
          }}
          hint="PDF only"
        />
        {formData.pdfName && (
          <p className="text-sm text-muted">Attached: {formData.pdfName}</p>
        )}
      </div>
    </Modal>
  );
}
