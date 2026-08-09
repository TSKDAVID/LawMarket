"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ServiceFaq } from "@/data/types";
import { cn } from "@/lib/utils";

type ServiceFaqListProps = {
  items: ServiceFaq[];
};

export function ServiceFaqList({ items }: ServiceFaqListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-espresso/8 border-y border-espresso/8">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left font-heading text-base font-semibold text-espresso transition-colors hover:text-burgundy"
              aria-expanded={open}
            >
              {item.q}
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-espresso/40 transition-transform",
                  open && "rotate-180"
                )}
              />
            </button>
            {open && (
              <p className="pb-4 font-body text-sm leading-relaxed text-espresso/50">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
