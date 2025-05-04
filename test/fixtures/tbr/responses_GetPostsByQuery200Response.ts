import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { PostSchema } from './schemas_Post.ts';



export const GetPostsByQuery200ResponseSchema = Type.Array(Clone(PostSchema),{"title":"GetPostsByQuery200Response"})
export type GetPostsByQuery200Response = Static<typeof GetPostsByQuery200ResponseSchema>
