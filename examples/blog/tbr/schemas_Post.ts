import { Clone, type Static, Type } from '@sinclair/typebox';
import { CommentSchema } from './schemas_Comment.js';
import { GenericTsSchema } from './schemas_GenericTs.js';
import { PostIdSchema } from './schemas_PostId.js';
import { PostStatusSchema } from './schemas_PostStatus.js';
import { PostTxSchema } from './schemas_PostTx.js';
import { TitleTxSchema } from './schemas_TitleTx.js';
import { UserSchema } from './schemas_User.js';

export const PostSchema = Type.Object(
	{
		postId: Clone(PostIdSchema),
		titleTx: Clone({ ...TitleTxSchema, ...{ default: 'hello' } }),
		postTx: Clone(PostTxSchema),
		author: Type.Optional(Clone(UserSchema)),
		comments: Type.Optional(Type.Array(Clone(CommentSchema))),
		statusCd: Type.Optional(Clone({ ...PostStatusSchema, ...{ default: 'draft' } })),
		statusTs: Type.Optional(Clone(GenericTsSchema)),
	},
	{ additionalProperties: false },
);
export type Post = Static<typeof PostSchema>;
