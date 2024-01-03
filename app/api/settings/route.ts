import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
// import prisma from "../../libs/prismadb";
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { image, name } = body;
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const updatedUser = await prisma?.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image,
        name,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
