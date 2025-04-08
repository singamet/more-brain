import { Request, Response } from "express";

export const getRedditPost = async (req: Request, res: Response) => {
  const { url } = req.query;
  const encodedUrl = encodeURIComponent(url as string);
  const response = await fetch(
    `https://www.reddit.com/oembed?url=${encodedUrl}`,
    {
      headers: {
        "User-Agent": "More Brain/1.0 (singamet@outlook.com)",
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    res.status(404).json({ error: data });
    return;
  }
  res.status(200).json(data);
  return;
};
