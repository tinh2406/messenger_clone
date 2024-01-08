import prisma from "../libs/prismadb";
import getSession from "./getSession";
import { ConversationType } from "../types";

type ConversationsResponse = {
  data: ConversationType[];
  meta: {
    total: number;
  };
};

export default async (): Promise<ConversationsResponse> => {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      data: [],
      meta: {
        total: 0,
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
      cacheStrategy: {
        swr: 60,
        ttl: 60,
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
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
    return {
      data: conversations,
      meta: {
        total: count,
      },
    };
  } catch (error) {
    return {
      data: [],
      meta: {
        total: 0,
      },
    };
  }
};
