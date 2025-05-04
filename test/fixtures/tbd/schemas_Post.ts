import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";

TypeRegistry.Set('ExtendedOneOf', (schema: {oneOf: unknown[]}, value) => 1 === schema.oneOf.reduce((acc: number, schema: unknown) => acc + (Value.Check(schema as TSchema, value) ? 1 : 0), 0))

const OneOf = <T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) => Type.Unsafe<Static<TUnion<T>>>({ ...options, [Kind]: 'ExtendedOneOf', oneOf })



export const PostSchema = Type.Object({"postId": Type.Number({"minimum":1}),
"titleTx": Type.String({"default":"hello","minLength":3,"maxLength":100}),
"postTx": Type.String({"minLength":1,"maxLength":1024}),
"statusCd": Type.Optional(Type.Union([ Type.Literal("draft"), Type.Literal("published"), Type.Literal("deleted")], {"default":"draft"})),
"statusTs": Type.Optional(Type.String({"format":"date-time"})),
"testNot": Type.Optional(Type.Not(Type.String())),
"testOneOf": Type.Optional(OneOf([ Type.Union([ Type.Literal("draft"), Type.Literal("published"), Type.Literal("deleted")]),
 Type.String({"default":"none","minLength":3,"maxLength":100})])),
"testAllOf": Type.Optional(Type.Intersect([ Type.Union([ Type.Literal("draft"), Type.Literal("published"), Type.Literal("deleted")]),
 Type.String({"default":"none","minLength":3,"maxLength":100})])),
"testAnyOf": Type.Optional(Type.Union([ Type.Union([ Type.Literal("draft"), Type.Literal("published"), Type.Literal("deleted")]),
 Type.String({"default":"none","minLength":3,"maxLength":100})])),
"testConstString": Type.Optional(Type.Literal("abc")),
"testConstNumber": Type.Optional(Type.Literal(123)),
"testConstArray": Type.Optional(Type.Union([ Type.Literal(123),
 Type.Literal("abc")])),
"testArrayItems": Type.Optional(Type.Array(Type.Union( Type.String(),
 Type.Number())))}, {"additionalProperties":false})
export type Post = Static<typeof PostSchema>
