import express from "express";
import connectDb from "./db/db";
import {userRouter} from "./routers/auth.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import "./config/passport";
import { googleRouter } from "./routers/google.route";
import passport from "passport";
import session from "express-session";
import { githubRouter } from "./routers/github.route";
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieSession({
    name: "session",
    keys: ["auth"],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(passport.session());
app.use(passport.initialize());
app.use(cors({origin: [process.env.CLIENT_URL!, "*"], credentials: true}));
app.use(session({ secret: process.env.SESSION_SECRET!, resave: true, saveUninitialized: true }));
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.use("/", googleRouter);
app.use("/", githubRouter);
app.listen(8080, () => {
    console.log('server started')
    connectDb();
});