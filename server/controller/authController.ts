import { Request, Response } from "express";
import User from "../models/userSchema";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  authService,
  emailService,
  tokenService,
  userService,
} from "../services";
import { tokenTypes } from "../config/tokens";
import { Token } from "../models/tokenSchema";
import { OTPModel } from "../models/otpSchema";

const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if(!username || !password) {
    res.status(404).json({message: 'Invalid content'});
  }
  const existingUser = await User.findOne({username});
  if (existingUser) {
    return res.status(400).json({message: 'User already exists'});
  }
  const user = new User({ username, password });
  await user.save();
  return res.status(200).json({
    message: "User Created Successfully"
  });
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if(!username || !password) {
      return res.status(404).json({message: 'Invalid content'});
    }
    const userExists = await userService.getUserById(username);

    const comparePassword = await bcryptjs.compare(
      password,
      userExists.password
    );

    if (!comparePassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // if user enabled 2FA
    if (userExists.isMFAEnabled) {
      // create mfa token and update it into user model
      const MFAToken = await tokenService.generateOTPToken(userExists.username);

      // then send otp email
      await emailService.sendOTPEmail(username, MFAToken);
      await OTPModel.deleteMany({ user: username, otpToken: MFAToken });

      return res
        .status(202)
        .json({ message: "OTP sent successfully, please check your email" });
    }

    const { accessToken, refreshToken } = await tokenService.generateAuthTokens(userExists.username);
    await userService.updateUserById(userExists.username, { refreshtoken: refreshToken });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login succesfully",
      user: userExists,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.jwt;
    console.log("refreshToken: ", refreshToken);
    if (!refreshToken) {
      return res.status(401).json({ error: "Un authorized" });
    }

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY!
    );

    const userId = decodedToken.sub as string;
    const user = await userService.getUserById(userId);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await tokenService.generateAuthTokens(user.username);
    await userService.updateUserById(user.username, {
      refreshtoken: newRefreshToken,
    });

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Generated new access + refresh token",
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

const verifyUser = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "you are verified" });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

const sendEmailVerification = async (req: Request, res: Response) => {
  //@ts-ignore
  const username = req.userId;
  const verifyToken = await tokenService.generateVerifyEmailToken(username);
  await emailService.sendEmailVerification(username, verifyToken);
  res.status(201).send();
};

const verifyEmail = async (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  await authService.verifyEmail(token);
  res.status(204).json({ message: "Email verified" });
};

const forgotPassword = async (req: Request, res: Response) => {
  const username = req.body.username;
  const user = await userService.getUserById(username);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    user.username
  );
  await emailService.sendResetPasswordEmail(username, resetPasswordToken);
  res.status(201).json({ message: "Verification email has been sent successfully" });
};

const resetPassword = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  const newPassword = req.body.password;

  const verifiedToken = await tokenService.verifyToken(
    token,
    tokenTypes.RESET_PASSWORD
  );
  const user = await userService.getUserById(verifiedToken.user!);

  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  await userService.updateUserById(user.username, { password: hashedPassword });

  await Token.deleteMany({
    user: user?.username,
    token,
    type: tokenTypes.RESET_PASSWORD,
  });
  res.status(201).json({ message: "Password has been updated successfully" });
};

const verifyOTP = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  const user = await authService.verifyOTP(token);

  const { accessToken, refreshToken } = await tokenService.generateAuthTokens(
    user.username
  );

  await userService.updateUserById(user.username, {
    refreshtoken: refreshToken,
  });
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "Generated new access and refresh token",
    accessToken,
  });
};

const googleLogin = async (req: Request, res: Response) => {
  
}

export {
  googleLogin,
  login,
  signup,
  refreshToken,
  verifyUser,
  sendEmailVerification,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyOTP,
};
