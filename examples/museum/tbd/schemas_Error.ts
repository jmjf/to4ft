import { type Static, Type } from '@sinclair/typebox';

export const ErrorSchema = Type.Object({ type: Type.Optional(Type.String()), title: Type.Optional(Type.String()) });
export type Error = Static<typeof ErrorSchema>;
