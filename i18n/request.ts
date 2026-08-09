import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "./routing";
import { getMessagesForLocale } from "./messages";
import { getIntlMessageFallback, onIntlError } from "./intl-shared";

export { getIntlMessageFallback, onIntlError } from "./intl-shared";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: getMessagesForLocale(locale as Locale),
    onError: onIntlError,
    getMessageFallback: getIntlMessageFallback,
  };
});
