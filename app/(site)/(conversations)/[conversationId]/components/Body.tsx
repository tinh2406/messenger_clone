"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
// import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import MessageBox from "./MessageBox";
import { useSession } from "next-auth/react";
import CircleLoading from "@/app/components/CircleLoading";

interface BodyProps {
  initialMessages: FullMessageType[];
}

export default ({ initialMessages }: BodyProps) => {
  const session = useSession();
  const [messages, setMessages] = useState(initialMessages.reverse());
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();
  // useEffect(() => {
  //     axios.post(`/api/conversations/${conversationId}/seen`);
  //   }, [conversationId]);
  useEffect(() => {
    //     pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView({
      block: "end",
      inline: "nearest",
    });
    //     const messageHandler = (message: FullMessageType) => {
    //       axios.post(`/api/conversations/${conversationId}/seen`);
    //       setMessages((current) => {
    //         if (find(current, { id: message.id })) {
    //           return current;
    //         }
    //         return [...current, message];
    //       });
    //       bottomRef.current?.scrollIntoView();
    //     };
    //     const updateMessageHandler = (newMessage: FullMessageType) => {
    //       console.log("message:update");
    //       setMessages((current) =>
    //         current.map((currentMessage) => {
    //           if (currentMessage.id === newMessage.id) return newMessage;
    //           return currentMessage;
    //         })
    //       );
    //     };
    //     pusherClient.bind("messages:new", messageHandler);
    //     pusherClient.bind("message:update", updateMessageHandler);
    //     return () => {
    //       pusherClient.unsubscribe(conversationId);
    //       pusherClient.unbind("messages:new", messageHandler);
    //       pusherClient.unbind("message:update", updateMessageHandler);
    //     };
  }, [session.status]);
  if (session.status === "loading") return <CircleLoading />;

  return (
    <div className="flex-1 overflow-y-auto">
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
