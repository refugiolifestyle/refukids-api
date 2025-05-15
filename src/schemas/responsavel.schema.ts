import { z } from 'zod';
import { capitalizeWords, onlyNumbers } from '../utils/helpers';

export const ResponsavelSchema = z.object({
  id: z.string().trim().optional(),
  cpf: z.string().trim().transform(onlyNumbers),
  nome: z.string().trim().transform(capitalizeWords),
  foto: z.string().trim().url(),
  sexo: z.enum(["Masculino", "Feminino"]),
  telefone: z.string().trim().transform(onlyNumbers),
  observacao: z.string().trim().optional(),
  parentesco: z.string().trim(),
  endereco: z.string().trim(),
  numero: z.string().trim(),
  complemento: z.string().trim().optional(),
  bairro: z.string().trim(),
  cidade: z.string().trim(),
  cep: z.string().trim().transform(onlyNumbers),
  cadastradoEm: z.string().datetime(),
});