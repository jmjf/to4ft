import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { PostIdSchema } from './schemas_PostId.ts';
import { TitleTxSchema } from './schemas_TitleTx.ts';
import { PostTxSchema } from './schemas_PostTx.ts';
import { UserSchema } from './schemas_User.ts';
import { CommentSchema } from './schemas_Comment.ts';
import { PostStatusSchema } from './schemas_PostStatus.ts';
import { GenericTsSchema } from './schemas_GenericTs.ts';



export const PostSchema = Type.Object({"postId": Clone(PostIdSchema),
"titleTx": Clone({...TitleTxSchema, ...{"default":"hello"}}),
"postTx": Clone(PostTxSchema),
"author": Type.Optional(Clone(UserSchema)),
"comments": Type.Optional(Type.Array(Clone(CommentSchema))),
"statusCd": Type.Optional(Clone({...PostStatusSchema, ...{"default":"draft"}})),
"statusTs": Type.Optional(Clone(GenericTsSchema))}, {"additionalProperties":false})
export type Post = Static<typeof PostSchema>
