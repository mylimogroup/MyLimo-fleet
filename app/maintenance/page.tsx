import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MaintenanceListPage } from "@/components/maintenance/maintenance-list-page";

export const metadata = {
  title: "Maintenance — MyLimo Fleet",
  description: "Fleet maintenance management for MyLimo chauffeur company.",
};

export default function MaintenancePage() {
  return (
    <DashboardShell>
      <MaintenanceListPage />
    </DashboardShell>
  );
}
