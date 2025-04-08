import { Router } from "express";
import {
  addContent,
  deleteContent,
  editContent,
  getContent,
  getContentList,
  getSharedBrain,
  getSharedCategory,
  getSharedContent,
  restrictContent,
  shareContent,
} from "../controllers/content";
import { authMiddleware } from "../middleware/auth";
export const contentRoutes = Router();

contentRoutes.get("/:id", authMiddleware, getContent);
contentRoutes.get("/", authMiddleware, getContentList);
contentRoutes.post("/", authMiddleware, addContent);
contentRoutes.put("/:id", authMiddleware, editContent);
contentRoutes.delete("/:id", authMiddleware, deleteContent);
contentRoutes.put("/share/:id", authMiddleware, shareContent);
contentRoutes.put("/restrict/:id", authMiddleware, restrictContent);

contentRoutes.get("/shared/content/:hash", getSharedContent);
contentRoutes.get("/shared/brain/:hash", getSharedBrain);
contentRoutes.get("/shared/category/:hash", getSharedCategory);
