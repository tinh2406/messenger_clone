import getCurrentUser from "@/app/actions/getCurrentUser";
import getSession from "@/app/actions/getSession";
import { NextResponse } from "next/server";
import { parse } from "url";
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const body = await req.json();
    const { userId, isGroup, members, name } = body;
    if (!currentUser?.id || !currentUser.email) {
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
          lastMessageAt:new Date(),
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      return NextResponse.json(newConversation);
    }
    const existingConversation = await prisma?.conversation.findFirst({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
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
        userIds: [userId, currentUser.id],
        isGroup: false,
      },
    })
    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

interface GetConversationsQuery {
  skip?: number;
  take?: number;
}

export async function GET(req: Request) {
  const query: GetConversationsQuery = parse(req.url, true).query;

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
      skip: Number(query.skip || 0),
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
