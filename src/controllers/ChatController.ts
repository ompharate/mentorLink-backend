import prismaClient from "../config/db.config";
class ChatController {
  public async getUserChatById(req: any, res: any) {
    const chatId = req.params.userId;

    try {
      const chat = await prismaClient.messages.findMany({
        where: {
          OR: [
            { senderId: chatId },
            { receiverId: chatId },
          ],
        },
      });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      return res.json(chat);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }
}
export default new ChatController();
