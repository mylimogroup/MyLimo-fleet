import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardPageContent />
    </DashboardShell>
  );
}
