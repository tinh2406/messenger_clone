import prisma from "../libs/prismadb";
import getSession from "./getSession";
export default async () => {
  const session = await getSession();

  if (!session?.user?.email || !session.user.id) {
    return [];
  }
  try {
    const users = await prisma?.user.findMany({
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });
    return await Promise.all(
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
        });
        return {
          ...user,
          conversationId: conversation?.id,
        };
      })
    );

    // return users;
  } catch (error) {
    return [];
  }
};
