import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          variant === "default" &&
            "bg-primary-500/15 text-primary-300 border border-primary-500/20",
          variant === "success" &&
            "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
          variant === "warning" &&
            "bg-amber-500/15 text-amber-300 border border-amber-500/20",
          variant === "error" &&
            "bg-red-500/15 text-red-300 border border-red-500/20",
          variant === "outline" &&
            "border border-white/[0.1] text-surface-300",
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
