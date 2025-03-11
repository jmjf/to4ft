import { type Static, Type } from '@sinclair/typebox';

export const PostIdSchema = Type.Number({ minimum: 1 });
export type PostId = Static<typeof PostIdSchema>;
