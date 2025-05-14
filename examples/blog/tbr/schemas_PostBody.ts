import { Clone, type Static, Type } from '@sinclair/typebox';
import { CommentSchema } from './schemas_Comment.js';
import { GenericTsSchema } from './schemas_GenericTs.js';
import { PostStatusSchema } from './schemas_PostStatus.js';
import { PostTxSchema } from './schemas_PostTx.js';
import { TitleTxSchema } from './schemas_TitleTx.js';
import { UserSchema } from './schemas_User.js';

export const PostBodySchema = Type.Object(
	{
		titleTx: Clone({ ...TitleTxSchema, ...{ default: 'hello' } }),
		postTx: Clone(PostTxSchema),
		author: Type.Optional(Clone({ ...UserSchema, ...{ default: 'joe' } })),
		comments: Type.Optional(Type.Array(Clone(CommentSchema))),
		statusCd: Type.Optional(Clone({ ...PostStatusSchema, ...{ default: 'draft' } })),
		statusTs: Type.Optional(Clone(GenericTsSchema)),
	},
	{ additionalProperties: false },
);
export type PostBody = Static<typeof PostBodySchema>;
