import { type Static, Type } from '@sinclair/typebox';

export const Links_DestinationSchema = Type.Object({ self: Type.Optional(Type.String({ format: 'uri' })) });
export type Links_Destination = Static<typeof Links_DestinationSchema>;
