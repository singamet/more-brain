import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(5, "Required").email(),
  password: z.string().min(1, "Required"),
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const signUpSchema = z.object({
  fullname: z
    .string()
    .min(3, "Required")
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
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and is at least 8 characters long.",
    ),
});

export const categorySchema = z.object({
  name: z
    .string({ message: "Required" })
    .min(1, { message: "Required" })
    .max(20, { message: "Keep category name short" }),
});
export const contentSchema = z.object({
  title: z.string().max(100, "Title too long"),
  link: z.string().url("Invalid URL").max(200, "Link is too long!").optional(),
  category: z.string().optional(),
  tags: z.array(z.object({ _id: z.string(), tagname: z.string() })),
});
