import { AccessToken } from "livekit-server-sdk";
import prismaClient from "../config/db.config.js";
class ChatController {
  public async getUserChatById(req: any, res: any) {
    const chatId = req.params.userId;

    try {
      const chat = await prismaClient.messages.findMany({
        where: {
          OR: [{ senderId: chatId }, { receiverId: chatId }],
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
  async createVideoCall(req: any, res: any) {
    const { roomName, userName } = req.body;
    if (!roomName || !userName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;


    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: userName,
      ttl: '10m',
    });

    at.addGrant({ roomJoin: true, room: roomName });

    const token = await at.toJwt();
    res.status(200).json({ token });
  }
}
export default new ChatController();
