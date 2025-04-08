import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import { generateHash } from "../utils";
import { Category } from "../models/category";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const signup = async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    fullname: z
      .string()
      .min(3, "Name must be atleast 3 characters")
      .max(100, "Name can be at most 100 characters long."),
    email: z
      .string()
      .email()
      .min(5, "Email must be at least 5 characters long")
      .max(100, "Email can be at most 100 characters long."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(100, "Password can be at most 100 characters long.")
      .regex(
        passwordRegex,
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and is at least 8 characters long."
      ),
  });
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(411).json({ error: result.error });
    return;
  }
  const { fullname, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ error: "Email already exists!" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const added = await User.create({ fullname, email, password: hash });
    if (!added) {
      res.status(500).json({ error: "Server error occurred!" });
      return;
    }
    const presetCategories = await Category.create([
      { name: "Documents", user: added._id, isPreset: true },
      { name: "Tweets", user: added._id, isPreset: true },
      { name: "Videos", user: added._id, isPreset: true },
      { name: "Links", user: added._id, isPreset: true },
    ]);
    if (!presetCategories || presetCategories.length < 4) {
      await Category.deleteMany({ user: added._id });
      await User.findByIdAndDelete(added._id);
      res.status(500).json({ error: "Server error occurred!" });
      return;
    }
    //JWT Token
    const token = jwt.sign({ _id: added._id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "1d",
    });
    res.status(201).json({ fullname, email, token });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const signin = async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(401).json({ error: result.error });
    return;
  }
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (!exists) {
      res.status(401).json({
        error: "This email does not exist in our system. Please sign up.",
      });
      return;
    }
    const verifyPassword = await bcrypt.compare(password, exists.password);
    if (!verifyPassword) {
      res.status(401).json({ error: "Invalid Credentials!" });
      return;
    }

    //JWT Token
    const token = jwt.sign({ _id: exists._id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "1d",
    });
    res.status(201).json({
      fullname: exists.fullname,
      email: exists.email,
      token,
      shareLink: exists.shareLink,
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const signout = async (req: Request, res: Response): Promise<void> => {
  const { user } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: user._id },
      { lastSignedOut: new Date() }
    );

    res.status(204).json({ message: "Sign Out successful!" });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const verify = async (req: Request, res: Response): Promise<void> => {
  const { user } = req.body;

  res.status(200).json({
    fullname: user.fullname,
    email: user.email,
    shareLink: user.shareLink,
  });
  return;
};

export const shareBrain = async (req: Request, res: Response) => {
  const { user } = req.body;
  const hash = generateHash(user._id.toString());
  try {
    const updated = await User.findOneAndUpdate(
      { _id: user._id },
      { shareLink: hash },
      { new: true }
    );
    res.status(200).json({ shareLink: updated?.shareLink });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const restrictBrain = async (req: Request, res: Response) => {
  const { user } = req.body;
  try {
    const updated = await User.findOneAndUpdate(
      { _id: user._id },
      { shareLink: null },
      { new: true }
    );
    res.status(200).json({ shareLink: updated?.shareLink });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
