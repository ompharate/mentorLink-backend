import { Router } from "express";
import { signIn, signUp } from "../controllers/AuthController.js";

const router = Router();

router.post("/auth/signin", signIn);
router.post("/auth/signup",signUp);

export default router;
