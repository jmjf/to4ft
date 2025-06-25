import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const PostTxSchema = Type.String({"minLength":1,"maxLength":1024,"description":"Contents of a post"})
export type PostTx = Static<typeof PostTxSchema>
