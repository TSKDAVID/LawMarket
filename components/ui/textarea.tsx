import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-2xl border border-espresso/15 bg-white px-5 py-4 font-body text-sm text-espresso placeholder:text-espresso/40 outline-none transition-colors focus:border-burgundy",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
