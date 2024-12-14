import { Router } from "express";
import { googleAuth, signIn, signUp } from "../controllers/AuthController.js";
import Instructor from "../controllers/InstructorController.js";
import User from "../controllers/userController.js";

const router = Router();

router.post("/auth/google", googleAuth);
router.post("/auth/signin", signIn);
router.post("/auth/signup", signUp);

router.post("/create-mentor", Instructor.createMentor);
router.get("/mentors", Instructor.getAllMentors);
router.get("/mentor/:id", Instructor.getMentorById);

router.get("/user/:userId", User.getUser);

export default router;
