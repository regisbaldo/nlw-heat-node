import prismaClient from "../prisma";

class GetLastMessagesService {
  async execute() {
    const numberOfMessages = 3;

    const messages = await prismaClient.message.findMany({
      take: numberOfMessages,
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: true,
      },
    });

    return messages;
  }
}
export { GetLastMessagesService };
