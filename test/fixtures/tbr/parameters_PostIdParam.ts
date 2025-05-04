import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { PostIdSchema } from './schemas_PostId.ts';



export const PostIdParamSchema = Type.Object({"postId": Clone({...PostIdSchema, ...{"description":"A unique identifier for a post from parameters"}})})
export type PostIdParam = Static<typeof PostIdParamSchema>
