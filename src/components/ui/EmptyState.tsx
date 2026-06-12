import React from "react";
import { cn } from "@/lib/cn";
import { Inbox } from "lucide-react";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in",
        className
      )}
      {...props}
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-5">
        {icon || (
          <Inbox
            size={28}
            className="text-[var(--muted-fg)]"
          />
        )}
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--muted-fg)] max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
