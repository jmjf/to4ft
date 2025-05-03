import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { UsersSchema } from './schemas_Users.ts';



export const UsersResponseSchema = Clone(UsersSchema)
export type UsersResponse = Static<typeof UsersResponseSchema>
