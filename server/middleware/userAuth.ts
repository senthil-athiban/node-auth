import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken';
require('dotenv').config()

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if(!token) {
        return res.status(401).json({error: 'Access denied'});
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        //@ts-ignore
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token'});
    }
}