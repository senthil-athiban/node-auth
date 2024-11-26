import { Router } from "express";
import { authMiddleware } from "../middleware/userAuth";
import { login, refreshToken, signup, verifyUser } from "../controller/authController";
require('dotenv').config();

const router = Router();

router.post("/signup", signup as any);
router.post("/login", login as any);
router.post("/refresh", refreshToken as any);
router.get("/check", authMiddleware, verifyUser as any)

export const userRouter = router;