import getSession from "@/app/actions/getSession";
import { NextResponse } from "next/server";
import { parse } from "url";
import prisma from "../../libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    const body = await req.json();
    const { userId, isGroup, members, name } = body;
    if (!session?.user?.id || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }
    if (isGroup) {
      const newConversation = await prisma?.conversation.create({
        data: {
          name,
          isGroup,
          lastMessageAt: new Date(),
          userIds: [
            ...members.map(({ value }: { value: string }) => value),
            session.user.id,
          ],
        },
        include:{
          users:true
        }
      });
      newConversation.userIds.map((userIds) => {
        pusherServer.trigger(userIds, "conversation:add", newConversation);
      });
      return NextResponse.json(newConversation);
    }
    const existingConversation = await prisma?.conversation.findFirst({
      where: {
        OR: [
          {
            userIds: {
              equals: [session.user.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, session.user.id],
            },
          },
        ],
      },
    });
    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }
    const newConversation = await prisma?.conversation.create({
      data: {
        userIds: [userId, session.user.id],
        isGroup: false,
      },
    });
    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

interface GetConversationsQuery {
  take?: number;
  cursorId?: string;
}

export async function GET(req: Request) {
  const query: GetConversationsQuery = parse(req.url, true).query;
  const myQuery: {
    cursor?: Prisma.ConversationWhereUniqueInput | undefined;
    skip?: number | undefined;
  } = query.cursorId ? { cursor: { id: query.cursorId }, skip: 1 } : {};
  try {
    const session = await getSession();

    if (!session?.user?.email || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const count =
      ((await prisma?.conversation.count({
        where: {
          userIds: {
            has: session.user.id,
          },
          NOT: {
            lastMessageAt: null,
          },
        },
      })) || 1) - 1;
    const conversations = await prisma?.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      take: Number(query.take || 10),
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
      ...myQuery,
    });
    return NextResponse.json({
      data: conversations,
      meta: {
        total: count,
      },
    });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
