import { Clone, type Static, Type } from '@sinclair/typebox';
import { GenericTsSchema } from './schemas_GenericTs.ts';
import { PostIdSchema } from './schemas_PostId.ts';

export const ObjectSchemaForRefSchema = Type.Object({
	postId: Clone(PostIdSchema),
	postedTs: Type.Optional(Clone(GenericTsSchema)),
});
export type ObjectSchemaForRef = Static<typeof ObjectSchemaForRefSchema>;
