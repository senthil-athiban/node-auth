import { Request, Response, Router } from "express";
import UserModel from "../models/userSchema";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
require('dotenv').config();

const router = Router();

router.post("/signup", async (req: Request, res: Response): Promise<any> => {
  // Handles user sign-up.
  console.log('username : ', req.body);
  const { username, password } = req.body;
  const existingUser = await UserModel.findOne({
    where: {
      username,
    },
  });

  if (existingUser)
    return res.status(400).json({ message: "User Already Exists" });

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = new UserModel({ username, password: hashedPassword });
  await user.save();

  return res.status(200).json({
    message: "User Created Successfully",
    user,
  });
});

router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
console.log("username : ", username);
    const userExists = await UserModel.findOne({username});

    console.log("userExists", userExists);

    
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

    console.log('reached 1 : ', process.env.JWT_SECRET_KEY);
    const token = jwt.sign(
      { userId: userExists._id },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1hr",
      }
    );
    console.log('reached 2');
    return res.status(200).json({
      message: "Login succesfully",
      user: userExists,
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
});


export const userRouter = router;