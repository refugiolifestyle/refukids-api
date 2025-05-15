import { z } from 'zod';

export const ObservacaoSchema = z.object({
  id: z.string(),
  observacao: z.string(),
  servo: z.string(),
  notificado: z.boolean(),
  cadastradoEm: z.coerce.date(),
});