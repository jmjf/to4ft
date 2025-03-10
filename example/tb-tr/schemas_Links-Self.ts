import { type Static, Type } from '@sinclair/typebox';

export const Links_SelfSchema = Type.Object({ self: Type.Optional(Type.String({ format: 'uri' })) });
export type Links_Self = Static<typeof Links_SelfSchema>;
