import { NextResponse } from "next/server";
import prisma from "../../../libs/prismadb";
import getSession from "@/app/actions/getSession";
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
      cacheStrategy: {
        swr: 60,
        ttl: 60,
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
    return NextResponse.json(deletedConversation);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
