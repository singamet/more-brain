import { Router } from "express";
import { getRedditPost } from "../controllers/embed";

export const embedRoutes = Router();

embedRoutes.get("/", getRedditPost);
