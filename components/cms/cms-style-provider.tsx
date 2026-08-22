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
  const texts = useContext(CmsTextContext);
  if (contentKey in texts) {
    return texts[contentKey];
  }
  return fallback ?? "";
}

export function hasCmsTextOverride(contentKey: string) {
  return contentKey in useContext(CmsTextContext);
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
  const texts = useContext(CmsTextContext);
  const style = useCmsStyle(contentKey);
  const hasOverride = contentKey in texts;
  const cmsText = texts[contentKey];

  if (hasOverride && !cmsText.trim()) {
    return null;
  }

  const content = hasOverride
    ? cmsText
    : resolveChildText(children, undefined);

  return (
    <Component className={cn(className, cmsStyleClasses(style, contentKey))}>
      {content}
    </Component>
  );
}
