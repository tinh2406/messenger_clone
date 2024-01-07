"use client";

import AvatarGroup from "@/app/components/AvatarGroup";
import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { ConversationType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useMemo } from "react";
import Link from "next/link";
import useConversation from "@/app/hooks/useConversation";

interface ConversationBoxProps {
  data: ConversationType;
  userEmail: string;
}

export default ({ data, userEmail }: ConversationBoxProps) => {
  const otherUser = useOtherUser(data, userEmail);
  const { conversationId } = useConversation();

  const hasSeen = useMemo(() => {
    if (!data.lastMessage) {
      return false;
    }
    const seenArray = data.lastMessage.seen || [];
    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [data.lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (data.lastMessage?.image) {
      return "Sent an image";
    }
    if (data.lastMessage?.body) {
      return data.lastMessage.body;
    }
    return "";
  }, [data.lastMessage]);

  return (
    <Link
      href={`/${data.id}`}
      className={clsx(
        `
          w-full
          relative
          flex
          items-center
          space-x-3
          p-3
          hover:bg-neutral-300
          rounded-lg
          transition
          cursor-pointer`,
        conversationId === data.id ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        otherUser && <Avatar user={otherUser} />
      )}
      <div className="flex min-w-0 flex-1">
        <div className="focus:outline-none w-full">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-semibold text-gray-900">
              {data.name || otherUser?.name || ""}
            </p>
            {data.lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(data.lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `truncate text-sm`,
              hasSeen ? "font-light" : "font-bold"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </Link>
  );
};
