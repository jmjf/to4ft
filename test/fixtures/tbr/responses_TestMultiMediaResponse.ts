import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { PostSchema } from './schemas_Post.ts';


export const TestMultiMediaResponseSchema = Clone(PostSchema)
export type TestMultiMediaResponse = Static<typeof TestMultiMediaResponseSchema>
