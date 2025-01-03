import express from "express";
import connectDb from "./db/db";
import { userRouter } from "./routers/auth.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import "./config/passport";
import { googleRouter } from "./routers/google.route";
import passport from "passport";
import session from "express-session";
import { githubRouter } from "./routers/github.route";
import { WebClient } from "@slack/web-api";
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["auth"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(passport.session());
app.use(passport.initialize());
app.use(cors({ origin: [process.env.CLIENT_URL!, "*"], credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.use("/", googleRouter);
app.use("/", githubRouter);

app.get("/api/v1/slack/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const web = new WebClient();
    const c = code as string;
    console.log("code: ", code);
    // Exchange code for token
    const response = await web.oauth.v2.access({
      client_id: process.env.SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      code: c,
      redirect_uri: "https://redirectmeto.com/http://localhost:8080/api/v1/slack/callback",
    });

    // Store these securely in your database
    const workspaceToken = response.access_token;
    console.log("workspace token:", workspaceToken);
    const workspaceId = response?.team?.id;
    console.log("workspace id :", workspaceId);

    // Get channels list
    const slackClient = new WebClient(workspaceToken);
    const channels = await slackClient.conversations.list();
    console.log("channels: ", channels);
    res.json({
      success: true,
      channels: channels?.channels?.map((c: any) => ({
        id: c.id,
        name: c.name,
      })),
    });
  } catch (error) {
    res.json({ success: false, error: error });
  }
});

app.listen(8080, () => {
  console.log("server started");
  connectDb();
});
