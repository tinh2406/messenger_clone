import { NextResponse } from "next/server";
import prisma from "../../../libs/prismadb"

interface IParams {
  id: string;
}

export async function GET(req: Request, { params }: { params: IParams }) {
  try {
    const { id } = params;
    const user = await prisma?.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
