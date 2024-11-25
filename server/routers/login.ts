import { Request, Response, Router } from "express";
import UserModel from "../models/userSchema";
import bcryptjs from "bcryptjs";

const router = Router();

router.post("/signup", async (req: Request, res: Response): Promise<any> => {
    // Handles user sign-up.
    const { username, password } = req.body;


    const existingUser = await UserModel.findOne({
        where: {
            username
        }
    });
    
    if(existingUser) return res.status(400).json({ message: "User Already Exists" });
    
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new UserModel({username, password: hashedPassword});
    const response = await user.save();

    return res.status(200).json({
        message: "User Created Successfully",
        user
    });
});

router.post("/login", async (req: Request, res: Response) : Promise<any> => {
    const { username, password }  = req.body;

    const userExists = await UserModel.findOne({
        where: {
            username
        }
    });

    if(!userExists) {
        return res.status(404).json({message: "No user found"});
    }

    const comparePassword = await bcryptjs.compare(password, userExists.password);

    if(!comparePassword) {
        return res.status(401).json({message: "Invalid credentials"});
    }

    return res.status(200).json({
        message: "Login succesfully",
        user: userExists
    })
})