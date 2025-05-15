import { z } from 'zod';
import { ObservacaoSchema } from './observacao.schema';

export const CheckinSchema = z.object({
  id: z.string(),
  familia: z.string(),
  crianca: z.string(),
  responsavel: z.string(),
  culto: z.string(),
  turma: z.string(),
  impressora: z.string(),
  observacoes: z.array(ObservacaoSchema),
  cadastradoEm: z.coerce.date(),
  recebidaEm: z.coerce.date(),
  recebidaFoto: z.string().url().optional(),
  recebidaPor: z.string(),
  entregueEm: z.coerce.date(),
  entregueFoto: z.string().url().optional(),
  entreguePor: z.string(),
  entreguePara: z.string(),
});