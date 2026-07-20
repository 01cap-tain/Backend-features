import "dotenv/config";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import router from "./routes/auth-route.js";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import crypto from "crypto";

const app = express();

const redisClient = new createClient({
  url: process.env.SERVICE_URL,
  socket: {
    keepAlive: 30000,
  },
});

redisClient.on("error", (err) => console.error("Valkey Error:", err));
redisClient.on("connect", () => console.log("Connected to Aiven Valkey"));
redisClient.on("ready", () => {
  console.log("reconnected");
});
await redisClient.connect();

const redisStore = new RedisStore({
  client: redisClient,
});
app.use(cookieParser());
app.use(
  session({
    store: redisStore,
    secret:
      process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  }),
);

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const PORT = 3000;

app.use(express.json());

app.use("/api", router);
// app.use("/", testing);
// async function testing(req, res) {
//   res.send("Welcome captain");
// }
// // app.use("api/",);

app.listen(PORT, () => {
  console.log("listening on port idk");
});
