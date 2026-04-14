import { z } from "zod";

/** Request body for creating a new recipe. */
export const createRecipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  ingredients: z.array(z.string()).min(1, "At least one ingredient is required"),
});

export type CreateRecipeBody = z.infer<typeof createRecipeSchema>;
