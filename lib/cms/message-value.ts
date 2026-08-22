import en from "@/messages/en.json";
import ka from "@/messages/ka.json";

/** Read a dot-path value from the static message JSON (e.g. home.heroTitle). */
export function getStaticMessageValue(
  key: string,
  lang: "en" | "ka"
): string {
  const root = lang === "ka" ? ka : en;
  const parts = key.split(".");
  let cur: unknown = root;
  for (const part of parts) {
    if (typeof cur !== "object" || cur === null) return "";
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : "";
}
