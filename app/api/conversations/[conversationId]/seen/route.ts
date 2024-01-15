import { NextResponse } from "next/server";
import prisma from "../../../../libs/prismadb";
import getSession from "@/app/actions/getSession";
import { pusherServer } from "@/app/libs/pusher";
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
    pusherServer.trigger(conversationId!, "messages:update", updatedMessage);
    pusherServer.trigger(session.user.email!, "conversation:seen", {
      id: conversationId,
      lastMessage: updatedMessage,
    });
    return NextResponse.json(updatedMessage);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
