import type { DriverStatus } from "@/lib/types";
import { getDriverStatusLabel } from "@/lib/drivers/utils";
import { Badge } from "@/components/ui/badge";

interface DriverStatusBadgeProps {
  status: DriverStatus;
}

const statusVariants: Record<
  DriverStatus,
  "success" | "info" | "warning" | "default"
> = {
  active: "success",
  on_duty: "info",
  on_leave: "warning",
  inactive: "default",
};

export function DriverStatusBadge({ status }: DriverStatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]}>
      {getDriverStatusLabel(status)}
    </Badge>
  );
}
