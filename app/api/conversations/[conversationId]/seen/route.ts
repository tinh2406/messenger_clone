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
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }
    const lastMessage = conversation.messages[0];
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }
    const updatedMessage = await prisma?.message.update({
      where: {
        id: lastMessage.id,
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
