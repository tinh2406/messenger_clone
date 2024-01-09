import clsx from "clsx";
import getConversations from "@/app/actions/getConversations";
import ConversationListClient from "./components/ConversationListClient";
import GroupChatModal from "./components/GroupChatModal";
import getUsers from "@/app/actions/getUsers";
import getSession from "@/app/actions/getSession";

export default async ({ children }: { children: React.ReactNode }) => {
  const conversations = await getConversations();
  const session = await getSession();
  const users = await getUsers();

  const userEmail = session?.user?.email;
  const userId = session?.user?.id;

  return (
    <div className="h-full">
      <aside
        className={clsx(
          `
          bg-white            
            fixed
            inset-y-0
            h-[calc(100%-3.5rem)]
            lg:h-full
            lg:left-20
            w-full
            md:w-[22rem]
            block
            overflow-y-auto
            border-r
            border-gray-200
            `
        )}
      >
        <div className="px-5 flex justify-between pt-4 pb-[12px] h-16 border-b-[1px] shadow-sm">
          <div className="text-2xl font-bold text-neutral-800">Message</div>

          <GroupChatModal users={users.data} />
        </div>
        <ConversationListClient
          userEmail={userEmail!}
          initData={conversations}
          userId={userId!}
        />
      </aside>
      {children}
    </div>
  );
};
