import prisma from "../libs/prismadb";
import { FullMessageType } from "../types";

type MessageResponse = {
  data: FullMessageType[];
  meta: {
    total: number;
  };
};

export default async (conversationId: string): Promise<MessageResponse> => {
  try {
    const count = await prisma.message.count({
      where: {
        conversationId,
      },
    });
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });
    return {
      data: messages.reverse(),
      meta: {
        total: count,
      },
    };
  } catch (error: any) {
    throw error;
  }
};
