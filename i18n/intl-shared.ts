export function onIntlError(error: { code: string; message: string }) {
  if (error.code === "MISSING_MESSAGE") {
    console.error(`[i18n] Missing message: ${error.message}`);
  }
}

export function getIntlMessageFallback({
  namespace,
  key,
}: {
  namespace?: string;
  key: string;
}) {
  return namespace ? `${namespace}.${key}` : key;
}
