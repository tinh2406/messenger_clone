"use client";

import { ConversationType } from "@/app/types";
import { useRef, useState } from "react";
import ConversationBox from "./ConversationBox";
import CircleLoading from "@/app/components/CircleLoading";
import useOnScreen from "@/app/hooks/useOnScreen";
import axios from "axios";

type ConversationResponse = {
  data: ConversationType[];
  meta: {
    total: number;
  };
};

interface ConversationListClientProps {
  initData?: ConversationResponse;
  userEmail: string;
}

export default ({ initData, userEmail }: ConversationListClientProps) => {
  const [conversations, setConversations] = useState(initData?.data || []);
  const [total, setTotal] = useState(initData?.meta.total || 0);
  const [isLoading, setIsLoading] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  useOnScreen(
    endRef,
    async () => {
      if (conversations.length < total && !isLoading) {
        setIsLoading(true);
        try {
          const res = await axios.get<ConversationResponse>("/api/conversations", {
            params: {
              skip: conversations.length,
            },
          });
          setConversations((last) => {
            return [...last, ...res.data.data];
          });
          setTotal(res.data.meta.total);
        } catch (error) {}
        setIsLoading(false);
      }
    },
    [conversations.length, total, isLoading]
  );

  return (
    <div className="flex-col h-[calc(100%-4rem)] overflow-y-auto px-1">
      {conversations.map((item) => (
        <ConversationBox key={item.id} data={item} userEmail={userEmail!} />
      ))}
      {isLoading && <div><CircleLoading /></div>}
      <div ref={endRef} />
    </div>
  );
};
