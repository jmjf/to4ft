import { Clone, type Static } from '@sinclair/typebox';
import { PetSchema } from './schemas_Pet.js';

export const PetBodySchema = Clone(PetSchema);
export type PetBody = Static<typeof PetBodySchema>;
