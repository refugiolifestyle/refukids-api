import { z } from 'zod';
import { capitalizeWords } from '../utils/helpers';

export const CriancaSchema = z.object({
  id: z.string().optional(),
  nome: z.string().trim().transform(capitalizeWords),
  foto: z.string().trim().url(),
  dataNascimento: z.string().date(),
  sexo: z.string(),
  observacao: z.string().optional(),
  cadastradoEm: z.string().datetime().optional(),
  checkins: z.array(z.string()).optional(),
});