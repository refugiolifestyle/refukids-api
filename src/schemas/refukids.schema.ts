import { z } from 'zod';
import { UsuarioSchema } from './usuario.schema';
import { FamiliaSchema } from './familia.schema';
import { CultoSchema } from './culto.schema';
import { CheckinSchema } from './checkin.schema';

export const RefukidsSchema = z.object({
  usuarios: z.array(UsuarioSchema),
  familias: z.array(FamiliaSchema),
  cultos: z.array(CultoSchema),
  checkins: CheckinSchema,
});
