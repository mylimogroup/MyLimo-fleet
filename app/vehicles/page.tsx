import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { VehicleListPage } from "@/components/vehicles/vehicle-list-page";

export const metadata = {
  title: "Vehicles — MyLimo Fleet",
  description: "Fleet vehicle management for MyLimo chauffeur company.",
};

export default function VehiclesPage() {
  return (
    <DashboardShell>
      <VehicleListPage />
    </DashboardShell>
  );
}
