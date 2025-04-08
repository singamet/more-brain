import { Router } from "express";
import {
  restrictBrain,
  shareBrain,
  signin,
  signout,
  signup,
  verify,
} from "../controllers/user";
import { authMiddleware } from "../middleware/auth";
export const userRoutes = Router();

userRoutes.post("/signup", signup);
userRoutes.post("/signin", signin);
userRoutes.put("/signout", authMiddleware, signout);
userRoutes.get("/verify", authMiddleware, verify);
userRoutes.put("/share", authMiddleware, shareBrain);
userRoutes.put("/restrict", authMiddleware, restrictBrain);
