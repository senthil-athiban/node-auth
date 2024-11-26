import express from "express";
import connectDb from "./db/db";
import {userRouter} from "./routers/user";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.listen(8080, () => {
    console.log('server started')
    connectDb();
});