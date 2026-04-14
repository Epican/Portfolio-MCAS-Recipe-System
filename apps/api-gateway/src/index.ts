// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRecipeSchema } from './schemas/recipe.schema';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // CRITICAL: Allows Express to parse incoming JSON payloads

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'api-gateway' });
});

// The Recipe Intake Route
app.post('/recipes', (req: Request, res: Response): void => {
  // 1. Strict Validation via Zod
  const validationResult = createRecipeSchema.safeParse(req.body);

  if (!validationResult.success) {
    // Return 400 Bad Request immediately with the exact fields that failed
    res.status(400).json({
      error: 'Invalid payload',
      details: validationResult.error.format(),
    });
    return;
  }

  const validRecipe = validationResult.data;

  // 2. TODO: Save 'Pending' status to Prisma Database here
  console.log(`[DB MOCK] Saved pending recipe: ${validRecipe.title}`);

  // 3. TODO: Publish message to GCP Pub/Sub for the Go Worker here
  console.log(`[PUB/SUB MOCK] Fired event for AI processing`);

  // 4. Return 202 Accepted instantly
  // This tells the Flutter app: "We got it, check back later for the AI results."
  res.status(202).json({
    message: 'Recipe received and queued for MCAS safety verification.',
    recipeTitle: validRecipe.title,
    status: 'pending'
  });
});

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});