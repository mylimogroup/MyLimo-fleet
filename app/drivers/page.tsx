import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DriverListPage } from "@/components/drivers/driver-list-page";

export const metadata = {
  title: "Drivers — MyLimo Fleet",
  description: "Driver management for MyLimo chauffeur company.",
};

export default function DriversPage() {
  return (
    <DashboardShell>
      <DriverListPage />
    </DashboardShell>
  );
}
