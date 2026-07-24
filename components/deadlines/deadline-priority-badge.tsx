import type { DeadlineUrgency } from "@/lib/types";
import {
  getUrgencyLabel,
  urgencyBadgeVariant,
} from "@/lib/vehicles/deadlines";
import { Badge } from "@/components/ui/badge";

interface DeadlinePriorityBadgeProps {
  urgency: DeadlineUrgency;
}

export function DeadlinePriorityBadge({ urgency }: DeadlinePriorityBadgeProps) {
  return (
    <Badge variant={urgencyBadgeVariant(urgency)}>
      {getUrgencyLabel(urgency)}
    </Badge>
  );
}
