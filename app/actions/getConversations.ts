import prisma from "../libs/prismadb";
import getSession from "./getSession";
import { ConversationType } from "../types";

type ConversationsResponse = {
  data: ConversationType[];
  meta: {
    total: number;
    current: number;
  };
};

export default async (): Promise<ConversationsResponse> => {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      data: [],
      meta: {
        total: 0,
        current: 0,
      },
    };
  }

  try {
    const count = await prisma?.conversation.count({
      where: {
        userIds: {
          has: session.user.id,
        },
        NOT: {
          lastMessageAt: null,
        },
      },
    });
    const conversations = await prisma?.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      take: 10,
      where: {
        userIds: {
          has: session.user.id,
        },
        NOT: {
          lastMessageAt: null,
        },
      },
      include: {
        users: true,
        lastMessage: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
    return {
      data: conversations,
      meta: {
        total: count,
        current: conversations.length,
      },
    };
  } catch (error) {
    console.log(error);
    
    return {
      data: [],
      meta: {
        total: 0,
        current: 0,
      },
    };
  }
};
