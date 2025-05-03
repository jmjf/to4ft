import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const CommentIdParamSchema = Type.Number({"minimum":1})
export type CommentIdParam = Static<typeof CommentIdParamSchema>
