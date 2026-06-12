import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    as?: "button";
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    as: "a";
  };

type ButtonAsSpan = ButtonBaseProps &
  Omit<React.HTMLAttributes<HTMLSpanElement>, keyof ButtonBaseProps> & {
    as: "span";
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsSpan;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "gradient-primary text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:shadow-sm",
  secondary:
    "border-2 border-indigo-500 text-indigo-600 bg-transparent hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30",
  ghost:
    "text-[var(--foreground)] bg-transparent hover:bg-[var(--surface-hover)] active:bg-[var(--muted)]",
  danger:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm shadow-red-500/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-4 py-2 text-sm gap-2 rounded-xl",
  lg: "px-6 py-3 text-base gap-2.5 rounded-xl",
};

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    as,
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    className,
    children,
    ...rest
  } = props as ButtonBaseProps & {
    as?: "button" | "a" | "span";
    className?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
  };

  const classes = cn(
    "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    variantStyles[variant],
    sizeStyles[size],
    loading && "opacity-70 pointer-events-none",
    className
  );

  const content = (
    <>
      {loading ? (
        <Loader2 className="animate-spin shrink-0" size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
    </>
  );

  if (as === "a") {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  if (as === "span") {
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={classes}
        {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {content}
      </span>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={loading || (rest as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
