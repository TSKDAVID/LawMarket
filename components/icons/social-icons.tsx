import type { SVGProps } from "react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.5-1.5H16.5V4.3c-.27-.04-1.2-.3-2.3-.3-2.3 0-3.7 1.4-3.7 3.9V10.5h-2.5v3h2.5V21h3z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.15" cy="6.85" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 8.5H4.06V20h2.88V8.5zM5.5 4a1.67 1.67 0 1 0 0 3.34A1.67 1.67 0 0 0 5.5 4zM20 20v-6.35c0-3.4-1.81-4.98-4.23-4.98a3.65 3.65 0 0 0-3.31 1.82V8.5H9.58c.04.85 0 11.5 0 11.5h2.88v-6.42c0-.34.02-.68.12-.93.28-.68.9-1.39 1.96-1.39 1.38 0 1.94 1.05 1.94 2.6V20H20z" />
    </svg>
  );
}
