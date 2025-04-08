import { AddCategoryType } from "../lib/types";

export const getCategories = async (token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/category`,
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
export const addCategory = async (data: AddCategoryType, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/category`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }
  return json;
};
export const renameCategories = async (
  newCategories: Map<string, string>,
  token: string,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/category`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ categories: Object.fromEntries(newCategories) }),
    },
  );
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }
  return json;
};
export const deleteCategory = async (_id: string, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/category/${_id}`,
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
export const getSharedCategories = async (hash: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/category/shared/category/${hash}`,
  );
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }
  return json;
};
