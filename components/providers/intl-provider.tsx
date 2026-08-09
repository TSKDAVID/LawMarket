"use client";

import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getIntlMessageFallback, onIntlError } from "@/i18n/intl-shared";

type IntlProviderProps = {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
};

export function IntlProvider({ children, locale, messages }: IntlProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={onIntlError}
      getMessageFallback={getIntlMessageFallback}
    >
      {children}
    </NextIntlClientProvider>
  );
}
