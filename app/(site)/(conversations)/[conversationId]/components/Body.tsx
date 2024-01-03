"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
// import MessageBox from "./MessageBox";
import axios from "axios";
// import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import MessageBox from "./MessageBox";
import { useSession } from "next-auth/react";
import Loading from "@/app/components/Loading";

interface BodyProps {
  initialMessages: FullMessageType[];
}

export default ({ initialMessages }: BodyProps) => {
  const session = useSession();
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();
  // useEffect(() => {
  //     axios.post(`/api/conversations/${conversationId}/seen`);
  //   }, [conversationId]);
  useEffect(() => {
    //     pusherClient.subscribe(conversationId);

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
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
  if (session.status === "loading") return <Loading />;

  return (
    <div
      className="flex-1 overflow-y-auto"
    >
      {/* <div className="rotate-180 overflow-visible"> */}
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      {/* </div> */}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};