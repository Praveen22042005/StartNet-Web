import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
        success: 
          "border-transparent bg-green-50 text-green-700 border border-green-100 hover:bg-green-100",
        warning:
          "border-transparent bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100",
        info:
          "border-transparent bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100",
        indigo: 
          "border-transparent bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100",
        purple:
          "border-transparent bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };