import { type Static, Type } from '@sinclair/typebox';

export const XTestHeaderSchema = Type.String();
export type XTestHeader = Static<typeof XTestHeaderSchema>;
