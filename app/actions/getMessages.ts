import prisma from "../libs/prismadb"

export default async (
    conversationId: string
) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId
            },
            include: {
                sender: true,
                seen: true
            },
            orderBy: {
                createdAt: "asc"
            },
            take:6
        })
        return messages
    } catch (error: any) {
        return []
    }
}