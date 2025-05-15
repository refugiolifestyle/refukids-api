import { z } from 'zod';

export const FamiliaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  criancas: z.record(z.string(), z.string()).optional(),
  responsaveis: z.record(z.string(), z.string()).optional(),
  tios: z.record(z.string(), z.string()).optional(),
  cadastradoEm: z.string(),
});