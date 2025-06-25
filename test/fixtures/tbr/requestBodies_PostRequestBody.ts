import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { PostBodySchema } from './schemas_PostBody.ts';


export const PostRequestBodySchema = Clone(PostBodySchema)
export type PostRequestBody = Static<typeof PostRequestBodySchema>
