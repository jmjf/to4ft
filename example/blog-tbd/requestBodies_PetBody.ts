import { type Static, Type } from '@sinclair/typebox';

export const PetBodySchema = Type.Object({
	petId: Type.Optional(Type.String()),
	petName: Type.Optional(Type.String()),
});
export type PetBody = Static<typeof PetBodySchema>;
