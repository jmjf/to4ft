import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { TitleTxSchema } from './schemas_TitleTx.ts';
import { PostTxSchema } from './schemas_PostTx.ts';
import { UserSchema } from './schemas_User.ts';
import { PostStatusSchema } from './schemas_PostStatus.ts';
import { GenericTsSchema } from './schemas_GenericTs.ts';



export const PostBodySchema = Type.Object({"titleTx": Clone({...TitleTxSchema, ...{"default":"hello"}}),
"postTx": Clone(PostTxSchema),
"author": Type.Optional(Clone({...UserSchema, ...{"default":"joe"}})),
"statusCd": Type.Optional(Clone({...PostStatusSchema, ...{"default":"draft"}})),
"statusTs": Type.Optional(Clone({...GenericTsSchema, ...{"description":"The date and time when the post was put in the current status","example":"2025-11-12T13:14:15Z"}}))}, {"title":"PostBody","additionalProperties":false})
export type PostBody = Static<typeof PostBodySchema>
