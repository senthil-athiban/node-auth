import { Router } from "express";
import { authMiddleware } from "../middleware/userMiddleware";
import { login, refreshToken, signup, verifyUser, sendEmailVerification, verifyEmail, forgotPassword, resetPassword } from "../controller/authController";
import UserModel from "../models/userSchema";
import moment from "moment";
import { tokenTypes } from "../config/tokens";
import { Token } from "../models/tokenSchema";
import ApiError from "../utils/apiError";
require('dotenv').config();


import jwt from "jsonwebtoken";
import {Request, Response} from "express";
import { emailService } from "../services";

const router = Router();

router.post("/signup", signup as any);
router.post("/login", login as any);
router.post("/refresh", refreshToken);
router.post("/send-verification-email", authMiddleware, sendEmailVerification);
router.post("/verify-email", verifyEmail)
router.get("/check", verifyUser);
router.post("/forgot-password", forgotPassword);
router.post('/reset-password', resetPassword);

export const userRouter = router;