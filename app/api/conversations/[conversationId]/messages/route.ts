import getSession from "@/app/actions/getSession";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { parse } from "url";
import prisma from "../../../../libs/prismadb";

interface IParams {
  conversationId?: string;
}
interface GetConversationsQuery {
  take?: number;
  cursorId?: string;
}

export async function GET(req: Request, { params }: { params: IParams }) {
  const { conversationId } = params;
  const query: GetConversationsQuery = parse(req.url, true).query;
  const myQuery: {
    cursor?: Prisma.MessageWhereUniqueInput | undefined;
    skip?: number | undefined;
  } = query.cursorId ? { cursor: { id: query.cursorId }, skip: 1 } : {};
  try {
    const session = await getSession();

    if (!session?.user?.email || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const count =
      ((await prisma.message.count({
        where: {
          conversationId,
        },
      })) || 1) - 1;
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Number(query.take || 6),
      ...myQuery,
    });
    return NextResponse.json({
      data: messages.reverse(),
      meta: {
        total: count,
      },
    });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
