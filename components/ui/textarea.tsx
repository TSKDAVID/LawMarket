import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-none border border-espresso/20 bg-white px-4 py-3 font-body text-base leading-relaxed text-espresso",
          "placeholder:text-espresso/45 outline-none transition-colors duration-200",
          "hover:border-espresso/35 focus:border-burgundy",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
