import { type Static, Type } from '@sinclair/typebox';

export const XDateHeaderSchema = Type.Unsafe<Date | string>(Type.String({ format: 'date' }));
export type XDateHeader = Static<typeof XDateHeaderSchema>;
