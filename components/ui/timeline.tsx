import type { ReactNode } from "react";

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  status?: ReactNode;
  children: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  if (items.length === 0) return null;

  return (
    <div className="relative space-y-0">
      {items.map((item, index) => (
        <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
          {index < items.length - 1 && (
            <div className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-border" />
          )}
          <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
          <div className="min-w-0 flex-1 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-muted">{item.date}</p>
                <h4 className="mt-0.5 text-sm font-semibold">{item.title}</h4>
                {item.subtitle && (
                  <p className="mt-0.5 text-xs text-muted">{item.subtitle}</p>
                )}
              </div>
              {item.status}
            </div>
            <div className="mt-4">{item.children}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
