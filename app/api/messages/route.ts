import { NextResponse } from "next/server";
import prisma from "../../libs/prismadb";
import getSession from "@/app/actions/getSession";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { message, image, conversationId } = body;
    if (!session?.user?.id || !session.user.email)
      throw new NextResponse("Unauthorized", { status: 401 });
    const newMessage = await prisma?.message.create({
      data: {
        body: message,
        image,
        conversationId,
        senderId: session.user.id,
        seenIds: [session.user.id],
      },
    });
    const updatedConversation = await prisma?.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessageId: newMessage?.id,
      },
    });
    updatedConversation.userIds.forEach(userId=>{
      pusherServer.trigger(userId, "conversation", "update");
      pusherServer.trigger(userId, "message", "add");
    })
    return NextResponse.json(newMessage);
  } catch (error) {
    return new NextResponse("Internal server error: ", { status: 500 });
  }
}
