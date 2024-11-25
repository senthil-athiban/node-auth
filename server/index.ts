import express from "express";
import connectDb from "./db/db";


const app = express();

app.use("/api/v1/user", )
app.listen(8080, () => {
    console.log('server started')
    connectDb();
});