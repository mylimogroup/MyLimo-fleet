import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { VehicleDetailPage } from "@/components/vehicles/vehicle-detail-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Vehicle ${id} — MyLimo Fleet`,
    description: "Vehicle details for MyLimo fleet management.",
  };
}

export default async function VehicleDetailRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardShell>
      <VehicleDetailPage vehicleId={id} />
    </DashboardShell>
  );
}
