import getSession from "@/app/actions/getSession";
import { NextResponse } from "next/server";
import { parse } from "url";
import prisma from "../../libs/prismadb";
import { Prisma } from "@prisma/client";
interface GetUsersQuery {
  take?: number;
  cursorId?: string;
}

export async function GET(req: Request) {
  const query: GetUsersQuery = parse(req.url, true).query;
  const myQuery: {
    cursor?: Prisma.UserWhereUniqueInput | undefined;
    skip?: number | undefined;
  } = query.cursorId ? { cursor: { id: query.cursorId }, skip: 1 } : {};
  try {
    const session = await getSession();

    if (!session?.user?.email || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const total = ((await prisma?.user.count()) || 1) - 1;
    const users = await prisma?.user.findMany({
      where: {
        NOT: {
          email: session.user.email,
        },
      },
      take: Number(query.take || 10),
      ...myQuery,
    });
    if (!users)
      return NextResponse.json({
        data: [],
        meta: {
          total: 0,
          current: 0,
        },
      });

    return NextResponse.json({
      data: await Promise.all(
        users.map(async (user) => {
          const conversation = await prisma?.conversation.findFirst({
            where: {
              OR: [
                {
                  userIds: {
                    equals: [user.id, session!.user!.id!],
                  },
                },
                {
                  userIds: {
                    equals: [session!.user!.id!, user.id],
                  },
                },
              ],
            },
          });
          return {
            ...user,
            conversationId: conversation?.id,
          };
        })
      ),
      meta: {
        total,
      },
    });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
