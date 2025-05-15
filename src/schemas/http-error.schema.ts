import { z } from 'zod';

export const HttpErrorSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
  code: z.string().optional()
})

export const HttpNotFoundErrorSchema = HttpErrorSchema.describe("Recurso não encontrado")
export const HttpValidationErrorSchema = HttpErrorSchema.describe("Falha na validação dos dados")
export const HttpUnauthorizedErrorSchema = HttpErrorSchema.describe("Usuário não autorizado")