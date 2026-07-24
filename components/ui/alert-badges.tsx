import type { MaintenanceAlert } from "@/lib/types";
import { urgencyBadgeVariant } from "@/lib/vehicles/deadlines";
import { Badge } from "@/components/ui/badge";

interface AlertBadgesProps {
  alerts: MaintenanceAlert[];
  max?: number;
}

export function AlertBadges({ alerts, max = 3 }: AlertBadgesProps) {
  if (alerts.length === 0) return null;

  const visible = alerts.slice(0, max);
  const remaining = alerts.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((alert, i) => (
        <span key={`${alert.type}-${alert.label}-${i}`} title={alert.message}>
          <Badge variant={urgencyBadgeVariant(alert.urgency)}>
            {alert.label}
          </Badge>
        </span>
      ))}
      {remaining > 0 && (
        <Badge variant="default">+{remaining}</Badge>
      )}
    </div>
  );
}
