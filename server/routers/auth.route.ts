import { Router } from "express";
import { authMiddleware } from "../middleware/userMiddleware";
import { login, refreshToken, signup, verifyUser, sendEmailVerification, verifyEmail } from "../controller/authController";
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
router.post("/refresh", refreshToken as any);
router.post("/send-verification-email", authMiddleware, sendEmailVerification);
router.post("/verify-email", verifyEmail)
router.get("/check", verifyUser as any);

router.post("/forgot-password", async (req: Request, res: Response) => {
    const username = req.body.username;
    const user = await UserModel.findOne({username});
    if(!user) {
        res.status(404).json({message: 'No user found with the email'});
    }
    
    // generate reset password token
    const expires = moment().add(10,'minutes');
    const payload = {
        sub: username,
        iat: moment().unix(),
        exp: expires.unix(),
        type: tokenTypes.RESET_PASSWORD
    }
    const resetPasswordToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!);
    await Token.create({token: resetPasswordToken, user: username, type: tokenTypes.RESET_PASSWORD, blackListed: true});
    
    // send the token to the user via email
    // function to sendResetPasswordEmail(username, resetPasswordToken)
    await emailService.sendResetPasswordEmail(username, resetPasswordToken);
    res.status(201);
});

router.post('/reset-password', async (req: Request, res: Response) => {
    const token = req.query.token as string;
    const newPassword = req.body.password;
    console.log("token: ", token);
    console.log("[PASSWORD]", newPassword);
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const tokenDoc = await Token.findOne({token, user: verifiedToken.sub, type: tokenTypes?.RESET_PASSWORD});
    if(!tokenDoc) {
        console.log('No token found');
        return;
    }
    const user = await UserModel.findOne({username: tokenDoc.user});
    if(!user) {
        res.status(401).json({error:'no user found'});
    }
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await UserModel.findOneAndUpdate({username: user?.username}, {password: hashedPassword}, {new: true});
    await Token.deleteMany({user: user?.username, token, type: tokenTypes.RESET_PASSWORD});
    res.status(201).json({"message": 'Sucess'});

})

export const userRouter = router;