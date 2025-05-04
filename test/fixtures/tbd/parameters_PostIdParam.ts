import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const PostIdParamSchema = Type.Object({"postId": Type.Number({"minimum":1})})
export type PostIdParam = Static<typeof PostIdParamSchema>
