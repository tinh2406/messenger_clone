"use client";

import { ConversationType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import ConversationBox from "./ConversationBox";
import useOnScreen from "@/app/hooks/useOnScreen";
import { pusherClient } from "@/app/libs/pusher";
import useConversations from "@/app/hooks/useConversations";

type ConversationResponse = {
  data: ConversationType[];
  meta: {
    total: number;
    current: number;
  };
};

interface ConversationListClientProps {
  initData: ConversationResponse;
  userEmail: string;
  userId: string;
}

export default ({
  initData,
  userEmail,
  userId,
}: ConversationListClientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { conversations, set, getMore,add,remove,update } = useConversations();
  useEffect(() => {
    set(initData?.data);
  }, []);

  const endRef = useRef<HTMLDivElement>(null);
  useOnScreen(
    endRef,
    async () => {
      if (isLoading || conversations.length >= initData.meta.total) return;
      setIsLoading(true);
      await getMore();
      setIsLoading(false);
    },
    [conversations, isLoading]
  );

  useEffect(() => {
    if (!userId) return;
    pusherClient.subscribe(userId);
    const addHandler = (data: ConversationType) => {
      add(data)
    };
    const updateHandler = (data: ConversationType) => {
      update(data)
    };
    const deleteHandler = (data: string) => {
      remove(data)
    };
    pusherClient.bind("conversation:add", addHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:delete", deleteHandler);
    return () => {
      pusherClient.unsubscribe(userId);
      pusherClient.unbind("conversation:add", addHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:delete", deleteHandler);
    };
  }, [userId]);

  return (
    <div className="flex-col h-[calc(100%-4rem)] overflow-y-auto px-1">
      {conversations.map((item) => (
        <ConversationBox key={item.id} data={item} userEmail={userEmail!} />
      ))}
      {isLoading ? (
        <div
          className={`w-full relative flex items-center space-x-3 p-3 px-6 animate-pulse`}
        >
          <div className="rounded-full h-11 w-11 mx-auto bg-gray-200 dark:bg-gray-400" />
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-400 w-40 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-400 w-10 mb-2.5"></div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-400 mb-2.5"></div>
          </div>
        </div>
      ) : (
        <div className="h-14" />
      )}
      <div ref={endRef} />
    </div>
  );
};
