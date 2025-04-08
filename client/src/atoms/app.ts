import { atom } from "jotai";
import { CategoryType, ContentType, CurrentUserType } from "../lib/types";

export const currentUser = atom<CurrentUserType>();

export const categoriesAtom = atom<CategoryType[]>([]);
export const editCategoriesAtom = atom(false);
export const currentCategoryAtom = atom<CategoryType>();

export const contentItemsAtom = atom<ContentType[]>([]);
export const searchQueryAtom = atom("");
export const filteredContentAtom = atom<ContentType[]>((get) => {
  const data = get(contentItemsAtom);
  const query = get(searchQueryAtom);
  if (!query) return data;
  return data.filter(
    (c) =>
      c.title.toLowerCase().includes(query) ||
      c.link?.toLowerCase().includes(query) ||
      c.tags.some((t) => t.tagname.toLowerCase().includes(query)),
  );
});
