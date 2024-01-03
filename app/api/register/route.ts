import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import prisma from "../../libs/prismadb"
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!email || !name || !password) {
      return new NextResponse("Missing infor", { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma?.user.create({
      data: { name, email, hashedPassword },
    });
    
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
