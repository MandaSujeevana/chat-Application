import express from "express";
import cors from "cors";
import "dotenv/config";

import fs from "fs";
import path from "path";

import { clerkMiddleware } from '@clerk/express'
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

const app = express();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(), "public");

app.use("/api/webhook/clerk",express.raw({type:"application/json"}),clerkWebhook);

app.use(express.json())
app.use(cors({ origin: FRONTEND_URL, credentials: true}));
app.use(clerkMiddleware())

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


app.get("/health", (req, res) =>{
  res.status(200).json({ok: true});
});


if(fs.existsSync(publicDir)){

  app.use(express.static(publicDir));

  app.get("/{*any}",(req,res,next) => {
    res.sendFile(path.join(publicDir,"index.html"), (err) => next(err));
  });
}

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is up and running on PORT: ${PORT}`);
    });
   if(process.env.NODE_ENV === "production") {
    job.start();

   } 
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();