import { Clone, type Static, Type } from '@sinclair/typebox';
import { OneOf } from './OneOf.ts';
import { GenericTsSchema } from './schemas_GenericTs.ts';
import { PostIdSchema } from './schemas_PostId.ts';
import { PostStatusSchema } from './schemas_PostStatus.ts';
import { PostTxSchema } from './schemas_PostTx.ts';
import { TitleTxSchema } from './schemas_TitleTx.ts';

export const PostSchema = Type.Object(
	{
		postId: Clone(PostIdSchema),
		titleTx: Clone({ ...TitleTxSchema, ...{ default: 'hello' } }),
		postTx: Clone(PostTxSchema),
		statusCd: Type.Optional(Clone({ ...PostStatusSchema, ...{ default: 'draft' } })),
		statusTs: Type.Optional(Clone(GenericTsSchema)),
		testNot: Type.Optional(Type.Not(Type.String())),
		testOneOf: Type.Optional(OneOf([Clone(PostStatusSchema), Clone(TitleTxSchema)])),
		testAllOf: Type.Optional(Type.Intersect([Clone(PostStatusSchema), Clone(TitleTxSchema)])),
		testAnyOf: Type.Optional(Type.Union([Clone(PostStatusSchema), Clone(TitleTxSchema)])),
		testConstString: Type.Optional(Type.Literal('abc')),
		testConstNumber: Type.Optional(Type.Literal(123)),
		testConstArray: Type.Optional(Type.Union([Type.Literal('abc'), Type.Literal(123)])),
		testArrayItems: Type.Optional(Type.Array(Type.Union([Type.String(), Type.Number()]))),
	},
	{ additionalProperties: false },
);
export type Post = Static<typeof PostSchema>;
