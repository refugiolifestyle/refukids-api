import { z } from 'zod';

export const NotificacaoSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  imagem: z.string().url().optional(),
  corpo: z.string(),
  cadastradoEm: z.string().datetime(),
  notificadoPor: z.string(),
});