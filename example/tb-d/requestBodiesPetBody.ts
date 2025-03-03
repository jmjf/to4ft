import { type Static, Type } from '@sinclair/typebox';

export const tbPetBody = Type.Object({ petId: Type.Optional(Type.String()), petName: Type.Optional(Type.String()) });
export type TbPetBody = Static<typeof tbPetBody>;
