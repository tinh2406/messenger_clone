import getConversations from "@/app/actions/getConversations";
import ConversationBox from "./ConversationBox";
import getSession from "@/app/actions/getSession";

export default async () => {
  const conversations = await getConversations();
  const session = await getSession();

  const userEmail = session?.user?.email;
  
  return conversations.map((item) => (
    <ConversationBox key={item.id} data={item} userEmail={userEmail!} />
  ));
};
