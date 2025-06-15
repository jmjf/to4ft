import { type Static, Type } from '@sinclair/typebox';

export const XTestHeaderParamSchema = Type.String();
export type XTestHeaderParam = Static<typeof XTestHeaderParamSchema>;
