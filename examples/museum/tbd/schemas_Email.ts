import { type Static, Type } from '@sinclair/typebox';

export const EmailSchema = Type.String({ format: 'email' });
export type Email = Static<typeof EmailSchema>;
