"use client";

import {
  createContext,
  useContext,
  type ElementType,
  type ReactNode,
} from "react";
import type { CmsTextStyle } from "@/lib/cms/text-style";
import { cmsStyleClasses } from "@/lib/cms/text-style";
import { cn } from "@/lib/utils";

const CmsStyleContext = createContext<Record<string, CmsTextStyle>>({});
const CmsTextContext = createContext<Record<string, string>>({});

export function CmsStyleProvider({
  styles,
  texts,
  children,
}: {
  styles: Record<string, CmsTextStyle>;
  texts?: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <CmsTextContext.Provider value={texts ?? {}}>
      <CmsStyleContext.Provider value={styles}>{children}</CmsStyleContext.Provider>
    </CmsTextContext.Provider>
  );
}

export function useCmsStyle(contentKey: string) {
  return useContext(CmsStyleContext)[contentKey];
}

export function useCmsText(contentKey: string, fallback?: string) {
  const cms = useContext(CmsTextContext)[contentKey];
  if (cms) return cms;
  return fallback ?? "";
}

function resolveChildText(children: ReactNode, cmsText?: string) {
  if (cmsText) return cmsText;
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  return children;
}

export function CmsStyledText({
  contentKey,
  className,
  as: Component = "span",
  children,
}: {
  contentKey: string;
  className?: string;
  as?: ElementType;
  children: ReactNode;
}) {
  const style = useCmsStyle(contentKey);
  const cmsText = useContext(CmsTextContext)[contentKey];
  const content = resolveChildText(children, cmsText);

  return (
    <Component className={cn(className, cmsStyleClasses(style, contentKey))}>
      {content}
    </Component>
  );
}
