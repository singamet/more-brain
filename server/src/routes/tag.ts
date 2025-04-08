import { Router } from "express";
import { createTag, searchTag } from "../controllers/tag";

export const tagRoutes = Router();

tagRoutes.get("/", searchTag);
tagRoutes.post("/", createTag);
