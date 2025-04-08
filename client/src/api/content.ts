import { AddContentType } from "../lib/types";

export const addContent = async (data: AddContentType, token: string) => {
  const strTags = data.tags.map((t) => t._id);
  const alterData = { ...data, tags: strTags };
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/content`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(alterData),
    },
  );
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }
  return json;
};
export const deleteContent = async (id: string, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/content/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }
  return json;
};
export const getContent = async (
  category: string,
  tag: string,
  token: string,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/content?category=${category}&tag=${tag}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }
  return json;
};
export const getSharedContent = async (
  hash: string,
  category: string,
  tag: string,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/content/shared/brain/${hash}?category=${category}&tag=${tag}`,
  );
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }
  return json;
};
