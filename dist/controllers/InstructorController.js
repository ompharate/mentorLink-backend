import prismaClient from "../config/db.config";
class Instructor {
    static async createMentor(req, res) {
        try {
            const body = req.body;
            await prismaClient.instructor.create({
                data: {
                    userId: body.userId,
                    name: body.name,
                    email: body.email,
                    description: body.description,
                    image: body.image,
                    title: body.title,
                    skills: body.skills,
                    category: body.category,
                    hourlyRate: Number(body.hourlyRate),
                },
            });
            await prismaClient.user.update({
                where: {
                    id: body.userId,
                },
                data: {
                    isMentor: true,
                },
            });
            return res.json({ message: "Mentor created successfully!" });
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: "Failed to create mentor", error });
        }
    }
    static async getAllMentors(req, res) {
        try {
            const { maxrate, category } = req.query;
            const maxRate = maxrate ? Number(maxrate) : undefined;
            if (maxRate !== undefined && isNaN(maxRate)) {
                return res.status(400).json({ message: "Invalid maxrate" });
            }
            const whereClause = {};
            if (maxRate !== undefined)
                whereClause.hourlyRate = { lte: maxRate };
            if (category)
                whereClause.category = {
                    contains: category,
                    mode: "insensitive",
                };
            const mentors = await prismaClient.instructor.findMany({
                where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
            });
            return res.json(mentors);
        }
        catch (error) {
            return res.status(500).json({ message: "Failed to get mentors" });
        }
    }
    static async getMentorById(req, res) {
        try {
            const mentorId = req.params.id;
            const mentor = await prismaClient.instructor.findFirst({
                where: { userId: mentorId },
            });
            if (!mentor) {
                return res.status(404).json({ message: "Mentor not found" });
            }
            return res.json(mentor);
        }
        catch (error) {
            return res.status(500).json({ message: "Failed to get mentor" });
        }
    }
}
export default Instructor;
