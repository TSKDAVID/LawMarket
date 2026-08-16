import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-full border border-espresso/15 bg-white px-5 font-body text-sm text-espresso placeholder:text-espresso/55 outline-none transition-colors focus:border-burgundy",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
