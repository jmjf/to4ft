import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { UserIdSchema } from './schemas_UserId.ts';


export const UserIdParamSchema = Type.Object({"userId": Clone({...UserIdSchema, ...{"description":"A unique identifier for a user"}})}, {"title":"UserIdParam"})
export type UserIdParam = Static<typeof UserIdParamSchema>
