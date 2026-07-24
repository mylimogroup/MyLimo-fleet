"use client";

import { useState } from "react";
import type { Vehicle, VehicleDocument, VehicleDocumentFormData } from "@/lib/types";
import { getDocumentCategoryLabel } from "@/lib/vehicles/documents";
import { daysUntil, formatDate } from "@/lib/vehicles/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentModal } from "@/components/vehicles/document-modal";

interface DocumentsTabProps {
  vehicle: Vehicle;
  onUpdateDocuments: (documents: VehicleDocument[]) => void;
}

function expirationVariant(days: number) {
  if (days <= 0) return "danger" as const;
  if (days <= 30) return "warning" as const;
  return "default" as const;
}

export function DocumentsTab({
  vehicle,
  onUpdateDocuments,
}: DocumentsTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VehicleDocument | null>(null);

  const handleSave = (data: VehicleDocumentFormData) => {
    const now = new Date().toISOString();
    if (editingDoc) {
      onUpdateDocuments(
        vehicle.documents.map((d) =>
          d.id === editingDoc.id
            ? { ...d, ...data, updatedAt: now }
            : d
        )
      );
    } else {
      onUpdateDocuments([
        ...vehicle.documents,
        {
          id: crypto.randomUUID(),
          ...data,
          createdAt: now,
          updatedAt: now,
        },
      ]);
    }
    setEditingDoc(null);
  };

  const handleDelete = (id: string) => {
    onUpdateDocuments(vehicle.documents.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditingDoc(null);
            setModalOpen(true);
          }}
        >
          Add Document
        </Button>
      </div>

      {vehicle.documents.length === 0 ? (
        <EmptyState
          icon={
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          }
          title="No documents on file"
          description="Add registration, insurance, inspection or tax documents"
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                {["Category", "Issue Date", "Expiration", "PDF", "Actions"].map(
                  (col) => (
                    <th
                      key={col}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted ${
                        col === "Actions" ? "text-right" : "text-left"
                      }`}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vehicle.documents.map((doc) => {
                const days = doc.expirationDate
                  ? daysUntil(doc.expirationDate)
                  : null;

                return (
                  <tr key={doc.id} className="hover:bg-background/40">
                    <td className="px-4 py-3 font-medium">
                      {getDocumentCategoryLabel(doc.category)}
                    </td>
                    <td className="px-4 py-3">
                      {doc.issueDate ? formatDate(doc.issueDate) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {doc.expirationDate ? (
                        <div className="flex items-center gap-2">
                          <span>{formatDate(doc.expirationDate)}</span>
                          <Badge variant={expirationVariant(days!)}>
                            {days! <= 0 ? "Expired" : `${days}d`}
                          </Badge>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {doc.pdfUrl ? (
                        <a
                          href={doc.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {doc.pdfName ?? "Open PDF"}
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDoc(doc);
                            setModalOpen(true);
                          }}
                          className="rounded-lg p-2 text-muted hover:text-foreground"
                          aria-label="Edit document"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id)}
                          className="rounded-lg p-2 text-muted hover:text-red-600"
                          aria-label="Delete document"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <DocumentModal
        key={editingDoc?.id ?? "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDoc(null);
        }}
        onSave={handleSave}
        initialData={editingDoc ?? undefined}
        mode={editingDoc ? "edit" : "create"}
      />
    </div>
  );
}
