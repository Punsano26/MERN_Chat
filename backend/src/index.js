import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./libs/db.js";
import { app, server } from "./libs/socket.js";
dotenv.config();
import authRoutes from "./routers/auth.route.js";
import messageRoutes from "./routers/message.route.js";
import friendRoutes from "./routers/friend.router.js";

const PORT = process.env.PORT;

app.use(
  express.json({
    limit: "60mb",
  })
);
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.get("/", (req, res) => {
  res.send("<h1>Welcome Restful Service for MERN Chat Project</h1>");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/friend", friendRoutes);

server.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
