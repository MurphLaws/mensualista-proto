"use client";
import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...rest }, ref) => (
    <select
      ref={ref}
      className={cn("input appearance-none bg-white pr-9", className)}
      {...rest}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
