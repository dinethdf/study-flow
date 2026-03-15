import { z } from 'zod';

export const createTopicSchema = z.object({
  name: z.string().min(1, 'Topic name is required').max(100),
  description: z.string().optional(),
  completionPct: z.number().min(0).max(100).default(0),
  orderIndex: z.number().int().optional().default(0),
  notes: z.string().optional(),
});

export const updateTopicSchema = createTopicSchema.partial().extend({
  isCompleted: z.boolean().optional(),
});
