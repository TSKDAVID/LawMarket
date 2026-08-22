"use client";

import { createContext, useContext, type ElementType, type ReactNode } from "react";
import type { CmsTextStyle } from "@/lib/cms/text-style";
import { cmsStyleClasses } from "@/lib/cms/text-style";
import { cn } from "@/lib/utils";

const CmsStyleContext = createContext<Record<string, CmsTextStyle>>({});

export function CmsStyleProvider({
  styles,
  children,
}: {
  styles: Record<string, CmsTextStyle>;
  children: ReactNode;
}) {
  return (
    <CmsStyleContext.Provider value={styles}>{children}</CmsStyleContext.Provider>
  );
}

export function useCmsStyle(contentKey: string) {
  return useContext(CmsStyleContext)[contentKey];
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
  return (
    <Component className={cn(className, cmsStyleClasses(style))}>
      {children}
    </Component>
  );
}
