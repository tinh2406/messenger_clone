"use client";

import { ConversationType } from "@/app/types";
import { useEffect, useRef } from "react";
import ConversationBox from "./ConversationBox";
import useOnScreen from "@/app/hooks/useOnScreen";
import axios from "axios";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { pusherClient } from "@/app/libs/pusher";

type ConversationResponse = {
  data: ConversationType[];
  meta: {
    total: number;
    current: number;
  };
};

interface ConversationListClientProps {
  initData?: ConversationResponse;
  userEmail: string;
  userId: string;
}

export default ({
  initData,
  userEmail,
  userId,
}: ConversationListClientProps) => {
  const queryClient = useQueryClient();
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["conversations"],
    async ({ pageParam }) => {
      const res = await axios.get<ConversationResponse>("/api/conversations", {
        params: {
          skip: pageParam || 0,
        },
      });
      return res.data;
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage && lastPage?.meta.current >= lastPage?.meta.total) return;
        return lastPage?.meta.current;
      },
      initialData: {
        pages: [initData],
        pageParams: [0],
      },
    }
  );

  const endRef = useRef<HTMLDivElement>(null);
  useOnScreen(
    endRef,
    () => {
      fetchNextPage();
    },
    []
  );

  useEffect(() => {
    if (!userId) return;
    pusherClient.subscribe(userId);
    const handler = (data: string) => {
      queryClient.invalidateQueries(["conversations"]);
    };
    pusherClient.bind("conversation", handler);
    return () => {
      pusherClient.unsubscribe(userId);
      pusherClient.unbind("conversation", handler);
    };
  }, [userId]);

  return (
    <div className="flex-col h-[calc(100%-4rem)] overflow-y-auto px-1">
      {data?.pages.map((conversations) =>
        conversations?.data.map((item) => (
          <ConversationBox key={item.id} data={item} userEmail={userEmail!} />
        ))
      )}
      {isFetchingNextPage && (
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
      )}
      <div ref={endRef} />
    </div>
  );
};
