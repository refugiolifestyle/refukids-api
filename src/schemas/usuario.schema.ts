import { z } from 'zod';
import { cpf } from 'cpf-cnpj-validator';
import { NotificacaoSchema } from './notificacao.schema';
import { capitalizeWords } from '../utils/helpers';

export const UsuarioSchema = z.object({
  cpf: z.string().refine(cpf.isValid, { message: "CPF inválido" }),
  uid: z.string().optional(),
  email: z.string().email().optional(),
  nome: z.string().trim().transform(capitalizeWords),
  foto: z.string().url("A foto precisa ser uma URL Válida").optional(),
  familia: z.string().trim().transform(capitalizeWords).optional(),
  notificacoes: z.record(z.string().uuid(), NotificacaoSchema).optional(),
  notificacoesToken: z.string().optional(),
  cadastradoEm: z.string().datetime(),
  cadastroFinalizado: z.boolean(),
});