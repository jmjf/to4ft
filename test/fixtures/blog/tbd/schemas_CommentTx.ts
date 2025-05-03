import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";



export const CommentTxSchema = Type.String({"minLength":1,"maxLength":256})
export type CommentTx = Static<typeof CommentTxSchema>
