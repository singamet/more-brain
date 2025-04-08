import { Request, Response } from "express";
import { z } from "zod";
import { Tag } from "../models/tag";

export const createTag = async (req: Request, res: Response) => {
  const schema = z.object({
    tagname: z.string().max(50, "Tag name can be at most 50 characters"),
  });
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(411).json({ error: result.error });
    return;
  }
  const { tagname } = req.body;
  try {
    const exists = await Tag.findOne({
      tagname: { $regex: `^${tagname}$`, $options: "i" },
    });
    if (exists) {
      res.status(400).json({ error: "Tag already exists" });
      return;
    }
    const tag = await Tag.create({ tagname });
    res.status(200).json(tag);
    return;
  } catch (error) {
    res.status(500).json({ error: "A server error occurred" + error });
    return;
  }
};

export const searchTag = async (req: Request, res: Response) => {
  const schema = z.object({
    search: z.string().max(20, "Query can be at most 20 characters").optional(),
  });
  const result = schema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  const { search } = req.query;
  try {
    const query = search
      ? {
          tagname: { $regex: search, $options: "i" },
        }
      : {};
    const resultSet = await Tag.find(query);
    if (resultSet.length <= 0) {
      res.status(404).json({ error: "No results found" });
      return;
    }
    res.status(200).json(resultSet);
    return;
  } catch (error) {
    res.status(500).json({ error: "A server error occurred" + error });
    return;
  }
};
