"use client";

import { ConversationType } from "@/app/types";
import { useRef } from "react";
import ConversationBox from "./ConversationBox";
import CircleLoading from "@/app/components/CircleLoading";
import useOnScreen from "@/app/hooks/useOnScreen";
import axios from "axios";
import { useInfiniteQuery } from "react-query";

type ConversationResponse = {
  data: ConversationType[];
  meta: {
    total: number;
    current:number;
  };
};

interface ConversationListClientProps {
  initData?: ConversationResponse;
  userEmail: string;
}

export default ({ initData, userEmail }: ConversationListClientProps) => {

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
        return lastPage?.meta.current
        
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

  return (
    <div className="flex-col h-[calc(100%-4rem)] overflow-y-auto px-1">
      {data?.pages.map((conversations) =>
        conversations?.data.map((item) => (
          <ConversationBox key={item.id} data={item} userEmail={userEmail!} />
        ))
      )}
      {isFetchingNextPage && (
        <div>
          <CircleLoading />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};
