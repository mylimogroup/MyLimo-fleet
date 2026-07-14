"use client";

import type { DriverFile, DriverFormData } from "@/lib/types";
import { FileUpload } from "@/components/ui/file-upload";
import { Select } from "@/components/ui/select";

interface UploadsTabProps {
  data: DriverFormData;
  onChange: (data: Partial<DriverFormData>) => void;
}

const categoryOptions = [
  { value: "identity", label: "Identity" },
  { value: "license", label: "License" },
  { value: "contract", label: "Contract" },
  { value: "medical", label: "Medical" },
  { value: "other", label: "Other" },
];

export function UploadsTab({ data, onChange }: UploadsTabProps) {
  const addFiles = (files: File[], type: DriverFile["type"]) => {
    const newFiles: DriverFile[] = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type,
      category: "other",
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    }));
    onChange({ files: [...data.files, ...newFiles] });
  };

  const updateFileCategory = (id: string, category: DriverFile["category"]) => {
    onChange({
      files: data.files.map((f) => (f.id === id ? { ...f, category } : f)),
    });
  };

  const removeFile = (id: string) => {
    onChange({ files: data.files.filter((f) => f.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FileUpload
          label="Upload PDF"
          accept=".pdf,application/pdf"
          multiple
          onFilesSelected={(files) => addFiles(files, "pdf")}
          hint="Contracts, licenses, medical certificates"
        />
        <FileUpload
          label="Upload Images"
          accept="image/*"
          multiple
          onFilesSelected={(files) => addFiles(files, "image")}
          hint="ID scans, license photos"
        />
      </div>

      {data.files.length > 0 && (
        <div className="rounded-xl border border-border">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium">
              Uploaded files ({data.files.length})
            </p>
          </div>
          <ul className="divide-y divide-border">
            {data.files.map((file) => (
              <li
                key={file.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted">
                    {file.type === "pdf" ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H5.25A2.25 2.25 0 0 0 3 5.25v13.5A2.25 2.25 0 0 0 5.25 21Z" />
                      </svg>
                    )}
                  </div>
                  <span className="truncate text-sm">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={file.category}
                    onChange={(e) =>
                      updateFileCategory(
                        file.id,
                        e.target.value as DriverFile["category"]
                      )
                    }
                    options={categoryOptions}
                    aria-label={`Category for ${file.name}`}
                    className="min-w-[120px]"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="rounded p-1 text-muted hover:text-red-600"
                    aria-label={`Remove ${file.name}`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
