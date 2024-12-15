import prismaClient from "../config/db.config";
class User {
    static async getUser(req, res) {
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
}
export default User;
