import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    console.log(authorization);
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];
  try {
    const result = jwt.verify(token, `${process.env.JWT_SECRET}`);
    if (typeof result !== "string" && result._id) {
      const user = await User.findOne({ _id: result._id });
      if (!user) {
        res.status(401).json({ error: "User does not exist" });
        return;
      }
      const issuedAt = new Date((result.iat ?? 1) * 1000);
      if (user.lastSignedOut && issuedAt < user.lastSignedOut) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }
      req.body.user = user;
      next();
      return;
    } else {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};
