import { Clone, type Static, Type } from '@sinclair/typebox';
import { CommentSchema } from './schemas_Comment.ts';
import { GenericTsSchema } from './schemas_GenericTs.ts';
import { PostStatusSchema } from './schemas_PostStatus.ts';
import { PostTxSchema } from './schemas_PostTx.ts';
import { TitleTxSchema } from './schemas_TitleTx.ts';
import { UserSchema } from './schemas_User.ts';

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
