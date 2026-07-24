import type { MaintenanceStatus } from "@/lib/types";
import { getStatusLabel } from "@/lib/maintenance/utils";
import { Badge } from "@/components/ui/badge";

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus;
}

const statusVariants: Record<
  MaintenanceStatus,
  "default" | "info" | "success" | "warning" | "danger"
> = {
  scheduled: "default",
  in_progress: "info",
  completed: "success",
  overdue: "danger",
  cancelled: "warning",
};

export function MaintenanceStatusBadge({ status }: MaintenanceStatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]}>
      {getStatusLabel(status)}
    </Badge>
  );
}
