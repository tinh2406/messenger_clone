import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

export default (
  conversation: FullConversationType | { users: User[] },
  currentUserEmail: string
) => {
  const otherUser = useMemo(() => {
    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );
    return otherUser;
  }, [currentUserEmail, conversation.users]);

  return otherUser[1] || otherUser[0];
};
