import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "icon";

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-primary-600 text-white shadow-sm hover:bg-primary-700 disabled:bg-primary-300",
  outline:
    "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 disabled:text-slate-400",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 disabled:text-slate-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-9 px-3 text-sm",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
