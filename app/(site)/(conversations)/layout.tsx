import getConversations from "@/app/actions/getConversations";
import ConversationList from "./components/ConversationList";
import getUsers from "@/app/actions/getUsers";
import getSession from "@/app/actions/getSession";

export default async ({ children }: { children: React.ReactNode }) => {
  const conversations = await getConversations();
  const users = await getUsers();
  const user = await getSession();
    
  return (
    <div className="h-full">
      <ConversationList
        users={users!}
        initialItems={conversations!}
        userEmail={user?.user?.email!}
      />
      {children}
    </div>
  );
};
