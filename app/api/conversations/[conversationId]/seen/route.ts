import { NextResponse } from "next/server";
import prisma from "../../../../libs/prismadb";
import getSession from "@/app/actions/getSession";
interface IParams {
  conversationId: string;
}

export async function POST(req: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;
    const session = await getSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversation = await prisma?.conversation.findUnique({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [session.user.id],
        },
      },
      include: {
        lastMessage: true,
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }
    if (!conversation.lastMessageId) {
      return NextResponse.json(conversation);
    }
    if (conversation.lastMessage?.seenIds.includes(session.user.id))
      return NextResponse.json(conversation);

    const updatedMessage = await prisma?.message.update({
      where: {
        id: conversation.lastMessageId,
      },
      data: {
        seenIds: {
          push: session.user.id,
        },
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
