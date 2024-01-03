import { MySession } from "../types";
import getSession from "./getSession";

export default async (conversationId: string, session: MySession) => {
  if (!session?.user?.id) return null;

  try {
    const conversation = await prisma?.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    if (conversation?.userIds.includes(session.user.id)) return conversation;
  } catch (error) {
    return null;
  }
};
