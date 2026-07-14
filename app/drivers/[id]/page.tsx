import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DriverDetailsPage } from "@/components/drivers/driver-details-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Driver ${id} — MyLimo Fleet`,
    description: "Driver details for MyLimo chauffeur company.",
  };
}

export default async function DriverDetailRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardShell>
      <DriverDetailsPage driverId={id} />
    </DashboardShell>
  );
}
