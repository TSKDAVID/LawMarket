import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Chat, type ChatMessage } from "@/components/dashboard/chat";
import { cn } from "@/lib/utils";

type ConversationRow = {
  id: string;
  client_id: string;
  provider_id: string;
  client: { full_name: string } | null;
  provider: { profiles: { full_name: string } | null } | null;
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c: activeId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const t = await getTranslations("dashboard.messages");

  const { data } = await supabase
    .from("conversations")
    .select(
      `id, client_id, provider_id,
       client:profiles!conversations_client_id_fkey ( full_name ),
       provider:provider_profiles ( profiles ( full_name ) )`,
    )
    .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const conversations = (data ?? []) as unknown as ConversationRow[];
  const active =
    conversations.find((conv) => conv.id === activeId) ?? conversations[0];

  let initialMessages: ChatMessage[] = [];
  if (active) {
    const { data: messages } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, body, created_at")
      .eq("conversation_id", active.id)
      .order("created_at")
      .limit(200);
    initialMessages = (messages ?? []) as ChatMessage[];
  }

  const otherName = (conv: ConversationRow) =>
    conv.client_id === user.id
      ? (conv.provider?.profiles?.full_name ?? "")
      : (conv.client?.full_name ?? "");

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-slate-900">
        {t("title")}
      </h1>

      {conversations.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">{t("empty")}</p>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="space-y-1 lg:col-span-1">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/dashboard/messages?c=${conv.id}`}
                className={cn(
                  "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  active?.id === conv.id
                    ? "bg-brand-900 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100",
                )}
              >
                {otherName(conv)}
              </Link>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-2">
            {active ? (
              <>
                <div className="border-b border-slate-100 px-4 py-3 font-semibold text-slate-900">
                  {otherName(active)}
                </div>
                <Chat
                  conversationId={active.id}
                  currentUserId={user.id}
                  initialMessages={initialMessages}
                />
              </>
            ) : (
              <p className="p-8 text-center text-sm text-slate-500">
                {t("selectConversation")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
