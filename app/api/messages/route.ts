import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
// import prisma from "../../libs/prismadb";
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { message, image, conversationId } = body;
    if (!currentUser?.id || !currentUser.email)
      throw new NextResponse("Unauthorized", { status: 401 });
    const newMessage = await prisma?.message.create({
      data: {
        body: message,
        image,
        conversationId,
        senderId: currentUser.id,
        seenIds: [currentUser.id],
      },
      include: {
        seen: true,
        sender: true,
      },
    });
    const updatedConversation = await prisma?.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessageId: newMessage?.id,
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });
    return NextResponse.json(newMessage);
  } catch (error) {
    return new NextResponse("Internal server error: ", { status: 500 });
  }
}
