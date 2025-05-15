import { z } from 'zod';
import { TurmaSchema } from './turma.schema';

export const CultoSchema = z.object({
  data: z.string(),
  turmas: z.array(TurmaSchema),
});