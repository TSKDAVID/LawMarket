import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import { MarkMessageHandledButton } from "@/components/admin/mark-message-handled";
import { createClient } from "@/lib/supabase/server";
import type { ContactMessageRow } from "@/lib/supabase/database.types";
import type { Locale } from "@/i18n/routing";

export default async function AdminContentMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("admin.content");

  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const messages = (data ?? []) as ContactMessageRow[];

  return (
    <>
      <WorkspaceHeading
        title={t("messagesTitle")}
        description={t("messagesBody")}
      />

      {messages.length === 0 ? (
        <p className="font-body text-sm text-espresso/70">{t("messagesEmpty")}</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="rounded-card border border-espresso/10 bg-white/50 px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading font-semibold text-espresso">
                    {msg.subject}
                  </p>
                  <p className="mt-1 font-body text-sm text-espresso/70">
                    {msg.name} · {msg.email}
                  </p>
                  <p className="mt-1 font-mono text-xs text-espresso/50">
                    {new Date(msg.created_at).toLocaleString(locale)}
                  </p>
                </div>
                {!msg.handled && (
                  <MarkMessageHandledButton locale={locale} id={msg.id} />
                )}
                {msg.handled && (
                  <span className="font-mono text-xs text-espresso/50">
                    {t("handled")}
                  </span>
                )}
              </div>
              <p className="mt-3 font-body text-sm leading-relaxed text-espresso/80">
                {msg.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
