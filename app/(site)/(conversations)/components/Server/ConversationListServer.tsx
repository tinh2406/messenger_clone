import getConversations from "@/app/actions/getConversations";
import getSession from "@/app/actions/getSession";
import ConversationListClient from "../Client/ConversationListClient";

export default async () => {
  const data = await getConversations();
  const session = await getSession();

  const userEmail = session?.user?.email;
  
  return <ConversationListClient userEmail={userEmail!} initData={data} />
};
