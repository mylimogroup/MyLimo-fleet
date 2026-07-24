import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DeadlinesListPage } from "@/components/deadlines/deadlines-list-page";

export const metadata = {
  title: "Deadlines — MyLimo Fleet",
  description: "Vehicle compliance and maintenance deadlines for MyLimo fleet.",
};

export default function DeadlinesPage() {
  return (
    <DashboardShell>
      <DeadlinesListPage />
    </DashboardShell>
  );
}
