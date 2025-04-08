import { Request, Response } from "express";
import { z } from "zod";
import { Tag } from "../models/tag";
import { Content } from "../models/content";
import mongoose from "mongoose";
import { generateHash } from "../utils";
import { User } from "../models/user";
import { Category } from "../models/category";

export const addContent = async (req: Request, res: Response) => {
  const schema = z.object({
    title: z.string().max(100, "Title can be at most 100 characters long"),
    link: z
      .string()
      .url("Link needs to be a valid URL")
      .max(200, "Link can be at most 200 characters long!")
      .optional(),
    category: z
      .string()
      .refine((x) => mongoose.Types.ObjectId.isValid(x), {
        message: "Invalid Category ID",
      })
      .optional(),
    tags: z
      .array(
        z.string().refine((x) => mongoose.Types.ObjectId.isValid(x), {
          message: "Invalid Tag ID",
        })
      )
      .optional(),
  });
  type reqType = z.infer<typeof schema>;
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  const { title, link, category, tags }: reqType = req.body;
  const { user } = req.body;
  try {
    if (tags && tags.length > 0) {
      const existingTags = await Tag.find({ _id: { $in: tags } });
      const existingIds = existingTags.map((tag) => tag._id.toString());
      const invalidTagIds = tags.filter((tag) => !existingIds.includes(tag));
      const invalidTags = await Tag.find({ _id: { $in: invalidTagIds } });
      if (invalidTagIds.length > 0) {
        res.status(400).json({
          error: `Invalid Tags: ${invalidTags
            .map((tag) => tag.tagname)
            .join(", ")}`,
        });
        return;
      }
    }
    if (category) {
      const categoryExists = await Category.find({ _id: category });
      if (!categoryExists) {
        res.status(400).json({
          error: "Invalid Category",
        });
        return;
      }
    }
    const content = await Content.create({
      title,
      link,
      category,
      tags,
      user: user._id,
    });
    if (!content) {
      res.status(500).json({ error: "Could not create content!" });
      return;
    }
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const editContent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Id" });
    return;
  }
  const schema = z.object({
    title: z.string().max(100, "Title can be at most 100 characters long"),
    link: z
      .string()
      .url("Link needs to be a valid URL")
      .max(200, "Link can be at most 200 characters long!")
      .optional(),
    category: z
      .string()
      .refine((x) => mongoose.Types.ObjectId.isValid(x), {
        message: "Invalid Category ID",
      })
      .optional(),
    tags: z
      .array(
        z.string().refine((x) => mongoose.Types.ObjectId.isValid(x), {
          message: "Invalid Tag ID",
        })
      )
      .optional(),
  });
  type reqType = z.infer<typeof schema>;
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  const { title, link, category, tags }: reqType = req.body;
  const { user } = req.body;
  try {
    const exists = await Content.findOne({ _id: id, user: user._id });
    if (!exists) {
      res.status(404).json({ error: "Content does not exists!" });
      return;
    }
    if (tags && tags.length > 0) {
      const existingTags = await Tag.find({ _id: { $in: tags } });
      const existingIds = existingTags.map((tag) => tag._id.toString());
      const invalidTagIds = tags.filter((tag) => !existingIds.includes(tag));
      const invalidTags = await Tag.find({ _id: { $in: invalidTagIds } });
      if (invalidTagIds.length > 0) {
        res.status(400).json({
          error: `Invalid Tags: ${invalidTags
            .map((tag) => tag.tagname)
            .join(", ")}`,
        });
        return;
      }
    }
    if (category) {
      const categoryExists = await Category.find({ _id: category });
      if (!categoryExists) {
        res.status(400).json({
          error: "Invalid Category",
        });
        return;
      }
    }
    const updated = await Content.findOneAndUpdate(
      { _id: id },
      {
        title,
        link,
        category,
        tags,
        user: user._id,
      },
      { new: true }
    );
    if (!updated) {
      res.status(500).json({ error: "Could not update content!" });
      return;
    }
    res.status(200).json(updated);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const deleteContent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Id" });
    return;
  }

  const { user } = req.body;
  try {
    const deleted = await Content.findOneAndDelete({ _id: id, user: user._id });
    if (!deleted) {
      res.status(500).json({ error: "Could not delete content!" });
      return;
    }
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const getContentList = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { category, tag } = req.query;

  try {
    const filter: {
      user: string;
      category?: string;
      tags?: { $in: string[] };
    } = { user: user._id };
    if (category) {
      filter.category = category as string;
    }
    if (tag) {
      filter.tags = { $in: [tag as string] };
    }
    const contentList = await Content.find(filter).populate("category tags");
    res.status(200).json(contentList);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const getContent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Id" });
    return;
  }

  const { user } = req.body;
  try {
    const content = await Content.findOne({ _id: id, user: user._id });
    if (!content) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.status(200).json(content);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};

export const shareContent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Id" });
    return;
  }
  const hash = generateHash(id);
  const { user } = req.body;
  try {
    const content = await Content.findOneAndUpdate(
      { _id: id, user: user._id },
      { shareLink: hash },
      { new: true }
    );
    res.status(200).json(content);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const restrictContent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Id" });
    return;
  }
  const { user } = req.body;
  try {
    const content = await Content.findOneAndUpdate(
      { _id: id, user: user._id },
      { shareLink: null },
      { new: true }
    );
    res.status(200).json(content);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const getSharedBrain = async (req: Request, res: Response) => {
  const { hash } = req.params;
  const { category, tag } = req.query;
  try {
    const user: any = await User.findOne({ shareLink: hash });
    const filter: {
      user: string;
      category?: string;
      tags?: { $in: string[] };
    } = { user: user._id };
    if (category) {
      filter.category = category as string;
    }
    if (tag) {
      filter.tags = { $in: [tag as string] };
    }
    const contentList = await Content.find(filter).populate("category tags");
    res.status(200).json(contentList);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const getSharedContent = async (req: Request, res: Response) => {
  const { hash } = req.params;
  try {
    const content = await Content.findOne({ shareLink: hash });
    res.status(200).json(content);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
export const getSharedCategory = async (req: Request, res: Response) => {
  const { hash } = req.params;
  try {
    const category = await Category.findOne({ shareLink: hash });
    if (!category) {
      res.status(400).json({ error: "Category not found" });
      return;
    }
    const contentList = await Content.find({ category });
    res.status(200).json(contentList);
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
