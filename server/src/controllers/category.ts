import { Request, Response } from "express";
import { z } from "zod";
import { Category } from "../models/category";
import mongoose from "mongoose";
import { generateHash } from "../utils";
import { Content } from "../models/content";
import { User } from "../models/user";

export const addCategory = async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string().max(100, "Title can be at most 100 characters long"),
  });
  type reqType = z.infer<typeof schema>;
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  const { name }: reqType = req.body;
  const { user } = req.body;
  try {
    const categoryExists = await Category.findOne({ name, user: user._id });
    if (categoryExists) {
      res.status(400).json({
        error: "Category already exists!",
      });
      return;
    }
    const created = await Category.create({
      name,
      user: user._id,
    });
    if (!created) {
      res.status(500).json({ error: "Could not create category!" });
      return;
    }
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const renameCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Id" });
    return;
  }
  const schema = z.object({
    name: z.string().max(100, "Title can be at most 100 characters long"),
  });
  type reqType = z.infer<typeof schema>;
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  const { name }: reqType = req.body;
  const { user } = req.body;
  try {
    const exists = await Category.findOne({
      _id: id,
      user: user._id,
    });
    if (!exists) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    if (exists.isPreset) {
      res.status(400).json({ error: "Cannot rename this category!" });
      return;
    }
    const renamed = await Category.findOneAndUpdate(
      {
        _id: id,
        user: user._id,
      },
      { name },
      { new: true }
    );
    if (!renamed) {
      res.status(500).json({ error: "Could not renamed category!" });
      return;
    }
    res.status(200).json(renamed);
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const renameCategories = async (req: Request, res: Response) => {
  const schema = z.object({
    categories: z.record(
      z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid Id",
      }),
      z.string()
    ),
  });
  type reqType = z.infer<typeof schema>;
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  const { categories }: reqType = req.body;
  const { user } = req.body;
  try {
    const updated = await Promise.all(
      Object.entries(categories).map(async ([_id, name]) => {
        const exists = await Category.findOne({ _id, user: user._id });
        if (exists && !exists.isPreset) {
          return await Category.findOneAndUpdate(
            {
              _id,
              user: user._id,
            },
            { name },
            { new: true }
          );
        }
        return null;
      })
    );
    const validUpdated = updated.filter((c) => c !== null);
    if (!validUpdated || validUpdated.length <= 0) {
      res.status(500).json({ error: "Could not rename categories!" });
      return;
    }
    res.status(200).json(validUpdated);
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Id" });
    return;
  }

  const { user } = req.body;
  try {
    const content = await Content.find({ category: id, user: user._id });
    if (content && content.length > 0) {
      res.status(400).json({
        error:
          "Could not delete category! There is content assigned to this category.",
      });
      return;
    }
    const exists = await Category.findOne({
      _id: id,
      user: user._id,
    });
    if (!exists) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    if (exists.isPreset) {
      res.status(400).json({ error: "Cannot delete this category!" });
      return;
    }
    const deleted = await Category.findOneAndDelete({
      _id: id,
      user: user._id,
    });
    if (!deleted) {
      res.status(500).json({ error: "Could not delete category!" });
      return;
    }
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const getCategories = async (req: Request, res: Response) => {
  const { user } = req.body;
  try {
    const allCategories = await Category.find({
      user: user._id,
    });
    if (!allCategories || allCategories.length === 0) {
      res.status(404).json({ error: "No categories found" });
      return;
    }
    res.status(200).json(allCategories);
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const shareCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Id" });
    return;
  }
  const hash = generateHash(id);
  const { user } = req.body;
  try {
    const category = await Category.findOneAndUpdate(
      { _id: id, user: user._id },
      { shareLink: hash },
      { new: true }
    );
    res.status(200).json(category);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const restrictCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Id" });
    return;
  }
  const { user } = req.body;
  try {
    const category = await Category.findOneAndUpdate(
      { _id: id, user: user._id },
      { shareLink: null },
      { new: true }
    );
    res.status(200).json(category);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const getSharedCategories = async (req: Request, res: Response) => {
  const { hash } = req.params;
  try {
    const user: any = await User.findOne({ shareLink: hash });

    const categories = await Category.find({ user: user._id });
    res.status(200).json(categories);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
