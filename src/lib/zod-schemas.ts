import { z } from "zod";

export const postSchema = z.object({
  mediaUrl: z.string().url({ message: "Invalid url" }).optional(),
  postText: z.string(),
  type: z.string().optional(),
});

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().url(),
  userId: z.string().uuid().optional(),
});
