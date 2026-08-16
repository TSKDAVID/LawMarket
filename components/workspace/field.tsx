import type { ReactNode } from "react";

export function Field({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-sm text-espresso"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
