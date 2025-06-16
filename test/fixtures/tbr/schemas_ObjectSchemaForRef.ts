import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { PostIdSchema } from './schemas_PostId.ts';
import { GenericTsSchema } from './schemas_GenericTs.ts';



export const ObjectSchemaForRefSchema = Type.Object({"postId": Clone(PostIdSchema),
"postedTs": Type.Optional(Clone(GenericTsSchema))})
export type ObjectSchemaForRef = Static<typeof ObjectSchemaForRefSchema>
