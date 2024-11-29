import { Router } from "express";
import { authMiddleware } from "../middleware/userMiddleware";
import {
  login,
  refreshToken,
  signup,
  verifyUser,
  sendEmailVerification,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyOTP,
  googleLogin,
} from "../controller/authController";
import passport from "passport";
require("dotenv").config();

const router = Router();

router.post("/signup", signup as any);
router.post("/login", login as any);
//@ts-ignore
router.get("/refreshToken", refreshToken);
router.post("/send-verification-email", authMiddleware, sendEmailVerification);
router.post("/verify-email", verifyEmail);
router.get("/check", authMiddleware, verifyUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOTP);

export const userRouter = router;
