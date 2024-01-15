"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import MessageBox from "./MessageBox";
import CircleLoading from "@/app/components/CircleLoading";
import { useAuth } from "@/app/context/AuthContext";
import useMessages from "@/app/hooks/useMessages";
import useOnScreen from "@/app/hooks/useOnScreen";

type MessageResponse = {
  data: FullMessageType[];
  meta: {
    total: number;
  };
};

interface BodyProps {
  initData: MessageResponse;
}

export default ({ initData }: BodyProps) => {
  const session = useAuth();
  const { messages, set, getMore,update,addNew } = useMessages();
  const [isLoading,setIsLoading] = useState(false)
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
    set(initData.data);

  }, [conversationId]);
  useEffect(()=>{
    bottomRef.current?.scrollIntoView();
  },[messages])
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      block: "end",
      inline: "nearest",
    });
  }, [session.status]);
  useOnScreen(
    topRef,
    async () => {
      if (isLoading||messages.length >= initData.meta.total) return;
      setIsLoading(true)
      await getMore(conversationId);
      setIsLoading(false)
    },
    [messages,isLoading]
  );
  useEffect(()=>{
    pusherClient.subscribe(conversationId);
    const messageHandler = (message: FullMessageType) => {      
          axios.post(`/api/conversations/${conversationId}/seen`);
          addNew(message)
        };
        const updateMessageHandler = (newMessage: FullMessageType) => {
          update(newMessage)
        };
        pusherClient.bind("messages:new", messageHandler);
        pusherClient.bind("message:update", updateMessageHandler);
        return () => {
          pusherClient.unsubscribe(conversationId);
          pusherClient.unbind("messages:new", messageHandler);
          pusherClient.unbind("message:update", updateMessageHandler);
        };
  },[conversationId])
  if (session.status === "loading") return <CircleLoading />;

  return (
    <div className="flex-1 overflow-y-auto">
      <div ref={topRef} />
      {isLoading&&<CircleLoading/>}
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};
