import { type Static, Type } from '@sinclair/typebox';

export const Links_OriginSchema = Type.Object({ self: Type.Optional(Type.String({ format: 'uri' })) });
export type Links_Origin = Static<typeof Links_OriginSchema>;
