import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DossierIconProps = {
  name?: string;
  className?: string;
};

function IconFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {children}
    </svg>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
};

function BuildingIcon({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M4 20V8l8-4 8 4v12" {...stroke} />
      <path d="M9 20V12h6v8" {...stroke} />
      <path d="M4 20h16" {...stroke} />
    </IconFrame>
  );
}

function FiguresIcon({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <circle cx="9" cy="7" r="2.25" {...stroke} />
      <path d="M4.5 19v-2.5C4.5 14.57 6.07 13 8 13h2" {...stroke} />
      <circle cx="16" cy="8" r="2" {...stroke} />
      <path d="M12.5 19v-2c0-1.66 1.34-3 3-3h1.5c1.66 0 3 1.34 3 3V19" {...stroke} />
    </IconFrame>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path d="M4 12h16" {...stroke} />
      <path d="M12 4c2.5 3 3.5 6 3.5 8s-1 5-3.5 8c-2.5-3-3.5-6-3.5-8s1-5 3.5-8Z" {...stroke} />
    </IconFrame>
  );
}

function HouseIcon({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M3.5 11.5 12 4l8.5 7.5" {...stroke} />
      <path d="M6 10.5V20h12V10.5" {...stroke} />
      <path d="M10 20v-6h4v6" {...stroke} />
    </IconFrame>
  );
}

function ColumnsIcon({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M4 8h16" {...stroke} />
      <path d="M5 8v10" {...stroke} />
      <path d="M12 8v10" {...stroke} />
      <path d="M19 8v10" {...stroke} />
      <path d="M3 20h18" {...stroke} />
      <path d="M7 4h10" {...stroke} />
    </IconFrame>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M7 3.5h7l5 5V20.5H7V3.5Z" {...stroke} />
      <path d="M14 3.5V9h5" {...stroke} />
      <path d="M10 13h6" {...stroke} />
      <path d="M10 16.5h4" {...stroke} />
    </IconFrame>
  );
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M12 4v16" {...stroke} />
      <path d="M8 20h8" {...stroke} />
      <path d="M12 6h8l-2.5 5H14.5L12 6Z" {...stroke} />
      <path d="M12 6H4l2.5 5h3L12 6Z" {...stroke} />
    </IconFrame>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M12 3.5 5 6.5v6c0 4.2 3 7.2 7 8.5 4-1.3 7-4.3 7-8.5v-6L12 3.5Z" {...stroke} />
      <path d="M12 8v7" {...stroke} />
    </IconFrame>
  );
}

function SealIcon({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <circle cx="12" cy="11" r="5.5" {...stroke} />
      <circle cx="12" cy="11" r="2" {...stroke} />
      <path d="M9.5 16 8 21l4-1.5L16 21l-1.5-5" {...stroke} />
    </IconFrame>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path d="M12 8v4.5l3 2" {...stroke} />
    </IconFrame>
  );
}

const icons: Record<string, (props: { className?: string }) => ReactNode> = {
  briefcase: BuildingIcon,
  users: FiguresIcon,
  globe: GlobeIcon,
  home: HouseIcon,
  "file-text": DocumentIcon,
  landmark: ColumnsIcon,
  shield: ShieldIcon,
  stamp: SealIcon,
};

export function DossierIcon({ name, className }: DossierIconProps) {
  const Icon = (name && icons[name]) || ScaleIcon;
  return <Icon className={className} />;
}

export function ConsultationClockIcon({ className }: { className?: string }) {
  return <ClockIcon className={className} />;
}
