import { z } from "zod";

export const postSchema = z.object({
  mediaUrl: z.string().url({ message: "Invalid url" }),
  postText: z.string().optional(),
  type: z.string(),
});

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().url(),
});
