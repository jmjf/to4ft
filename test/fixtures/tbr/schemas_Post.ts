import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { PostIdSchema } from './schemas_PostId.ts';
import { TitleTxSchema } from './schemas_TitleTx.ts';
import { PostTxSchema } from './schemas_PostTx.ts';
import { PostStatusSchema } from './schemas_PostStatus.ts';
import { GenericTsSchema } from './schemas_GenericTs.ts';

TypeRegistry.Set('ExtendedOneOf', (schema: {oneOf: unknown[]}, value) => 1 === schema.oneOf.reduce((acc: number, schema: unknown) => acc + (Value.Check(schema as TSchema, value) ? 1 : 0), 0))

const OneOf = <T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) => Type.Unsafe<Static<TUnion<T>>>({ ...options, [Kind]: 'ExtendedOneOf', oneOf })



export const PostSchema = Type.Object({"postId": Clone({...PostIdSchema, ...{"description":"Uniquely identifies a blog post"}}),
"titleTx": Clone({...TitleTxSchema, ...{"default":"hello"}}),
"postTx": Clone(PostTxSchema),
"statusCd": Type.Optional(Clone({...PostStatusSchema, ...{"default":"draft"}})),
"statusTs": Type.Optional(Clone({...GenericTsSchema, ...{"description":"The date and time when the post was put in the current status","example":"2025-11-12T13:14:15Z"}})),
"testNot": Type.Optional(Type.Not(Type.String())),
"testOneOf": Type.Optional(OneOf([ Clone(PostStatusSchema),
 Clone(TitleTxSchema)])),
"testAllOf": Type.Optional(Type.Intersect([ Clone(PostStatusSchema),
 Clone(TitleTxSchema)])),
"testAnyOf": Type.Optional(Type.Union([ Clone(PostStatusSchema),
 Clone(TitleTxSchema)])),
"testConstString": Type.Optional(Type.Literal("abc")),
"testConstNumber": Type.Optional(Type.Literal(123)),
"testConstArray": Type.Optional(Type.Union([ Type.Literal(123),
 Type.Literal("abc")])),
"testArrayItems": Type.Optional(Type.Array(Type.Union([ Type.String(),
 Type.Number()])))}, {"title":"Post","additionalProperties":false})
export type Post = Static<typeof PostSchema>
