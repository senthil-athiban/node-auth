import express from "express";
import connectDb from "./db/db";
import {userRouter} from "./routers/auth.route";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.listen(8080, () => {
    console.log('server started')
    connectDb();
});