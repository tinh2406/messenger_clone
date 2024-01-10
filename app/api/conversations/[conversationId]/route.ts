import { NextResponse } from "next/server";
import prisma from "../../../libs/prismadb";
import getSession from "@/app/actions/getSession";
import { pusherServer } from "@/app/libs/pusher";
interface IParams {
  conversationId?: string;
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;
    const session = await getSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const existingConversation = await prisma?.conversation.findUnique({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [session.user.id],
        },
      },
    });
    if (!existingConversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }
    const deletedConversation = await prisma?.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [session.user.id],
        },
      },
    });
    existingConversation.userIds.forEach((userId) => {
      pusherServer.trigger(userId, "conversation:delete", conversationId);
    });

    return NextResponse.json(deletedConversation);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;
    const session = await getSession();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversation = await prisma?.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    if (conversation?.userIds.includes(session.user.id))
      return NextResponse.json(conversation);
    return new NextResponse("Conversation not found", { status: 404 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
