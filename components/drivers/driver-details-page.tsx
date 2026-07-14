"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Driver, DriverFormData } from "@/lib/types";
import { getDriverRepository } from "@/lib/drivers/service";
import { driverToFormData } from "@/lib/drivers/repository";
import { formatLanguages } from "@/lib/drivers/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { DriverModal } from "@/components/drivers/driver-modal";
import { DriverStatusBadge } from "@/components/drivers/driver-status-badge";
import { OverviewTab } from "@/components/drivers/details/overview-tab";
import { DocumentsTab } from "@/components/drivers/details/documents-tab";
import { AssignmentsTab } from "@/components/drivers/details/assignments-tab";
import { LeavesTab } from "@/components/drivers/details/leaves-tab";
import { NotesTab } from "@/components/drivers/details/notes-tab";

const DETAIL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents" },
  { id: "assignments", label: "Assignments" },
  { id: "leaves", label: "Leaves" },
  { id: "notes", label: "Notes" },
];

interface DriverDetailsPageProps {
  driverId: string;
}

export function DriverDetailsPage({ driverId }: DriverDetailsPageProps) {
  const router = useRouter();
  const repository = useMemo(() => getDriverRepository(), []);

  const [driver, setDriver] = useState<Driver | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);

  const loading = loadedId !== driverId;

  useEffect(() => {
    let cancelled = false;

    repository.getById(driverId).then((data) => {
      if (!cancelled) {
        setDriver(data);
        setLoadedId(driverId);
      }
    });

    return () => { cancelled = true; };
  }, [repository, driverId]);

  const refreshDriver = async () => {
    const data = await repository.getById(driverId);
    setDriver(data);
  };

  const handleSave = async (data: DriverFormData) => {
    await repository.update(driverId, data);
    await refreshDriver();
  };

  const handleSaveNotes = async (notes: string) => {
    await repository.update(driverId, { notes });
    await refreshDriver();
  };

  const handleDelete = async () => {
    await repository.delete(driverId);
    router.push("/drivers");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-border" />
          <div className="h-24 rounded-xl bg-border" />
          <div className="h-64 rounded-xl bg-border" />
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="mx-auto max-w-7xl text-center py-16">
        <p className="text-lg font-medium">Driver not found</p>
        <Link
          href="/drivers"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          Back to Drivers
        </Link>
      </div>
    );
  }

  const fullName = `${driver.personal.firstName} ${driver.personal.lastName}`;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Link
        href="/drivers"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Drivers
      </Link>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar src={driver.photoUrl} name={fullName} size="lg" />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">{fullName}</h2>
              <DriverStatusBadge status={driver.operational.status} />
            </div>
            <p className="mt-0.5 text-sm text-muted">
              {driver.personal.phone}
              {driver.personal.languages.length > 0 &&
                ` · ${formatLanguages(driver.personal.languages)}`}
            </p>
            {driver.operational.employeeId && (
              <p className="mt-0.5 text-xs text-muted">
                {driver.operational.employeeId}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Edit Driver
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="px-5 pt-4">
          <Tabs tabs={DETAIL_TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="p-5">
          {activeTab === "overview" && <OverviewTab driver={driver} />}
          {activeTab === "documents" && <DocumentsTab driver={driver} />}
          {activeTab === "assignments" && <AssignmentsTab driver={driver} />}
          {activeTab === "leaves" && <LeavesTab driver={driver} />}
          {activeTab === "notes" && (
            <NotesTab driver={driver} onSaveNotes={handleSaveNotes} />
          )}
        </div>
      </div>

      <DriverModal
        key={driver.id}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        initialData={driverToFormData(driver)}
        mode="edit"
      />
    </div>
  );
}
