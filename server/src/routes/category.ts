import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getSharedCategories,
  renameCategories,
  renameCategory,
  restrictCategory,
  shareCategory,
} from "../controllers/category";
import { authMiddleware } from "../middleware/auth";

export const categoryRoutes = Router();

categoryRoutes.get("/shared/category/:hash", getSharedCategories);
categoryRoutes.use(authMiddleware);
categoryRoutes.get("/", getCategories);
categoryRoutes.post("/", addCategory);
categoryRoutes.put("/:id", renameCategory);
categoryRoutes.put("/", renameCategories);
categoryRoutes.delete("/:id", deleteCategory);
categoryRoutes.put("/share/:id", shareCategory);
categoryRoutes.put("/restrict/:id", restrictCategory);
