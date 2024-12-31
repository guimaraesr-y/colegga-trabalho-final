import { object, string, boolean, number } from "zod"

export const flashSchema = object({
  title: string({ required_error: "Title is required" })
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: string({ required_error: "Content is required" })
    .min(1, "Content is required"),
  isComment: boolean().default(false),
  refId: string().optional(),
  ref: object({ connect: object({ id: string() }) }).optional(),
  authorId: string({ required_error: "Author ID is required" }),
})

export const updateFlashScheme = flashSchema.extend({
  likes: object({ connect: object({ id: string() }) }).optional(),
  likesCount: number().optional(),
})