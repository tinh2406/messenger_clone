"use client";

import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import { FullConversationType } from "@/app/types";
import { User } from "@prisma/client";
import { useState } from "react";
import useConversation from "@/app/hooks/useConversation";
import GroupChatModal from "./GroupChatModal";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  userEmail: string;
}

export default ({ initialItems, users, userEmail }: ConversationListProps) => {
  const [items, setItems] = useState(initialItems);
  const { isOpen, conversationId } = useConversation();
  const [groupChatOpen, setGroupChatOpen] = useState(false);

  return (
    <>
      <GroupChatModal
        isOpen={groupChatOpen}
        onClose={() => {
          setGroupChatOpen(false);
        }}
        users={users}
      />
      <aside
        className={clsx(
          `
          bg-white            
            fixed
            inset-y-0
            pb-14
            lg:pb-0
            lg:left-20
            md:w-80
            md:block
            overflow-y-auto
            border-r
            border-gray-200
            `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-8">Messages</div>
            <div
              className="
                        rounded-full
                        p-2
                        bg-gray-100 
                        text-gray-600 
                        cursor-pointer 
                        hover:opacity-75 
                        transition"
              onClick={() => {
                setGroupChatOpen(true);
              }}
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
              userEmail={userEmail}
            />
          ))}
        </div>
      </aside>
    </>
  );
};
