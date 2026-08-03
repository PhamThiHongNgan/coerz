import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          // Variants
          variant === "default" &&
            "bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30",
          variant === "secondary" &&
            "bg-surface-800 text-surface-100 hover:bg-surface-700 border border-white/[0.06]",
          variant === "outline" &&
            "border border-white/[0.1] bg-transparent text-surface-100 hover:bg-white/[0.04] hover:border-white/[0.15]",
          variant === "ghost" &&
            "bg-transparent text-surface-300 hover:text-surface-100 hover:bg-white/[0.04]",
          variant === "gradient" &&
            "bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 hover:brightness-110",
          // Sizes
          size === "sm" && "h-8 px-3 text-sm rounded-lg",
          size === "md" && "h-10 px-5 text-sm",
          size === "lg" && "h-12 px-8 text-base",
          size === "icon" && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
