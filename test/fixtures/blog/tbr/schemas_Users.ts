import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";
import { UserSchema } from './schemas_User.ts';



export const UsersSchema = Type.Array(Clone(UserSchema))
export type Users = Static<typeof UsersSchema>
