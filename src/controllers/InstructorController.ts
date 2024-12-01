import prismaClient from "../config/db.config";

interface InstructorPayload {
  userId: string;
  name: string;
  email: string;
  description: string;
  image: string;
  title: string;
  skills: string[];
  rate: string;
}

class Instructor {
  static async createMentor(req: any, res: any) {
    try {
      const body: InstructorPayload = req.body;

      await prismaClient.instructor.create({
        data: {
          userId: body.userId,
          name: body.name,
          email: body.email,
          description: body.description,
          image: body.image,
          title: body.title,
          skills: body.skills,
          rate: String(body.rate),
        },
      });

      return res.json({ message: "Mentor created successfully!" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to create mentor" ,error});
    }
  }

  static async getAllMentors(req: any, res: any) {
    try {
      const mentors = await prismaClient.instructor.findMany();
      return res.json(mentors);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get mentors" });
    }
  }

  static async getMentorById(req: any, res: any) {
    try {
      const mentorId = req.params.id;
      const mentor = await prismaClient.instructor.findUnique({
        where: { id: mentorId },
      });
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      return res.json(mentor);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get mentor" });
    }
  }
}
export default Instructor;