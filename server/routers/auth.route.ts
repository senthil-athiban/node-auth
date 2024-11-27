import { Router } from "express";
import { authMiddleware } from "../middleware/userMiddleware";
import { login, refreshToken, signup, verifyUser, sendEmailVerification, verifyEmail } from "../controller/authController";
require('dotenv').config();

const router = Router();

router.post("/signup", signup as any);
router.post("/login", login as any);
router.post("/refresh", refreshToken as any);
router.post("/send-verification-email", authMiddleware, sendEmailVerification);
router.post("/verify-email", verifyEmail)
router.get("/check", verifyUser as any);

export const userRouter = router;