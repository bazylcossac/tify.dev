import { z } from "zod";

export const postSchema = z.object({
  mediaUrl: z.string().optional(),
  postText: z.string(),
  type: z.string().optional(),
});

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().url(),
  userId: z.string().uuid().optional(),
});

export const commentSchema = z.object({
  commentText: z.string(),
  postId: z.string().uuid(),
  type: z.string().optional(),
  mediaUrl: z.string().url().optional(),
});

export const backgroundUrlSchema = z.string().url();
