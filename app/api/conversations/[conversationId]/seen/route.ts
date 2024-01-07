import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
// import prisma from "../../../../libs/prismadb"
interface IParams {
  conversationId: string;
}

export async function POST(req: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversation = await prisma?.conversation.findUnique({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });
    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }
    
    if (!conversation.lastMessageId) {
      return NextResponse.json(conversation);
    }
    const updatedMessage = await prisma?.message.update({
      where: {
        id: conversation.lastMessageId,
      },
      data: {
        seenIds: {
          push: currentUser.id,
        },
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
