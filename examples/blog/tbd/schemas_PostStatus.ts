import { type Static, Type } from '@sinclair/typebox';

export const PostStatusSchema = Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('deleted')]);
export type PostStatus = Static<typeof PostStatusSchema>;
