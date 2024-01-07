import { Conversation, Message, User } from "@prisma/client";
import { Session } from "next-auth";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type ConversationType = Conversation&{
  users:User[],
  lastMessage?:FullMessageType|null
}

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};

export type MySession = Session & {
  user?: {
    id?: string | null | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
};
