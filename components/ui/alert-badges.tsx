import type { MaintenanceAlert } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface AlertBadgesProps {
  alerts: MaintenanceAlert[];
  max?: number;
}

const alertLabels: Record<MaintenanceAlert["type"], string> = {
  service_overdue: "Service Overdue",
  insurance_expiring: "Insurance",
  road_tax_expiring: "Road Tax",
  inspection_expiring: "Inspection",
  oil_service_due: "Oil Service",
};

export function AlertBadges({ alerts, max = 3 }: AlertBadgesProps) {
  if (alerts.length === 0) return null;

  const visible = alerts.slice(0, max);
  const remaining = alerts.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((alert, i) => (
        <span key={`${alert.type}-${i}`} title={alert.message}>
          <Badge
            variant={alert.severity === "danger" ? "danger" : "warning"}
          >
            {alertLabels[alert.type]}
          </Badge>
        </span>
      ))}
      {remaining > 0 && (
        <Badge variant="default">+{remaining}</Badge>
      )}
    </div>
  );
}
