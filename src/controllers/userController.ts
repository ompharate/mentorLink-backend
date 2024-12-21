import prismaClient from "../config/db.config";

class User {
  static async getUser(req: any, res: any) {
    const params = await req.params;
    if (!params.userId) {
      console.log("error");
      return res.json({
        message: "Please provide a user ID",
      });
    }

    const response = await prismaClient.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!response || !response.isMentor) {
      return res.json({
        message: "User not found",
        isMentor: false,
      });
    }

    return res.json({
      ...response,
      isMentor: true,
    });
  }

  static async allocateMentor(req: any, res: any) {
    const { userId, mentorId } = await req.body;
    console.log(userId, mentorId);
    if (!userId || !mentorId) {
      return res.json({
        message: "Please provide user ID and instructor ID",
      });
    }

    await prismaClient.userInstructor.create({
      data: {
        userId,
        instructorId: mentorId,
      },
    });

    return res.json({
      message: "Instructor linked successfully",
    });
  }
}

export default User;
