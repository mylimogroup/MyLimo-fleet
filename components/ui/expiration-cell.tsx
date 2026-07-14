import { daysUntil, formatDate, getExpirationUrgency } from "@/lib/drivers/utils";
import { Badge } from "@/components/ui/badge";

interface ExpirationCellProps {
  date: string | null;
}

export function ExpirationCell({ date }: ExpirationCellProps) {
  if (!date) {
    return <span className="text-sm text-muted">—</span>;
  }

  const remaining = daysUntil(date);
  const urgency = getExpirationUrgency(remaining);
  const variant =
    urgency === "danger" ? "danger" : urgency === "warning" ? "warning" : "default";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{formatDate(date)}</span>
      <Badge variant={variant}>
        {remaining <= 0 ? "Expired" : `${remaining}d`}
      </Badge>
    </div>
  );
}
