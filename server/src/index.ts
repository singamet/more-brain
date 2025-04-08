import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userRoutes } from "./routes/user";
import { authMiddleware } from "./middleware/auth";
import { contentRoutes } from "./routes/content";
import { tagRoutes } from "./routes/tag";
import { categoryRoutes } from "./routes/category";
import cors from "cors";
import { embedRoutes } from "./routes/embed";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request - ${req.method} - ${req.path}`);
  next();
});
app.use("/api/auth", userRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/tag", authMiddleware, tagRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/embed", authMiddleware, embedRoutes);
app.use((req, res) => {
  res.status(400).json({ error: "Invalid Request" });
});
mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
