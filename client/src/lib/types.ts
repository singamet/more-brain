import { z } from "zod";
import {
  categorySchema,
  contentSchema,
  signInSchema,
  signUpSchema,
} from "./schema";

export type SignUpType = z.infer<typeof signUpSchema>;

export type SignInType = z.infer<typeof signInSchema>;

export type CurrentUserType = {
  isAuth: boolean;
  fullname?: string;
  email?: string;
  token?: string;
  shareLink?: string | null;
};
export type AuthResponseType = {
  fullname: string;
  email: string;
  token: string;
};
export const editCategoriesMap = new Map<string, string>();
export type DropDownOptionType = {
  _id: string;
  name: string;
};
export type AddCategoryType = z.infer<typeof categorySchema>;
export type CategoryType = AddCategoryType & {
  _id: string;
  isPreset: boolean;
};
export type AddContentType = z.infer<typeof contentSchema>;
export type ContentType = Omit<AddContentType, "category"> & {
  _id: string;
  createdAt: Date;
  category?: {
    _id: string;
    name: string;
  };
};
