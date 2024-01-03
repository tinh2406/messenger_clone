"use client";

import AvatarGroup from "@/app/components/AvatarGroup";
import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
  userEmail: string;
}

export default ({ data, selected, userEmail }: ConversationBoxProps) => {
  const otherUser = useOtherUser(data, userEmail);
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/${data.id}`);
  }, [data.id, router]);
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[0];
  }, [data.messages]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }
    const seenArray = lastMessage.seen || [];
    if (!userEmail) {
      return false;
    }
    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [lastMessage, userEmail]);
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }
    if (lastMessage?.body) {
      return lastMessage.body;
    }
    return "";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
          w-full
          relative
          flex
          items-center
          space-x-3
          p-3
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer`,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-semibold text-gray-900">
              {data.name || otherUser?.name || ""}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `truncate text-sm font-bold`,
              hasSeen && "font-light"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};
