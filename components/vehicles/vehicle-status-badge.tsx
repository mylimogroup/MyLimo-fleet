import type { VehicleStatus } from "@/lib/types";
import { getStatusLabel } from "@/lib/vehicles/utils";
import { Badge } from "@/components/ui/badge";

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
}

const statusVariants: Record<
  VehicleStatus,
  "success" | "info" | "warning"
> = {
  available: "success",
  in_use: "info",
  maintenance: "warning",
};

export function VehicleStatusBadge({ status }: VehicleStatusBadgeProps) {
  return <Badge variant={statusVariants[status]}>{getStatusLabel(status)}</Badge>;
}
