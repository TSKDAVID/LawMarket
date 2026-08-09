import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: "GEL" = "GEL") {
  const symbol = currency === "GEL" ? "₾" : currency;
  return `${symbol}${price.toLocaleString("en-US")}`;
}
