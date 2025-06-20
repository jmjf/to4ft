import { type Static, Type } from '@sinclair/typebox';

export const PostIdParamSchema = Type.Object({ postId: Type.Number({ minimum: 1 }) });
export type PostIdParam = Static<typeof PostIdParamSchema>;
