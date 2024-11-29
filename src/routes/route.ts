import { Router } from "express";
import { googleAuth, signIn, signUp } from "../controllers/AuthController.js";

const router = Router();

router.post("/auth/google", googleAuth);
router.post("/auth/signin", signIn);
router.post("/auth/signup", signUp);

export default router;
