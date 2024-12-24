import prismaClient from "../config/db.config.js";
class Instructor {
    static async createMentor(req, res) {
        try {
            const body = req.body;
            await prismaClient.instructor.create({
                data: {
                    userImage: body.userImage,
                    userId: body.userId,
                    name: body.name,
                    email: body.email,
                    description: body.description,
                    image: body.image,
                    title: body.title,
                    category: body.Category,
                    hourlyRate: Number(body.hourlyRate),
                    tags: body.tags,
                    keyPoints: body.keyPoints,
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
            const { maxrate, category, search } = req.query;
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
            if (search) {
                whereClause.name = { contains: search, mode: "insensitive" };
            }
            const mentors = await prismaClient.instructor.findMany({
                where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
            });
            return res.json(mentors);
        }
        catch (error) {
            return res.status(500).json({ message: "Failed to get mentors" });
        }
    }
    static async getMentorByUserId(req, res) {
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
    static async getMentorById(req, res) {
        try {
            const mentorId = req.query.id;
            const mentor = await prismaClient.instructor.findUnique({
                where: { id: mentorId },
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
    static async fetchAllocatedMentors(req, res) {
        try {
            const userId = req.params.userId;
            const mentors = await prismaClient.userInstructor.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    instructor: true,
                },
            });
            return res.json(mentors);
        }
        catch (error) {
            return res.status(500).json({ message: "Failed to get mentors" });
        }
    }
    static async fetchMentorsUsers(req, res) {
        try {
            const userId = req.params.userId;
            const mentors = await prismaClient.instructor.findFirst({
                where: {
                    userId: userId,
                },
                include: {
                    userLinks: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            return res.json(mentors);
        }
        catch (error) {
            return res.status(500).json({ message: "Failed to get mentors" });
        }
    }
}
export default Instructor;
