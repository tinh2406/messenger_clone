import { User } from "@prisma/client";
import prisma from "../libs/prismadb";
import getSession from "./getSession";

type UsersResponse = {
  data: User[];
  meta: {
    total: number;
    current: number;
  };
};

export default async (): Promise<UsersResponse> => {
  const session = await getSession();

  if (!session?.user?.email || !session.user.id) {
    return {
      data: [],
      meta: {
        total: 0,
        current: 0,
      },
    };
  }
  try {
    const total = ((await prisma?.user.count()) || 1) - 1;
    const users = await prisma?.user.findMany({
      where: {
        NOT: {
          email: session.user.email,
        },
      },
      take: 10,
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
    return {
      data: await Promise.all(
        users.map(async (user) => {
          const conversation = await prisma.conversation.findFirst({
            where: {
              OR: [
                {
                  userIds: {
                    equals: [user.id, session!.user!.id!],
                  },
                },
                {
                  userIds: {
                    equals: [session!.user!.id!, user.id],
                  },
                },
              ],
            },
            cacheStrategy: {
              swr: 60,
              ttl: 60,
            },
          });
          return {
            ...user,
            conversationId: conversation?.id,
          };
        })
      ),
      meta: {
        total,
        current: users.length,
      },
    };

    // return users;
  } catch (error) {
    return {
      data: [],
      meta: {
        total: 0,
        current: 0,
      },
    };
  }
};
