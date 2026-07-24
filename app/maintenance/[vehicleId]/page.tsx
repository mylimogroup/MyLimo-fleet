import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { VehicleMaintenanceDetailPage } from "@/components/maintenance/vehicle-maintenance-detail-page";

interface PageProps {
  params: Promise<{ vehicleId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { vehicleId } = await params;
  return {
    title: `Maintenance — ${vehicleId} — MyLimo Fleet`,
    description: "Vehicle maintenance history for MyLimo fleet.",
  };
}

export default async function VehicleMaintenancePage({ params }: PageProps) {
  const { vehicleId } = await params;

  return (
    <DashboardShell>
      <VehicleMaintenanceDetailPage vehicleId={vehicleId} />
    </DashboardShell>
  );
}
