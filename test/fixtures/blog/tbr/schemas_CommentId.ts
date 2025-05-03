import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const CommentIdSchema = Type.Number({"minimum":1})
export type CommentId = Static<typeof CommentIdSchema>
