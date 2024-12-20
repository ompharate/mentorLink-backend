import { Router } from "express";
import { googleAuth, signIn, signUp } from "../controllers/AuthController.js";
import Instructor from "../controllers/InstructorController.js";
import User from "../controllers/userController.js";
import paymentController from "../controllers/PaymentController.js";

const router = Router();

// authentication
router.post("/auth/google", googleAuth);
router.post("/auth/signin", signIn);
router.post("/auth/signup", signUp);

// user routes
router.get("/user/:userId", User.getUser);
router.post("/user/allocate-mentor", User.allocateMentor);

// instructor routes
router.post("/create-mentor", Instructor.createMentor);
router.get("/mentors", Instructor.getAllMentors);
router.get("/mentor/:id", Instructor.getMentorByUserId);
router.get("/mentor", Instructor.getMentorById);

//payment routes
router.post("/payment/create-order", paymentController.createOrder);
export default router;
