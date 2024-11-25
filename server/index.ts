import express from "express";
import connectDb from "./db/db";
import {userRouter} from "./routers/user";
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use("/api/v1/user", userRouter);
app.listen(8080, () => {
    console.log('server started')
    connectDb();
});