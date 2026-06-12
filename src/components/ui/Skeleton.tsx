import React from "react";
import { cn } from "@/lib/cn";

type SkeletonVariant = "text" | "card" | "avatar" | "table";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  lines?: number;
  width?: string;
  height?: string;
}

function SkeletonLine({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("skeleton h-4 rounded-md", className)}
      style={style}
    />
  );
}

export function Skeleton({
  variant = "text",
  lines = 1,
  width,
  height,
  className,
  ...props
}: SkeletonProps) {
  if (variant === "avatar") {
    return (
      <div
        className={cn("skeleton rounded-full shrink-0", className)}
        style={{
          width: width || "40px",
          height: height || "40px",
        }}
        {...props}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "skeleton rounded-2xl",
          className
        )}
        style={{
          width: width || "100%",
          height: height || "200px",
        }}
        {...props}
      />
    );
  }

  if (variant === "table") {
    const rowCount = lines || 5;
    return (
      <div className={cn("w-full space-y-3", className)} {...props}>
        {/* Header row */}
        <div className="flex gap-4 pb-3 border-b border-[var(--border-color)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLine
              key={`header-${i}`}
              className="h-3 flex-1"
            />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4 py-2">
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <SkeletonLine
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 flex-1"
                style={{
                  width: `${60 + Math.random() * 40}%`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Text variant
  return (
    <div className={cn("w-full space-y-2.5", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          style={{
            width:
              width ||
              (i === lines - 1 && lines > 1 ? "70%" : "100%"),
          }}
        />
      ))}
    </div>
  );
}

export default Skeleton;
