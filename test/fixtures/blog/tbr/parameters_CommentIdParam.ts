import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { CommentIdSchema } from './schemas_CommentId.ts';



export const CommentIdParamSchema = Clone(CommentIdSchema)
export type CommentIdParam = Static<typeof CommentIdParamSchema>
