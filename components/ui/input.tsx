import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-none border border-espresso/20 bg-white px-4 font-body text-base text-espresso",
          "placeholder:text-espresso/45 outline-none transition-colors duration-200",
          "hover:border-espresso/35 focus:border-burgundy focus:bg-white",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
