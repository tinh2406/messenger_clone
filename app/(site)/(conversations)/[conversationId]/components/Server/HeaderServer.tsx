import getConversationById from "@/app/actions/getConversationById";
import getSession from "@/app/actions/getSession";
import HeaderClient from "../Client/HeaderClient";

interface HeaderServerProps {
  conversationId: string;
}

export default async ({ conversationId }: HeaderServerProps) => {
  const session = await getSession();
  const conversation = await getConversationById(conversationId, session!);
  if (!conversation) return null
  return (
    <HeaderClient
      conversation={conversation!}
      userEmail={session!.user!.email!}
    />
  );
};
