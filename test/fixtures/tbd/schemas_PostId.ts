import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const PostIdSchema = Type.Number({"minimum":1})
export type PostId = Static<typeof PostIdSchema>
