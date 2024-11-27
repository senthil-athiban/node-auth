import { Request, Response } from "express";
import UserModel from "../models/userSchema";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { authService, emailService, tokenService } from "../services";

const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const existingUser = await UserModel.findOne({ username });

  if (existingUser)
    return res.status(400).json({ message: "User Already Exists" });

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = new UserModel({ username, password: hashedPassword });
  await user.save();

  return res.status(200).json({
    message: "User Created Successfully",
    user,
  });
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const userExists = await UserModel.findOne({ username });

    if (!userExists) {
      return res.status(404).json({ message: "No user found" });
    }

    const comparePassword = await bcryptjs.compare(
      password,
      userExists.password
    );

    if (!comparePassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: userExists.username },
      process.env.ACCESS_SECRET_KEY!,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { userId: userExists.username },
      process.env.REFRESH_SECRET_KEY!,
      { expiresIn: "1hr" }
    );

    const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);

    await UserModel.findOneAndUpdate(
      { username },
      { refreshtoken: hashedRefreshToken },
      { new: true }
    );

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
  {
    try {
      const refreshToken = req.cookies.jwt;

      if (!refreshToken) {
        res.status(401).json({ error: "Un authorized" });
      }

      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_KEY!
      );

      //@ts-ignore
      const userId = decodedToken.userId;
      const user = await UserModel.findOne({ username: userId });
      if (!user) {
        res.status(404).json({ message: "No user found" });
      }
      const newAccessToken = jwt.sign(
        { userId: user?.username },
        process.env.ACCESS_SECRET_KEY!,
        {
          expiresIn: "15m",
        }
      );

      const newRefreshToken = jwt.sign(
        { userId: user?.username },
        process.env.REFRESH_SECRET_KEY!,
        { expiresIn: "1hr" }
      );

      await UserModel.findOneAndUpdate(
        { username: user?.username },
        { refreshtoken: newRefreshToken },
        { new: true }
      );

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: "Generated new access + refresh token",
        user,
        newAccessToken,
      });
    } catch (error) {
      res.status(403).json({ message: "Invalid token" });
    }
  }
};

const verifyUser = async (req: Request, res: Response) => {
  try {
    res.status(201).json({ message: "you are verified" });
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
}

const verifyEmail = async (req: Request, res: Response) => {
  const token : string = req.query.token as string;
  await authService.verifyEmail(token);
  res.status(204).json({message: 'Email verified'});
}
export {
    login,
    signup,
    refreshToken,
    verifyUser,
    sendEmailVerification,
    verifyEmail
}