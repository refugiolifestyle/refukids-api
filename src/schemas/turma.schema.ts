import { z } from 'zod';
import { CheckinSchema } from './checkin.schema';

export const TurmaSchema = z.object({
  turma: z.string(),
  checkins: z.array(CheckinSchema),
});